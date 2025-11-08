const express = require('express');
const { analyzePrompt } = require('../services/analyzePrompt');

const router = express.Router();

router.post('/prompt', (req, res) => {
  const { prompt } = req.body || {};
  const analysis = analyzePrompt(prompt);
  res.json({
    type: 'prompt-only',
    prompt: prompt || '',
    analysis,
    metadata: {
      evaluatedAt: new Date().toISOString()
    }
  });
});

module.exports = router;
