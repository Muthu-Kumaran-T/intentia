// Simple Extractive Summarization (No External APIs)
// Uses sentence scoring based on keyword frequency

const generateSummary = (text) => {
  // Only summarize if text is longer than 100 words
  const wordCount = text.split(/\s+/).length;
  
  if (wordCount <= 100) {
    return text;
  }

  // Split into sentences
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
  
  if (sentences.length <= 2) {
    return text;
  }

  // Simple word frequency approach
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3); // Filter short words

  // Count word frequency
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  // Score sentences based on word frequency
  const sentenceScores = sentences.map(sentence => {
    const sentenceWords = sentence.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/);
    
    const score = sentenceWords.reduce((sum, word) => {
      return sum + (wordFreq[word] || 0);
    }, 0);

    return {
      sentence: sentence.trim(),
      score: score / sentenceWords.length // Average score
    };
  });

  // Sort by score and take top 2-3 sentences
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(3, Math.ceil(sentences.length / 2)))
    .map(s => s.sentence);

  // Return summary (max 200 characters)
  const summary = topSentences.join(' ');
  return summary.length > 200 ? summary.substring(0, 197) + '...' : summary;
};

module.exports = { generateSummary };