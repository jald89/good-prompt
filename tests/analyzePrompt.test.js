const { analyzePrompt, _test } = require('../src/services/analyzePrompt');

describe('analyzePrompt', () => {
  it('returns defaults for empty prompt', () => {
    const result = analyzePrompt('');
    expect(result.promptQualityScore).toBe(0);
    expect(result.wordCount).toBe(0);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it('evaluates short prompts with suggestions to add detail', () => {
    const result = analyzePrompt('sunset over mountains');
    expect(result.wordCount).toBe(3);
    expect(result.promptQualityScore).toBeLessThan(80);
    expect(result.suggestions).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Amplía el prompt'),
        expect.stringContaining('Describe estilo')
      ])
    );
  });

  it('rewards detailed prompts with higher score and keywords', () => {
    const prompt = 'Ultra-detailed cinematic portrait of a cyberpunk explorer, vibrant neon city lights, dramatic rim lighting, 85mm lens, shallow depth of field, intricate texture, volumetric fog, reflective surfaces';
    const result = analyzePrompt(prompt);
    expect(result.wordCount).toBeGreaterThan(20);
    expect(result.promptQualityScore).toBeGreaterThan(80);
    expect(result.keywords.length).toBeGreaterThan(0);
  });
});

describe('helper functions', () => {
  it('extracts keywords ignoring stop words', () => {
    const tokens = _test.getWordTokens('the red fox and the vibrant forest in the night');
    const keywords = _test.extractKeywords(tokens);
    const keywordWords = keywords.map((item) => item.word);
    expect(keywordWords).toContain('vibrant');
    expect(keywordWords).not.toContain('the');
  });

  it('detects multiple sentences', () => {
    const structure = _test.detectStructure('Scene with mountains. Include a river? Add misty atmosphere!');
    expect(structure.sentenceCount).toBeGreaterThan(1);
    expect(structure.hasQuestions).toBe(true);
  });
});
