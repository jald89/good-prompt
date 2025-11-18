const express = require('express');
const { analyzePrompt } = require('../services/analyzePrompt');

const router = express.Router();

// POST /api/analyze/prompt
// Behavior:
// - If API_MODE === 'n8n' and N8N_SERVER_URL is configured on the server, forward the payload to that webhook.
// - Otherwise, run local analysis (analyzePrompt) and return the result.
router.post('/prompt', async (req, res) => {
  const payload = req.body || {};

  const serverApiMode = (process.env.API_MODE || 'server').trim();
  const n8nUrl = (process.env.N8N_SERVER_URL || '').trim();

  try {
    if (serverApiMode === 'n8n') {
      if (!n8nUrl) {
        return res.status(500).json({ message: 'N8N_SERVER_URL no está configurado en el servidor.' });
      }

      // Forward the request to n8n webhook
      const target = n8nUrl.replace(/\/$/, '');
      const TIMEOUT_MS = 30000; // 30 segundos de timeout

      // If the incoming request is multipart/form-data (file upload), forward the raw stream
      // to n8n so the file is preserved. express.json() doesn't parse multipart bodies, so
      // req.body will be empty; forwarding an empty JSON would send `{}` (content-length: 2).
      const incomingContentType = (req.headers['content-type'] || '').toLowerCase();
      const isMultipart = incomingContentType.startsWith('multipart/form-data');

      let forwardResponse;
      const controller = new AbortController();
      if (isMultipart) {
        // Clone and sanitize incoming headers for forwarding
        const forwardHeaders = { ...req.headers };
        // Remove hop-by-hop or host-specific headers that shouldn't be forwarded
        delete forwardHeaders.host;
        delete forwardHeaders.connection;
        delete forwardHeaders['content-length'];

        // Forward the original request stream as the body. Node's fetch accepts a stream.
        // Note: undici (Node fetch) requires the `duplex` option when sending a stream as the body.
        forwardResponse = await fetch(target, {
          method: 'POST',
          headers: forwardHeaders,
          body: req,
          // Allows streaming the incoming request body through fetch
          duplex: 'half',
        });
      } else {
        // Use global fetch (Node 18+) to forward JSON payload. If not available, this will throw and be caught.
        forwardResponse = await fetch(target, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const contentType = forwardResponse.headers.get('content-type') || '';
      let json;
      
      // Get response text first, then try to parse it
      const rawText = await forwardResponse.text();
      
      if (contentType.includes('application/json') && rawText) {
        try {
          // Intenta parsear el JSON como viene
          json = JSON.parse(rawText);
        } catch (firstErr) {
          try {
            // Si falla, intenta limpiar y parsear el texto
            const cleanedText = rawText
              .replace(/^\[|\]$/g, '') // Elimina [ ] del inicio/fin
              .replace(/\n/g, '') // Elimina saltos de línea
              .trim(); // Elimina espacios en blanco
            
            if (cleanedText) {
              json = JSON.parse(cleanedText);
            }
          } catch (secondErr) {
            // Si aún falla, logueamos el error y la respuesta para debugging
            // eslint-disable-next-line no-console
            console.warn('Failed to parse JSON from n8n response:', { 
              firstErr, 
              secondErr,
              status: forwardResponse.status,
              contentType,
              rawText: rawText.slice(0, 200) + '...' // Log primeros 200 chars para debug
            });
            json = undefined;
          }
        }

        // If n8n returns the expected `output` wrapper, map it to the frontend shape.
        if (json && json.output) {
          const out = json.output || {};
          const promptText = String(payload.prompt || '');
          const charCount = promptText.length;
          const wordCount = promptText.trim() ? promptText.trim().split(/\s+/).length : 0;

          const analysis = {
            // numeric score from n8n
            promptQualityScore: typeof out.puntuacion === 'number' ? out.puntuacion : Number(out.puntuacion) || null,
            charCount,
            wordCount,
            // n8n may not return keywords in the same shape; leave empty to avoid UI errors
            keywords: [],
            // minimal structure placeholder
            structure: {
              sentenceCount: 0,
              hasQuestions: false,
              averageSentenceLength: 0,
            },
            // suggestions mapped from consejos_de_mejora if present
            suggestions: Array.isArray(out.consejos_de_mejora) ? out.consejos_de_mejora : [] ,
            // preserve the raw long-form analysis and specific criteria for debugging/display
            raw: {
              analisis_general: out.analisis_general,
            },
            criterios_especificos: out.criterios_especificos,
          };

          return res.status(forwardResponse.status).json({
            type: 'prompt-only',
            prompt: promptText,
            analysis,
            metadata: {
              evaluatedAt: new Date().toISOString(),
              source: 'n8n',
            },
          });
        }

        // Fallback: return the raw json when no output wrapper is detected
        return res.status(forwardResponse.status).json(json);
      }

      // If content-type wasn't JSON or parsing failed, return the raw text (may be empty)
      return res.status(forwardResponse.status).send(rawText);
    }

    // Default/local analysis
    const { prompt } = payload;
    const analysis = analyzePrompt(prompt);
    return res.json({
      type: 'prompt-only',
      prompt: prompt || '',
      analysis,
      metadata: {
        evaluatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error handling analysis request', err);
    return res.status(500).json({ message: err.message || 'Error forwarding request' });
  }
});

module.exports = router;
