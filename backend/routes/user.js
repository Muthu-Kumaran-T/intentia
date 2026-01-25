const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getUserPosts,      
  getSavedPosts,
  savePost,
  unsavePost,
  getArchivedPosts,
  archivePost,
  unarchivePost,
  getUserActivity,
  updatePrivacy,
  updateNotifications,
  updateTimeManagement,
  updatePreferences,
  followUser,
  unfollowUser
} = require('../controllers/userController');

// Profile routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// User posts route 
router.get('/posts', protect, getUserPosts);

// Saved posts routes
router.get('/saved', protect, getSavedPosts);
router.post('/save/:postId', protect, savePost);
router.delete('/save/:postId', protect, unsavePost);

// Archive routes
router.get('/archived', protect, getArchivedPosts);
router.post('/archive/:postId', protect, archivePost);
router.delete('/archive/:postId', protect, unarchivePost);

// Activity routes
router.get('/activity', protect, getUserActivity);

// Settings routes
router.put('/privacy', protect, updatePrivacy);
router.put('/notifications', protect, updateNotifications);
router.put('/time-management', protect, updateTimeManagement);
router.put('/preferences', protect, updatePreferences);

// Follow routes
router.post('/follow/:userId', protect, followUser);
router.delete('/follow/:userId', protect, unfollowUser);

module.exports = router;