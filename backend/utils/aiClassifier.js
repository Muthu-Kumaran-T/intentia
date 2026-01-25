// Rule-Based AI Classifier for Intent & Category Detection
// Uses keyword matching and NLP-like techniques (no external APIs)

const categoryKeywords = {
  'Share & Thoughts': ['share', 'think', 'thought', 'feel', 'opinion', 'believe', 'wonder', 'reflect', 'life', 'question', 'idea', 'moment'],
  'Music': ['music', 'song', 'album', 'artist', 'band', 'concert', 'lyrics', 'spotify', 'playlist', 'guitar', 'piano', 'singer', 'melody'],
  'Play': ['game', 'gaming', 'gamer', 'play', 'console', 'pc', 'xbox', 'playstation', 'nintendo', 'steam', 'esports', 'multiplayer'],
  'Buzz': ['news', 'buzz', 'trending', 'latest', 'breaking', 'update', 'announcement', 'happening', 'current'],
  'Movies': ['movie', 'film', 'cinema', 'actor', 'actress', 'director', 'netflix', 'theatre', 'screenplay', 'hollywood', 'bollywood', 'watch', 'trailer'],
  'Learning & Tech': ['learn', 'study', 'course', 'tutorial', 'education', 'tech', 'technology', 'programming', 'code', 'software', 'ai', 'ml', 'data', 'app'],
  'Sports': ['sport', 'game', 'match', 'player', 'team', 'football', 'cricket', 'basketball', 'tennis', 'championship', 'athlete', 'fitness', 'workout'],
  'Food': ['food', 'recipe', 'cook', 'restaurant', 'eat', 'dish', 'meal', 'cuisine', 'chef', 'taste', 'delicious'],
  'Travel': ['travel', 'trip', 'vacation', 'destination', 'journey', 'adventure', 'explore', 'tour', 'flight', 'hotel', 'tourist'],
  'All': []
};

// Classify content into category
const classifyCategory = (text) => {
  const lowerText = text.toLowerCase();
  const scores = {};

  // Count keyword matches for each category
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    scores[category] = 0;
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        scores[category]++;
      }
    });
  }

  // Find category with highest score
  let maxScore = 0;
  let detectedCategory = 'Other';

  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedCategory = category;
    }
  }

  return maxScore > 0 ? detectedCategory : 'Share & Thoughts';
};

// Extract keywords from text
const extractKeywords = (text) => {
  const lowerText = text.toLowerCase();
  const allKeywords = [];

  // Extract matching keywords
  for (const keywords of Object.values(categoryKeywords)) {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        allKeywords.push(keyword);
      }
    });
  }

  // Remove duplicates and limit to top 5
  return [...new Set(allKeywords)].slice(0, 5);
};

// Detect user intent from onboarding
const detectIntent = (intentText) => {
  const intents = {
    discover: ['discover', 'find', 'explore', 'search', 'looking for', 'recommend'],
    share: ['share', 'post', 'tell', 'show', 'express', 'talk about'],
    learn: ['learn', 'understand', 'know', 'study', 'educate'],
    connect: ['connect', 'meet', 'follow', 'chat', 'friends', 'network']
  };

  const lowerText = intentText.toLowerCase();
  
  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return intent;
    }
  }

  return 'explore';
};

module.exports = {
  classifyCategory,
  extractKeywords,
  detectIntent
};