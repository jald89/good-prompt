const express = require('express');
const analyzeRoutes = require('./routes/analyzeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

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
