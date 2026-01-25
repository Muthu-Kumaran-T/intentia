// frontend/src/pages/Saved.js - HEAVY HEADER + COMPACT CONTENT ✅
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Saved = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [savedPosts] = useState([
    {
      id: 1,
      category: 'Movies',
      content: 'Just watched Inception! Mind-blowing movie about dreams within dreams.',
      author: 'john_doe',
      savedAt: '2 hours ago',
    },
    {
      id: 2,
      category: 'Music',
      content: 'New album from Taylor Swift is absolutely amazing! 🎵',
      author: 'music_lover',
      savedAt: '1 day ago',
    },
  ]);

  const handleUnsave = (id) => {
    alert(`Unsave post ${id} - API call needed`);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-800' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
      {/* HEAVY HEADER - UNCHANGED */}
      <motion.header 
        className={`backdrop-blur-xl shadow-2xl sticky top-0 z-50 transition-all duration-500 border-b ${
          isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/90 border-gray-100 shadow-lg'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${
              isDarkMode 
                ? 'bg-gray-700/60 text-gray-200 hover:bg-gray-600 hover:text-white ring-2 ring-gray-600/50' 
                : 'bg-white/60 text-gray-800 hover:bg-white hover:shadow-xl ring-2 ring-gray-300/50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </motion.button>
          
          <motion.h1 
            className={`text-4xl font-black ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent drop-shadow-xl'
            }`}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            Saved Posts
          </motion.h1>
          
          <div className="w-20" />
        </div>
      </motion.header>

      {/* COMPACT CONTENT */}
      <div className={`max-w-2xl mx-auto px-6 py-8 relative z-10 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        <p className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {savedPosts.length} saved {savedPosts.length === 1 ? 'post' : 'posts'}
        </p>

        {savedPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-8 text-center shadow-lg ${
              isDarkMode 
                ? 'bg-gray-800/80 backdrop-blur border border-gray-700' 
                : 'bg-white/80 backdrop-blur border border-gray-200'
            }`}
          >
            <div className={`text-5xl mb-4 ${isDarkMode ? 'text-purple-500' : 'text-purple-400'}`}>🔖</div>
            <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Saved Posts
            </h2>
            <p className={`text-base mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Posts you save will appear here
            </p>
            <motion.button
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.05 }}
              className={`px-6 py-2.5 rounded-xl font-semibold ${
                isDarkMode 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              Explore Posts
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {savedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl p-6 shadow-lg hover:shadow-xl border cursor-pointer group ${
                  isDarkMode 
                    ? 'bg-gray-800/70 backdrop-blur border-gray-700 hover:border-purple-500/50' 
                    : 'bg-white/80 backdrop-blur border-gray-200 hover:border-purple-400/50'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold mb-2 ${
                      post.category === 'Movies' 
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-400/30' 
                        : 'bg-purple-500/20 text-purple-400 border border-purple-400/30'
                    }`}>
                      {post.category}
                    </span>
                    <p className={`text-lg leading-relaxed mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {post.content}
                    </p>
                    <div className={`flex items-center gap-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>by @{post.author}</span>
                      <span>•</span>
                      <span>Saved {post.savedAt}</span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => handleUnsave(post.id)}
                    whileHover={{ scale: 1.1 }}
                    className={`p-2 rounded-lg ml-2 ${isDarkMode ? 'text-red-400 hover:bg-red-500/20' : 'text-red-500 hover:bg-red-100'}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
