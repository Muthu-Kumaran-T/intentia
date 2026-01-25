// controllers/userController.js - COMPLETE + getUserPosts ✅
const User = require('../models/User');
const Post = require('../models/Post');
const Activity = require('../models/Activity');

// @desc    Get user profile
// @route   GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -totpSecret')
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const { username, bio, phoneNumber } = req.body;
    const user = await User.findById(req.user.id);

    // Check if username is taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
      user.username = username;
    }

    if (bio !== undefined) user.bio = bio;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    await user.save();

    // Log activity
    await Activity.create({
      user: req.user.id,
      type: 'profile',
      action: 'Updated profile information'
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get user's own posts
// @route   GET /api/user/posts
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get saved posts
// @route   GET /api/user/saved
const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'savedPosts',
        populate: { 
          path: 'author', 
          select: 'username profilePicture' 
        }
      });

    res.json({
      success: true,
      data: user.savedPosts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Save a post
// @route   POST /api/user/save/:postId
const savePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = await User.findById(req.user.id);
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if already saved
    if (user.savedPosts.includes(postId)) {
      return res.status(400).json({
        success: false,
        message: 'Post already saved'
      });
    }

    user.savedPosts.push(postId);
    await user.save();

    // Log activity
    await Activity.create({
      user: req.user.id,
      type: 'save',
      action: `Saved a post in ${post.category}`,
      targetPost: postId
    });

    res.json({
      success: true,
      message: 'Post saved successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Unsave a post
// @route   DELETE /api/user/save/:postId
const unsavePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = await User.findById(req.user.id);

    user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
    await user.save();

    // Log activity
    await Activity.create({
      user: req.user.id,
      type: 'unsave',
      action: 'Unsaved a post',
      targetPost: postId
    });

    res.json({
      success: true,
      message: 'Post unsaved successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get archived posts
// @route   GET /api/user/archived
const getArchivedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'archivedPosts',
        populate: { 
          path: 'author', 
          select: 'username profilePicture' 
        }
      });

    res.json({
      success: true,
      data: user.archivedPosts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Archive a post
// @route   POST /api/user/archive/:postId
const archivePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = await User.findById(req.user.id);
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if post belongs to user
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only archive your own posts'
      });
    }

    // Check if already archived
    if (user.archivedPosts.includes(postId)) {
      return res.status(400).json({
        success: false,
        message: 'Post already archived'
      });
    }

    user.archivedPosts.push(postId);
    post.visible = false;
    await user.save();
    await post.save();

    res.json({
      success: true,
      message: 'Post archived successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Unarchive a post
// @route   DELETE /api/user/archive/:postId
const unarchivePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const user = await User.findById(req.user.id);
    const post = await Post.findById(postId);

    user.archivedPosts = user.archivedPosts.filter(id => id.toString() !== postId);
    if (post) {
      post.visible = true;
      await post.save();
    }
    await user.save();

    res.json({
      success: true,
      message: 'Post restored successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get user activity
// @route   GET /api/user/activity
const getUserActivity = async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = { user: req.user.id };
    if (type && type !== 'all') {
      query.type = type;
    }

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('targetUser', 'username')
      .populate('targetPost', 'content category');

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update privacy settings
// @route   PUT /api/user/privacy
const updatePrivacy = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.privacySettings = { ...user.privacySettings, ...req.body };
    await user.save();

    res.json({
      success: true,
      message: 'Privacy settings updated',
      data: user.privacySettings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update notification settings
// @route   PUT /api/user/notifications
const updateNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.notificationSettings = { ...user.notificationSettings, ...req.body };
    await user.save();

    res.json({
      success: true,
      message: 'Notification settings updated',
      data: user.notificationSettings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update time management settings
// @route   PUT /api/user/time-management
const updateTimeManagement = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.timeManagement = { ...user.timeManagement, ...req.body };
    await user.save();

    res.json({
      success: true,
      message: 'Time management settings updated',
      data: user.timeManagement
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update app preferences
// @route   PUT /api/user/preferences
const updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.preferences = { ...user.preferences, ...req.body };
    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated',
      data: user.preferences
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Follow a user
// @route   POST /api/user/follow/:userId
const followUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const user = await User.findById(req.user.id);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.following.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Already following this user'
      });
    }

    user.following.push(userId);
    targetUser.followers.push(req.user.id);
    await user.save();
    await targetUser.save();

    await Activity.create({
      user: req.user.id,
      type: 'follow',
      action: `Started following @${targetUser.username}`,
      targetUser: userId
    });

    res.json({
      success: true,
      message: 'User followed successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Unfollow a user
// @route   DELETE /api/user/follow/:userId
const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(req.user.id);
    const targetUser = await User.findById(userId);

    user.following = user.following.filter(id => id.toString() !== userId);
    if (targetUser) {
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== req.user.id);
      await targetUser.save();
    }
    await user.save();

    await Activity.create({
      user: req.user.id,
      type: 'unfollow',
      action: `Unfollowed @${targetUser?.username || 'user'}`,
      targetUser: userId
    });

    res.json({
      success: true,
      message: 'User unfollowed successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
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
};
