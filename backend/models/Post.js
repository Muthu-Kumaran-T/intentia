const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Share & Thoughts',
      'Music', 
      'Play', 
      'Buzz', 
      'Movies', 
      'Learning & Tech', 
      'Sports', 
      'Food', 
      'Travel', 
      'All'
    ]
  },
  // Add media fields
  mediaUrl: {
    type: String,
    default: null
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', null],
    default: null
  },
  mediaPublicId: {
    type: String,
    default: null
  },
   // Hashtags - extracted from content
  hashtags: [{
    type: String,
    lowercase: true
  }],
  // AI-generated summary (for posts > 100 words)
  summary: {
    type: String,
    default: ''
  },
  // AI-detected keywords
  keywords: [{
    type: String
  }],
  // Engagement metrics
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  commentsCount: {
    type: Number,
    default: 0
  },
  // Moderation
  flagged: {
    type: Boolean,
    default: false
  },
  flagReasons: [{
    type: String
  }],
  visible: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for faster category-based queries
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });

// Add index for hashtag search
postSchema.index({ hashtags: 1 });

module.exports = mongoose.model('Post', postSchema);