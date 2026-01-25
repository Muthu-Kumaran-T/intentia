// frontend/src/components/PostCard.jsx - COMPLETE ULTRA-CLICKABLE VERSION
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI } from '../services/api';
import { motion } from 'framer-motion';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      const response = await postAPI.like(post._id);
      if (response.data.success) {
        setLiked(response.data.data.liked);
        setLikesCount(response.data.data.likesCount);
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return postDate.toLocaleDateString();
  };

  const handleHashtagClick = (hashtag) => {
    console.log('Navigating to hashtag:', hashtag); // DEBUG
    navigate(`/posts/hashtag/${hashtag}`); // Matches your merged routes
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Music': '🎵',
      'Sports': '⚽',
      'Food': '🍔',
      'Movies': '🎬',
      'Travel': '✈️',
      'Play': '🎮',
      'Learning & Tech': '💻',
      'Buzz': '📰',
      'Share & Thoughts': '💭',
      'All': '🌐'
    };
    return icons[category] || '🌐';
  };

  // Debug logging
  console.log('Post data:', post);
  console.log('Hashtags:', post.hashtags);
  console.log('Keywords:', post.keywords);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {post.author?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-bold text-gray-800">{post.author?.username || 'Unknown User'}</p>
              <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          
          {/* Category Badge */}
          <div className="flex items-center gap-2 bg-purple-100 px-3 py-1.5 rounded-full shadow-sm">
            <span className="text-lg">{getCategoryIcon(post.category)}</span>
            <span className="text-sm font-medium text-purple-700">{post.category}</span>
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed text-lg">{post.content}</p>

        {/* Media Display */}
        {post.mediaUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden bg-gray-50 shadow-inner">
            {post.mediaType === 'image' ? (
              <img 
                src={post.mediaUrl} 
                alt="Post media" 
                className="w-full h-auto max-h-[500px] object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                onError={(e) => {
                  console.error('Image failed to load:', post.mediaUrl);
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="p-8 text-center text-red-500 bg-red-50 rounded-xl">Failed to load image</div>';
                }}
                onLoad={() => console.log('Image loaded:', post.mediaUrl)}
              />
            ) : post.mediaType === 'video' ? (
              <video 
                src={post.mediaUrl} 
                controls 
                className="w-full h-auto max-h-[500px] rounded-xl"
                preload="metadata"
                onError={(e) => {
                  console.error('Video failed to load:', post.mediaUrl);
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="p-8 text-center text-red-500 bg-red-50 rounded-xl">Failed to load video</div>';
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
        )}

        {/* Hashtags - ULTRA CLICKABLE */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 p-3 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl border border-purple-200/50 shadow-lg">
            {post.hashtags.slice(0, 5).map((hashtag, index) => (
              <motion.button
                key={index}
                onClick={() => handleHashtagClick(hashtag)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-3 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 hover:from-purple-600 hover:via-purple-700 hover:to-pink-600 text-white text-sm font-bold rounded-2xl shadow-xl hover:shadow-2xl border-2 border-white/30 backdrop-blur-sm cursor-pointer ring-4 ring-purple-400/30 hover:ring-purple-500/50 transition-all duration-300"
                style={{ minWidth: 'fit-content', minHeight: '44px' }}
                title={`Click to view #${hashtag} posts`}
              >
                <span className="flex items-center gap-1.5">
                  <span>#</span>
                  <span>{hashtag}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </motion.button>
            ))}
            {post.hashtags.length > 5 && (
              <div className="px-4 py-3 text-sm bg-white/90 text-gray-700 rounded-2xl font-semibold shadow-md border border-gray-200 flex items-center gap-2">
                +{post.hashtags.length - 5} more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.933 7.933a1 1 0 010 1.414L9.534 13l3.399 3.653a1 1 0 01-1.414 1.414l-4-4.292a1 1 0 010-1.414l4-4.292a1 1 0 011.414 0z" />
                </svg>
              </div>
            )}
          </div>
        )}

        {/* Keywords */}
        {post.keywords && post.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.keywords.slice(0, 5).map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs font-semibold rounded-full shadow-sm border border-blue-200 hover:bg-blue-200 transition-all duration-200"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* AI Summary */}
        {post.summary && post.summary !== post.content && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 mb-6 rounded-xl shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="font-bold text-blue-900 text-sm">✨ AI Summary</p>
            </div>
            <p className="text-gray-700 leading-relaxed">{post.summary}</p>
          </div>
        )}

        {/* Flagged Warning */}
        {post.flagged && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4 mb-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-yellow-900 text-lg">⚠️ Flagged Content</p>
                <p className="text-yellow-800 text-sm mt-1">{post.flagReasons?.join(', ') || 'Under review'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center gap-8">
            <motion.button
              onClick={handleLike}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl font-bold transition-all duration-200 shadow-md ${
                liked 
                  ? 'bg-red-500 text-white shadow-red-400/50 hover:bg-red-600 hover:shadow-red-500/70 ring-2 ring-red-300/50' 
                  : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600 hover:shadow-red-200 ring-1 ring-transparent hover:ring-red-200'
              }`}
            >
              <svg 
                className="w-6 h-6" 
                fill={liked ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-bold">{likesCount.toLocaleString()}</span>
            </motion.button>

            <motion.button
              onClick={() => setShowComments(!showComments)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 rounded-xl font-semibold shadow-sm hover:shadow-md ring-1 ring-blue-200/50 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.commentsCount || 0}</span>
            </motion.button>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 hover:text-emerald-800 rounded-xl font-semibold shadow-sm hover:shadow-md ring-1 ring-emerald-200/50 transition-all duration-200 ml-auto"
            onClick={() => navigator.share?.({title: `${post.author?.username}'s post`, url: window.location.href})}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Share</span>
          </motion.button>
        </div>

        {/* Comments Preview (if needed) */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50/50 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-sm text-gray-600 italic">Comments coming soon...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PostCard;
