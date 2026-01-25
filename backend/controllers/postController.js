// backend/controllers/postController.js - COMPLETE MERGED VERSION

const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');
const { classifyCategory, extractKeywords } = require('../utils/aiClassifier');
const { generateSummary } = require('../utils/summaryGenerator');
const { moderateContent } = require('../utils/moderation');

// Helper function to extract hashtags from text (from 1st code)
const extractHashtags = (text) => {
  const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
  const matches = text.match(hashtagRegex);
  if (!matches) return [];
  return [...new Set(matches.map(tag => tag.slice(1).toLowerCase()))];
};

// @desc    Create a new post with AI processing, hashtags, and media upload
// @route   POST /api/posts
const createPost = async (req, res) => {
  try {
    const { content, category } = req.body;

    console.log('📝 Creating post...');
    console.log('Content:', content);
    console.log('Category:', category);
    console.log('File received:', req.file ? 'YES' : 'NO');
    
    if (req.file) {
      console.log('File details:', {
        path: req.file.path,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
    }

    // Extract hashtags (INTEGRATED from 1st code)
    const hashtags = extractHashtags(content);

    // AI: Classify category if not provided
    const detectedCategory = category || classifyCategory(content);

    // AI: Generate summary for long posts
    const summary = generateSummary(content);

    // AI: Extract keywords
    const keywords = extractKeywords(content);

    // AI: Moderate content
    const moderation = moderateContent(content);

    // Prepare post data (ADDED: hashtags)
    const postData = {
      author: req.user.id,
      content,
      category: detectedCategory,
      summary,
      keywords,
      hashtags, // NEW: Added from 1st code
      flagged: moderation.flagged,
      flagReasons: moderation.reasons
    };

    // Add media fields if file was uploaded
    if (req.file) {
      postData.mediaUrl = req.file.path;
      postData.mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
      postData.mediaPublicId = req.file.filename;
      console.log('✅ Media data prepared:', {
        mediaUrl: postData.mediaUrl,
        mediaType: postData.mediaType,
        mediaPublicId: postData.mediaPublicId
      });
    } else {
      console.log('⚠️ No file uploaded');
    }

    // Create post
    const post = await Post.create(postData);
    console.log('✅ Post created:', post._id);
    console.log('Media saved:', {
      mediaUrl: post.mediaUrl,
      mediaType: post.mediaType
    });

    // Update user's total posts and clarity score
    const user = await User.findById(req.user.id);
    user.totalPosts += 1;
    const clarityBonus = (keywords.length + hashtags.length) * 2 + (summary !== content ? 5 : 0);
    user.clarityScore += clarityBonus;
    await user.save();

    // Populate author information
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username profilePicture');

    // Log activity
    await Activity.create({
      user: req.user.id,
      type: 'post',
      action: `Created a post in ${detectedCategory}${req.file ? ' with media' : ''}`,
      targetPost: post._id
    });

    res.status(201).json({
      success: true,
      data: populatedPost
    });
  } catch (error) {
    console.error('❌ Error creating post:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get posts by category (feed)
// @route   GET /api/posts/category/:category
const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    console.log(`📖 Fetching posts for category: ${category}, page: ${page}`);

    let query = { visible: true };
    if (category !== 'All') {
      query.category = category;
    }

    console.log('Query:', JSON.stringify(query));

    const posts = await Post.find(query)
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    console.log(`✅ Found ${posts.length} posts (Total: ${total})`);
    
    // Log media info for debugging
    posts.forEach((post, index) => {
      if (post.mediaUrl) {
        console.log(`Post ${index + 1} has media:`, {
          id: post._id,
          category: post.category,
          mediaUrl: post.mediaUrl,
          mediaType: post.mediaType
        });
      }
    });

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get trending posts by category
// @route   GET /api/posts/trending/:category
const getTrendingPosts = async (req, res) => {
  try {
    const { category } = req.params;
    const timeframe = req.query.timeframe || 'week';
    
    let dateFilter = new Date();
    if (timeframe === 'day') dateFilter.setDate(dateFilter.getDate() - 1);
    else if (timeframe === 'week') dateFilter.setDate(dateFilter.getDate() - 7);
    else if (timeframe === 'month') dateFilter.setMonth(dateFilter.getMonth() - 1);

    const matchCondition = {
      visible: true,
      createdAt: { $gte: dateFilter }
    };

    if (category !== 'All') {
      matchCondition.category = category;
    }

    console.log(`🔥 Fetching trending posts for: ${category}, timeframe: ${timeframe}`);

    const posts = await Post.aggregate([
      {
        $match: matchCondition
      },
      {
        $addFields: {
          likesCount: { $size: '$likes' },
          engagementScore: {
            $add: [
              { $size: '$likes' },
              { $multiply: ['$commentsCount', 2] }
            ]
          }
        }
      },
      { $sort: { engagementScore: -1 } },
      { $limit: 20 }
    ]);

    await Post.populate(posts, { path: 'author', select: 'username profilePicture' });

    console.log(`✅ Found ${posts.length} trending posts`);

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('❌ Error fetching trending posts:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get posts by hashtag (from 1st code)
// @route   GET /api/posts/hashtag/:hashtag
const getByHashtag = async (req, res) => {
  try {
    const { hashtag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ 
      hashtags: hashtag.toLowerCase() 
    })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ 
      hashtags: hashtag.toLowerCase() 
    });

    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total
      }
    });
  } catch (error) {
    console.error('Error fetching posts by hashtag:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts'
    });
  }
};

// @desc    Get trending hashtags (from 1st code)
// @route   GET /api/posts/trending-hashtags
const getTrendingHashtags = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const timeframe = req.query.timeframe || 'week'; // day, week, month
    
    const now = new Date();
    let startDate = new Date();
    
    switch (timeframe) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const trendingHashtags = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $unwind: '$hashtags'
      },
      {
        $group: {
          _id: '$hashtags',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: limit
      },
      {
        $project: {
          hashtag: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: trendingHashtags
    });
  } catch (error) {
    console.error('Error fetching trending hashtags:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending hashtags'
    });
  }
};

// @desc    Like/Unlike a post
// @route   POST /api/posts/:id/like
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    const likeIndex = post.likes.indexOf(req.user.id);

    if (likeIndex === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    // Log activity
    await Activity.create({
      user: req.user.id,
      type: 'like',
      action: likeIndex === -1 ? 'Liked a post' : 'Unliked a post',
      targetPost: req.params.id
    });

    res.json({
      success: true,
      data: {
        liked: likeIndex === -1,
        likesCount: post.likes.length
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.create({
      post: req.params.id,
      author: req.user.id,
      content
    });

    // Update post comment count
    await Post.findByIdAndUpdate(req.params.id, {
      $inc: { commentsCount: 1 }
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username profilePicture');

    // Log activity
    await Activity.create({
      user: req.user.id,
      type: 'comment',
      action: 'Commented on a post',
      targetPost: req.params.id
    });

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get comments for a post
// @route   GET /api/posts/:id/comments
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Delete a post (with media cleanup)
// @route   DELETE /api/posts/:id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found' 
      });
    }

    // Check if user is the post author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this post' 
      });
    }

    // Delete media from Cloudinary if exists
    if (post.mediaPublicId) {
      const cloudinary = require('cloudinary').v2;
      await cloudinary.uploader.destroy(post.mediaPublicId, {
        resource_type: post.mediaType || 'image'
      });
    }

    // Delete associated comments
    await Comment.deleteMany({ post: req.params.id });

    // Delete associated activities
    await Activity.deleteMany({ targetPost: req.params.id });

    // Delete the post
    await post.deleteOne();

    // Update user's total posts
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalPosts: -1 }
    });

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  createPost,
  getPostsByCategory,
  getTrendingPosts,
  getByHashtag,
  getTrendingHashtags,
  toggleLike,
  addComment,
  getComments,
  deletePost
};
