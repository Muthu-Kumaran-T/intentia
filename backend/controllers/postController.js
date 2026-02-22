// backend/controllers/postController.js

const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');
const { classifyCategory, extractKeywords } = require('../utils/aiClassifier');
const { generateSummary } = require('../utils/summaryGenerator');
const { moderateContent } = require('../utils/moderation');

// ─── Helper: Extract Hashtags ──────────────────────────────────────────────────
const extractHashtags = (text) => {
  const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
  const matches = text.match(hashtagRegex);
  if (!matches) return [];
  return [...new Set(matches.map(tag => tag.slice(1).toLowerCase()))];
};

// ─── CREATE POST ───────────────────────────────────────────────────────────────
// @desc    Create a new post — category is ALWAYS AI-classified from content
// @route   POST /api/posts
const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    console.log('\n📝 Creating post...');
    console.log('Content:', content);
    console.log('File received:', req.file ? 'YES' : 'NO');

    if (req.file) {
      console.log('File details:', {
        path:     req.file.path,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size:     req.file.size
      });
    }

    // ── Step 1: Extract hashtags from content ──────────────────────────────
    const hashtags = extractHashtags(content);
    console.log('🏷️  Hashtags found:', hashtags);

    // ── Step 2: AI — always classify from content, never trust user input ──
    const detectedCategory = classifyCategory(content);
    console.log('🧠 AI Detected Category:', detectedCategory);

    // ── Step 3: AI — generate summary for long posts ───────────────────────
    const summary = generateSummary(content);

    // ── Step 4: AI — extract keywords ─────────────────────────────────────
    const keywords = extractKeywords(content);
    console.log('🔑 Keywords:', keywords);

    // ── Step 5: AI — moderate content ─────────────────────────────────────
    const moderation = moderateContent(content);

    // ── Build post data ────────────────────────────────────────────────────
    const postData = {
      author:      req.user.id,
      content,
      category:    detectedCategory,   // ✅ Always AI-classified
      summary,
      keywords,
      hashtags,
      flagged:     moderation.flagged,
      flagReasons: moderation.reasons
    };

    // ── Attach media if uploaded ───────────────────────────────────────────
    if (req.file) {
      postData.mediaUrl      = req.file.path;
      postData.mediaType     = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
      postData.mediaPublicId = req.file.filename;
      console.log('✅ Media prepared:', {
        mediaUrl:      postData.mediaUrl,
        mediaType:     postData.mediaType,
        mediaPublicId: postData.mediaPublicId
      });
    } else {
      console.log('⚠️  No file uploaded');
    }

    // ── Save post ──────────────────────────────────────────────────────────
    const post = await Post.create(postData);
    console.log('✅ Post created:', post._id);
    console.log('   Category saved as:', post.category);
    console.log('   Media saved:', { mediaUrl: post.mediaUrl, mediaType: post.mediaType });

    // ── Update user stats ──────────────────────────────────────────────────
    const user = await User.findById(req.user.id);
    user.totalPosts += 1;
    const clarityBonus =
      (keywords.length + hashtags.length) * 2 + (summary !== content ? 5 : 0);
    user.clarityScore += clarityBonus;
    await user.save();

    // ── Populate author for response ───────────────────────────────────────
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username profilePicture');

    // ── Log activity ───────────────────────────────────────────────────────
    await Activity.create({
      user:       req.user.id,
      type:       'post',
      action:     `Created a post in ${detectedCategory}${req.file ? ' with media' : ''}`,
      targetPost: post._id
    });

    return res.status(201).json({
      success: true,
      data:    populatedPost
    });

  } catch (error) {
    console.error('❌ Error creating post:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─── GET POSTS BY CATEGORY ─────────────────────────────────────────────────────
// @desc    Get paginated posts filtered by category
// @route   GET /api/posts/category/:category
const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    console.log(`\n📖 Fetching posts — category: ${category}, page: ${page}`);

    const query = { visible: true };
    if (category !== 'All') {
      query.category = category;
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'username profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(query)
    ]);

    console.log(`✅ Found ${posts.length} posts (Total: ${total})`);

    // Debug media fields
    posts.forEach((post, i) => {
      if (post.mediaUrl) {
        console.log(`Post ${i + 1} has media:`, {
          id:        post._id,
          category:  post.category,
          mediaUrl:  post.mediaUrl,
          mediaType: post.mediaType
        });
      }
    });

    return res.json({
      success:    true,
      data:       posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching posts by category:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─── GET TRENDING POSTS ────────────────────────────────────────────────────────
// @desc    Get trending posts ranked by engagement score
// @route   GET /api/posts/trending/:category
const getTrendingPosts = async (req, res) => {
  try {
    const { category }  = req.params;
    const timeframe     = req.query.timeframe || 'week';

    const dateFilter = new Date();
    if      (timeframe === 'day')   dateFilter.setDate(dateFilter.getDate() - 1);
    else if (timeframe === 'week')  dateFilter.setDate(dateFilter.getDate() - 7);
    else if (timeframe === 'month') dateFilter.setMonth(dateFilter.getMonth() - 1);

    const matchCondition = {
      visible:   true,
      createdAt: { $gte: dateFilter }
    };
    if (category !== 'All') {
      matchCondition.category = category;
    }

    console.log(`\n🔥 Trending — category: ${category}, timeframe: ${timeframe}`);

    const posts = await Post.aggregate([
      { $match: matchCondition },
      {
        $addFields: {
          likesCount:      { $size: '$likes' },
          engagementScore: {
            $add: [
              { $size: '$likes' },
              { $multiply: ['$commentsCount', 2] }
            ]
          }
        }
      },
      { $sort:  { engagementScore: -1 } },
      { $limit: 20 }
    ]);

    await Post.populate(posts, { path: 'author', select: 'username profilePicture' });

    console.log(`✅ Found ${posts.length} trending posts`);

    return res.json({
      success: true,
      data:    posts
    });

  } catch (error) {
    console.error('❌ Error fetching trending posts:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─── GET POSTS BY HASHTAG ──────────────────────────────────────────────────────
// @desc    Get posts containing a specific hashtag
// @route   GET /api/posts/hashtag/:hashtag
const getByHashtag = async (req, res) => {
  try {
    const { hashtag } = req.params;
    const page  = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip  = (page - 1) * limit;

    const filter = { hashtags: hashtag.toLowerCase() };

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'username profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter)
    ]);

    return res.json({
      success:    true,
      data:       posts,
      pagination: {
        currentPage: page,
        totalPages:  Math.ceil(total / limit),
        totalPosts:  total
      }
    });

  } catch (error) {
    console.error('❌ Error fetching posts by hashtag:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch posts'
    });
  }
};

// ─── GET TRENDING HASHTAGS ─────────────────────────────────────────────────────
// @desc    Aggregate trending hashtags within a timeframe
// @route   GET /api/posts/trending-hashtags
const getTrendingHashtags = async (req, res) => {
  try {
    const limit     = parseInt(req.query.limit) || 10;
    const timeframe = req.query.timeframe || 'week';

    const startDate = new Date();
    if      (timeframe === 'day')   startDate.setDate(startDate.getDate() - 1);
    else if (timeframe === 'week')  startDate.setDate(startDate.getDate() - 7);
    else if (timeframe === 'month') startDate.setMonth(startDate.getMonth() - 1);
    else                            startDate.setDate(startDate.getDate() - 7);

    const trendingHashtags = await Post.aggregate([
      { $match:   { createdAt: { $gte: startDate } } },
      { $unwind:  '$hashtags' },
      { $group:   { _id: '$hashtags', count: { $sum: 1 } } },
      { $sort:    { count: -1 } },
      { $limit:   limit },
      { $project: { hashtag: '$_id', count: 1, _id: 0 } }
    ]);

    return res.json({
      success: true,
      data:    trendingHashtags
    });

  } catch (error) {
    console.error('❌ Error fetching trending hashtags:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch trending hashtags'
    });
  }
};

// ─── TOGGLE LIKE ───────────────────────────────────────────────────────────────
// @desc    Like or unlike a post
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
    const isLiking  = likeIndex === -1;

    if (isLiking) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    await Activity.create({
      user:       req.user.id,
      type:       'like',
      action:     isLiking ? 'Liked a post' : 'Unliked a post',
      targetPost: req.params.id
    });

    return res.json({
      success: true,
      data: {
        liked:      isLiking,
        likesCount: post.likes.length
      }
    });

  } catch (error) {
    console.error('❌ Error toggling like:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─── ADD COMMENT ───────────────────────────────────────────────────────────────
// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.create({
      post:    req.params.id,
      author:  req.user.id,
      content
    });

    await Post.findByIdAndUpdate(req.params.id, {
      $inc: { commentsCount: 1 }
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username profilePicture');

    await Activity.create({
      user:       req.user.id,
      type:       'comment',
      action:     'Commented on a post',
      targetPost: req.params.id
    });

    return res.status(201).json({
      success: true,
      data:    populatedComment
    });

  } catch (error) {
    console.error('❌ Error adding comment:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─── GET COMMENTS ──────────────────────────────────────────────────────────────
// @desc    Get all comments for a post
// @route   GET /api/posts/:id/comments
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data:    comments
    });

  } catch (error) {
    console.error('❌ Error fetching comments:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─── DELETE POST ───────────────────────────────────────────────────────────────
// @desc    Delete a post and its media, comments, and activity logs
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

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    // ── Clean up Cloudinary media ──────────────────────────────────────────
    if (post.mediaPublicId) {
      const cloudinary = require('cloudinary').v2;
      await cloudinary.uploader.destroy(post.mediaPublicId, {
        resource_type: post.mediaType || 'image'
      });
      console.log('🗑️  Cloudinary media deleted:', post.mediaPublicId);
    }

    // ── Clean up related documents ─────────────────────────────────────────
    await Promise.all([
      Comment.deleteMany({ post: req.params.id }),
      Activity.deleteMany({ targetPost: req.params.id }),
      post.deleteOne(),
      User.findByIdAndUpdate(req.user.id, { $inc: { totalPosts: -1 } })
    ]);

    console.log('✅ Post deleted:', req.params.id);

    return res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting post:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─── Exports ───────────────────────────────────────────────────────────────────
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