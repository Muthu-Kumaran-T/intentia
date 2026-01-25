// Rule-Based Content Moderation
// Flags inappropriate content for human review (no auto-deletion)

const inappropriateKeywords = [
  // Violence
  'kill', 'murder', 'attack', 'violence', 'bomb', 'weapon',
  // Hate speech (basic detection)
  'hate', 'racist', 'discrimination',
  // Adult content
  'porn', 'xxx', 'nude', 'sexual',
  // Spam indicators
  'buy now', 'click here', 'earn money', 'free money', 'guarantee'
];

const moderateContent = (text) => {
  const lowerText = text.toLowerCase();
  const detectedIssues = [];

  // Check for inappropriate keywords
  inappropriateKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      detectedIssues.push(`Potential inappropriate content: "${keyword}"`);
    }
  });

  // Check for excessive capitalization (spam indicator)
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.5 && text.length > 20) {
    detectedIssues.push('Excessive capitalization detected');
  }

  // Check for repeated characters (spam indicator)
  if (/(.)\1{4,}/.test(text)) {
    detectedIssues.push('Spam pattern detected');
  }

  return {
    flagged: detectedIssues.length > 0,
    reasons: detectedIssues
  };
};

module.exports = { moderateContent };