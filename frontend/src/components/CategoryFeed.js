// frontend/src/components/CategoryFeed.js
import React, { useState, useEffect, useCallback } from 'react';
import { postAPI } from '../services/api';
import PostCard from './PostCard';
import { motion } from 'framer-motion';

const CategoryFeed = ({ category }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('recent'); // 'recent' or 'trending'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (page === 1) {
      setLoading(true);
    }
    setError(null);
    
    try {
      let response;
      
      if (view === 'recent') {
        response = await postAPI.getByCategory(category, page);
      } else {
        response = await postAPI.getTrending(category, 'week');
      }
      
      if (response.data.success) {
        const newPosts = response.data.data;
        
        if (page === 1) {
          setPosts(newPosts);
        } else {
          setPosts(prev => [...prev, ...newPosts]);
        }
        
        // Check if there are more posts
        if (response.data.pagination) {
          setHasMore(page < response.data.pagination.pages);
        } else {
          setHasMore(newPosts.length >= 20); // Assume more if full page
        }
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [category, view, page]);

  // Reset when category or view changes
  useEffect(() => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
  }, [category, view]);

  // Fetch posts when dependencies change
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleViewChange = (newView) => {
    if (view !== newView) {
      setView(newView);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    fetchPosts();
  };

  if (loading && page === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 mt-4">Loading {category} posts...</p>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-red-500 text-lg mb-2">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => handleViewChange('recent')}
          className={`px-6 py-2.5 rounded-xl font-medium transition shadow-md hover:shadow-lg ${
            view === 'recent'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent
          </div>
        </button>
        
        <button
          onClick={() => handleViewChange('trending')}
          className={`px-6 py-2.5 rounded-xl font-medium transition shadow-md hover:shadow-lg ${
            view === 'trending'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            Trending
          </div>
        </button>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <div className="text-7xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-6">Be the first to share something in {category}!</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition"
          >
            Refresh Feed
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && view === 'recent' && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </div>
                ) : (
                  'Load More Posts'
                )}
              </button>
            </div>
          )}

          {/* End of Feed Message */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center mt-8 py-6 bg-white rounded-xl shadow-md">
              <svg className="w-10 h-10 mx-auto mb-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold text-gray-800 mb-1">You're all caught up!</p>
              <p className="text-sm text-gray-500">Check back later for new posts</p>
            </div>
          )}
        </>
      )}

      {/* Loading Indicator for Load More */}
      {loading && page > 1 && (
        <div className="text-center py-6">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default CategoryFeed;