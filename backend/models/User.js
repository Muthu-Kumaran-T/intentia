const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    maxlength: 200,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  // Social connections
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Saved & Archived posts
  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  archivedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  // Search Feature - NEW!
  recentSearches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Privacy Settings
  privacySettings: {
    profileVisible: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
    allowMessages: { type: Boolean, default: true },
    allowFollowers: { type: Boolean, default: true },
    showActivity: { type: Boolean, default: true }
  },
  // Notification Settings
  notificationSettings: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    likes: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    follows: { type: Boolean, default: true }
  },
  // Time Management
  timeManagement: {
    dailyLimit: { type: Number, default: 60 }, // minutes
    breakReminder: { type: Number, default: 30 }, // minutes
    reminderEnabled: { type: Boolean, default: true }
  },
  // App Preferences
  preferences: {
    language: { type: String, default: 'en' },
    theme: { type: String, default: 'light' },
    autoplay: { type: Boolean, default: true }
  },
  // Onboarding Status
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  selectedIntent: {
    type: String,
    default: null
  },
  // Optional TOTP 2FA
  totpSecret: {
    type: String,
    default: null
  },
  totpEnabled: {
    type: Boolean,
    default: false
  },
  // Clarity Score
  clarityScore: {
    type: Number,
    default: 0
  },
  totalPosts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);