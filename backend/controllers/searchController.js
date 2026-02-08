// backend/controllers/searchController.js
const User = require('../models/User');

// @desc    Search users by username or name
// @route   GET /api/search/users?query=
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user.id;

    console.log('📝 Search request received');
    console.log('Query:', query);
    console.log('Current User ID:', currentUserId);

    if (!query || query.trim().length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    console.log(`🔍 Searching for users: "${query}"`);

    // Search users by username (case-insensitive)
    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ]
    })
    .select('username name profilePicture bio followers following totalPosts')
    .limit(20)
    .sort({ followers: -1 });

    console.log(`✅ Found ${users.length} users`);

    // Add isFollowing status for each user
    const usersWithFollowStatus = users.map(user => ({
      _id: user._id,
      username: user.username,
      name: user.name,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers?.length || 0,
      following: user.following?.length || 0,
      totalPosts: user.totalPosts || 0,
      isFollowing: user.followers?.includes(currentUserId) || false
    }));

    res.json({
      success: true,
      data: usersWithFollowStatus,
      count: users.length
    });
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get recent searches
// @route   GET /api/search/recent
const getRecentSearches = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📋 Fetching recent searches for user:', userId);
    
    const user = await User.findById(userId).select('recentSearches');
    
    console.log('User found:', !!user);
    console.log('Recent searches:', user?.recentSearches);
    
    if (!user || !user.recentSearches || user.recentSearches.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Populate recent searches with user data
    const recentUsers = await User.find({
      _id: { $in: user.recentSearches }
    })
    .select('username name profilePicture bio followers')
    .limit(10);

    console.log(`✅ Found ${recentUsers.length} recent users`);

    res.json({
      success: true,
      data: recentUsers
    });
  } catch (error) {
    console.error('❌ Error fetching recent searches:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add to recent searches
// @route   POST /api/search/recent/:userId
const addToRecentSearches = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    console.log(`📌 Adding user ${userId} to recent searches for ${currentUserId}`);

    // First, remove the userId if it exists (to avoid duplicates)
    await User.findByIdAndUpdate(
      currentUserId,
      {
        $pull: { recentSearches: userId }
      }
    );

    // Then add it to the beginning and keep only 10 items
    const result = await User.findByIdAndUpdate(
      currentUserId,
      {
        $push: {
          recentSearches: {
            $each: [userId],
            $position: 0,
            $slice: 10
          }
        }
      },
      { new: true }
    );

    console.log('✅ Added to recent searches');
    console.log('Updated recent searches:', result?.recentSearches);

    res.json({
      success: true,
      message: 'Added to recent searches'
    });
  } catch (error) {
    console.error('❌ Error adding to recent searches:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Clear recent searches
// @route   DELETE /api/search/recent
const clearRecentSearches = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(`🗑️ Clearing recent searches for user ${userId}`);

    await User.findByIdAndUpdate(userId, {
      $set: { recentSearches: [] }
    });

    console.log('✅ Recent searches cleared');

    res.json({
      success: true,
      message: 'Recent searches cleared'
    });
  } catch (error) {
    console.error('❌ Error clearing recent searches:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  searchUsers,
  getRecentSearches,
  addToRecentSearches,
  clearRecentSearches
};