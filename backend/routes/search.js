// backend/routes/search.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  searchUsers,
  getRecentSearches,
  addToRecentSearches,
  clearRecentSearches
} = require('../controllers/searchController');

// All routes require authentication
router.use(protect);

// Search users
router.get('/users', searchUsers);

// Recent searches
router.get('/recent', getRecentSearches);
router.post('/recent/:userId', addToRecentSearches);
router.delete('/recent', clearRecentSearches);

module.exports = router;