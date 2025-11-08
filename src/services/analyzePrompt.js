const SENTENCE_REGEX = /[^.!?]+[.!?]*/g;

function normalizePrompt(prompt) {
  return (prompt || "").trim();
}

function getWordTokens(prompt) {
  return normalizePrompt(prompt)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function scorePromptLength(wordCount) {
  const idealMin = 20;
  const idealMax = 80;

  if (wordCount === 0) {
    return { score: 0, suggestion: "Añade detalles al prompt para obtener un análisis útil." };
  }

  if (wordCount < idealMin) {
    return {
      score: Math.max(10, Math.round((wordCount / idealMin) * 60)),
      suggestion: "Amplía el prompt con contexto, estilo y detalles visuales relevantes."
    };
  }

  if (wordCount > idealMax) {
    return {
      score: Math.max(30, Math.round(((idealMax / wordCount) ** 0.4) * 100)),
      suggestion: "Reduce redundancias y centra el prompt en los elementos clave."
    };
  }

  return { score: 95, suggestion: null };
}

function detectStructure(prompt) {
  const normalized = normalizePrompt(prompt);
  const sentences = normalized.match(SENTENCE_REGEX) || [];
  const hasQuestions = /\?/g.test(normalized);
  return {
    sentenceCount: sentences.length,
    hasQuestions,
    averageSentenceLength: sentences.length
      ? Math.round(normalized.split(/\s+/).filter(Boolean).length / sentences.length)
      : 0
  };
}

function extractKeywords(tokens) {
  const stopWords = new Set([
    "the", "and", "or", "a", "an", "of", "to", "in", "on", "with", "for",
    "una", "un", "de", "el", "la", "los", "las", "y", "o", "para", "con"
  ]);

  const frequency = new Map();
  tokens.forEach((token) => {
    if (token.length <= 3 || stopWords.has(token)) return;
    frequency.set(token, (frequency.get(token) || 0) + 1);
  });

  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));
}

function buildSuggestions(lengthEvaluation, structure, tokens) {
  const suggestions = [];

  if (lengthEvaluation.suggestion) {
    suggestions.push(lengthEvaluation.suggestion);
  }

  if (structure.sentenceCount <= 1) {
    suggestions.push(
      "Divide el prompt en frases separadas para destacar elementos visuales y estilo."
    );
  }

  const uniqueTokens = new Set(tokens);
  if (!Array.from(uniqueTokens).some((token) => /style|lighting|color|composition/.test(token))) {
    suggestions.push(
      "Describe estilo, iluminación, paleta de color o composición para orientar mejor al modelo."
    );
  }

  if (!Array.from(uniqueTokens).some((token) => /camera|lens|angle|render/.test(token))) {
    suggestions.push(
      "Incluye terminología de cámara o render si buscas un resultado fotográfico o 3D más preciso."
    );
  }

  return [...new Set(suggestions)];
}

function computeQualityScore(lengthEvaluation, structure, tokens) {
  const diversityScore = Math.min(30, new Set(tokens).size * 2);
  const structuralScore = structure.sentenceCount > 1 ? 25 : 10;
  const detailBonus = tokens.some((token) => /style|lighting|color|texture|detail/.test(token)) ? 20 : 5;

  const base = Math.min(100, lengthEvaluation.score + diversityScore + structuralScore + detailBonus);
  return Math.round(Math.max(5, base));
}

function analyzePrompt(prompt) {
  const normalizedPrompt = normalizePrompt(prompt);
  if (!normalizedPrompt) {
    return {
      promptQualityScore: 0,
      charCount: 0,
      wordCount: 0,
      keywords: [],
      structure: { sentenceCount: 0, hasQuestions: false, averageSentenceLength: 0 },
      suggestions: ["Proporciona un prompt con detalles específicos para generar un análisis."]
    };
  }

  const tokens = getWordTokens(normalizedPrompt);
  const wordCount = tokens.length;
  const charCount = normalizedPrompt.length;
  const lengthEvaluation = scorePromptLength(wordCount);
  const structure = detectStructure(normalizedPrompt);
  const keywords = extractKeywords(tokens);
  const suggestions = buildSuggestions(lengthEvaluation, structure, tokens);
  const promptQualityScore = computeQualityScore(lengthEvaluation, structure, tokens);

  return {
    promptQualityScore,
    charCount,
    wordCount,
    keywords,
    structure,
    suggestions
  };
}

module.exports = {
  analyzePrompt,
  _test: {
    getWordTokens,
    scorePromptLength,
    detectStructure,
    extractKeywords,
    buildSuggestions,
    computeQualityScore
  }
};
