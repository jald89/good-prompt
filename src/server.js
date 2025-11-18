// Load local .env in development so process.env is populated (no-op if not present)
try {
  require('dotenv').config();
} catch (e) {
  /* ignore if dotenv is not installed; package.json updated to include it */
}

const express = require('express');
const analyzeRoutes = require('./routes/analyzeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || '*')
  .split(',')
  .map((origin) => origin.trim())
  .map((origin) => origin.replace(/\/$/, ''))
  .filter(Boolean);

function appendVaryHeader(res, value) {
  const current = res.getHeader('Vary');
  if (!current) {
    res.setHeader('Vary', value);
    return;
  }

  const existing = Array.isArray(current) ? current.join(',') : current;
  const items = existing.split(',').map((item) => item.trim().toLowerCase());
  if (!items.includes(value.toLowerCase())) {
    res.setHeader('Vary', `${existing}, ${value}`);
  }
}

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin ? req.headers.origin.replace(/\/$/, '') : undefined;
  const allowAll = allowedOrigins.includes('*');
  const isAllowed =
    allowAll ||
    (requestOrigin ? allowedOrigins.includes(requestOrigin) : false);

  appendVaryHeader(res, 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  if (allowAll) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (isAllowed && requestOrigin) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({
    name: 'PromptScore Clone Prototype',
    status: 'ok',
    features: ['prompt-analysis', 'prompt-and-image-analysis (coming-soon)']
  });
});

app.use('/api/analyze', analyzeRoutes);

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled error during request', err);
  res.status(500).json({ message: 'Unexpected error', details: err.message });
});

if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Prompt analysis server listening on port ${PORT}`);
  });
}

module.exports = app;
