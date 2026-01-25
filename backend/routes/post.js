// backend/routes/post.js - COMPLETE MERGED VERSION
const express = require('express');
const router = express.Router();

// Import middleware and controllers
const { protect } = require('../middleware/auth'); // Consistent naming (protect)
const { upload } = require('../config/cloudinary'); // Cloudinary upload
const {
  createPost,
  getPostsByCategory,
  getTrendingPosts,
  getByHashtag,        // From 1st version
  getTrendingHashtags, // From 1st version
  toggleLike,          // From 2nd version  
  addComment,
  getComments,
  deletePost
} = require('../controllers/postController');

// 📱 POST /api/posts/ - Create post with optional media (Cloudinary)
router.post('/', protect, upload.single('media'), createPost);

// 📱 GET /api/posts/category/:category - Category feed (handles "All")
router.get('/category/:category', protect, getPostsByCategory);

// 🔥 GET /api/posts/trending/:category - Trending posts by category
router.get('/trending/:category', protect, getTrendingPosts);

// 🏷️ GET /api/posts/hashtag/:hashtag - Posts by hashtag (NEW from 1st version)
router.get('/hashtag/:hashtag', protect, getByHashtag);

// 📈 GET /api/posts/trending-hashtags - Trending hashtags (NEW from 1st version)
router.get('/trending-hashtags', protect, getTrendingHashtags);

// ❤️ POST /api/posts/:id/like - Toggle like/unlike (toggleLike, not likePost)
router.post('/:id/like', protect, toggleLike);

// 💬 POST /api/posts/:id/comment - Add comment
router.post('/:id/comment', protect, addComment);

// 📝 GET /api/posts/:id/comments - Get post comments
router.get('/:id/comments', protect, getComments);

// 🗑️ DELETE /api/posts/:id - Delete post (owner only)
router.delete('/:id', protect, deletePost);

module.exports = router;
