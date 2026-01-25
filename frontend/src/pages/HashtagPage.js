// frontend/src/pages/HashtagPage.js - FULL GLOBAL THEME + ESLint FIXED ✅
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext'; // ✅ ADDED GLOBAL THEME
import PostCard from '../components/PostCard';
import { postAPI } from '../services/api';

const HashtagPage = () => {
  const { hashtag } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); // ✅ GLOBAL THEME HOOK
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIXED: useCallback prevents exhaustive-deps warning
  const fetchHashtagPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postAPI.getByHashtag(hashtag, 1);
      setPosts(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch hashtag posts:', error);
    } finally {
      setLoading(false);
    }
  }, [hashtag]);

  // FIXED: useEffect now has correct dependencies
  useEffect(() => {
    fetchHashtagPosts();
  }, [fetchHashtagPosts]);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-800' 
        : 'bg-gradient-to-br from-purple-50 via-white to-blue-50'
    }`}>
      {/* Animated Background Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 ${isDarkMode ? 'bg-white/20' : 'bg-purple-400/30'} rounded-full`}
          style={{
            left: `${10 + i * 5}%`,
            top: `${20 + (i % 4) * 20}%`,
          }}
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ 
            duration: 4 + i * 0.3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      ))}

      {/* Header */}
      <motion.header 
        className={`shadow-2xl sticky top-0 z-50 transition-all duration-500 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-gray-800/95 to-gray-900/95 backdrop-blur-xl border-gray-700' 
            : 'bg-gradient-to-r from-purple-600/95 via-blue-600/90 to-purple-600/95 backdrop-blur-xl shadow-purple-500/25'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700/50 text-gray-200 hover:bg-gray-600 hover:text-white' 
                  : 'bg-white/20 text-white hover:bg-white/40 shadow-lg'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back</span>
            </motion.button>

            <motion.div 
              className="flex items-center gap-3"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.span 
                className={`text-4xl drop-shadow-2xl ${isDarkMode ? 'text-purple-400' : 'text-white'}`}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                #
              </motion.span>
              <h1 className={`text-3xl lg:text-4xl font-black ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl' 
                  : 'text-white drop-shadow-2xl'
              }`}>
                {hashtag}
              </h1>
            </motion.div>

            <div className="w-20" /> {/* Spacer */}
          </div>
          
          <motion.p 
            className={`text-center mt-3 text-sm font-medium transition-colors ${
              isDarkMode ? 'text-gray-300' : 'text-purple-100'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {posts.length} post{posts.length !== 1 ? 's' : ''}
          </motion.p>
        </div>
      </motion.header>

      {/* Posts Feed */}
      <div className={`max-w-3xl mx-auto px-6 py-12 relative z-10 transition-colors duration-300 ${
        isDarkMode ? 'text-gray-100' : 'text-gray-900'
      }`}>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center">
              <div className={`inline-block w-16 h-16 border-4 rounded-full animate-spin ${
                isDarkMode 
                  ? 'border-purple-500 border-t-purple-400 bg-gray-900/50' 
                  : 'border-purple-500 border-t-transparent'
              }`}></div>
              <motion.p 
                className={`mt-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading #{hashtag} posts...
              </motion.p>
            </div>
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`py-20 rounded-3xl shadow-2xl transition-all duration-500 ${
              isDarkMode 
                ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' 
                : 'bg-white/80 backdrop-blur-xl border border-gray-200'
            }`}
          >
            <svg className={`w-20 h-20 mx-auto mb-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <motion.h3 
              className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              No posts found with #{hashtag}
            </motion.h3>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Be the first to use this hashtag!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.6 }}
              >
                <PostCard post={post} isDarkMode={isDarkMode} /> {/* ✅ PASSED THEME */}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HashtagPage;
