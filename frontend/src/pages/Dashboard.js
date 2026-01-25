// frontend/src/pages/Dashboard.js - FULL GLOBAL THEME INTEGRATION ✅
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // ✅ ADDED GLOBAL THEME
import CategoryFeed from '../components/CategoryFeed';
import CreatePost from '../components/CreatePost';

const categoryIcons = {
  'Share & Thoughts': '💭',
  'Music': '🎵',
  'Play': '🎮',
  'Buzz': '📰',
  'Movies': '🎬',
  'Learning & Tech': '💻',
  'Sports': '⚽',
  'Food': '🍔',
  'Travel': '✈️',
  'All': '🌐'
};

const Dashboard = () => {
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme(); // ✅ GLOBAL THEME HOOK
  
  const getUrlParameter = (name) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  };

  const [selectedCategory, setSelectedCategory] = useState(
    getUrlParameter('category') || 'Share & Thoughts'
  );
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    const urlCategory = getUrlParameter('category');
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }

    const handlePopState = () => {
      const newCategory = getUrlParameter('category');
      if (newCategory) {
        setSelectedCategory(newCategory);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handlePostCreated = () => {
    setShowCreatePost(false);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-800' : 'bg-gradient-to-br from-purple-50 via-white to-blue-50'} transition-all duration-500 relative overflow-hidden`}>
      {/* Animated Background Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 ${isDarkMode ? 'bg-white/20' : 'bg-purple-400/30'} rounded-full`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 3 + i * 0.2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      ))}

      {/* Header */}
      <motion.header 
        className={`shadow-2xl sticky top-0 z-50 transition-all duration-500 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-gray-800/95 to-gray-900/95 backdrop-blur-xl border-gray-700 border-b' 
            : 'bg-gradient-to-r from-purple-600/95 via-blue-600/90 to-purple-600/95 backdrop-blur-xl shadow-purple-500/25'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => window.history.back()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-2xl ${isDarkMode ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600' : 'bg-white/20 text-white hover:bg-white/40'} transition-all duration-300 shadow-lg`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <motion.div 
              className="flex items-center gap-4"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <motion.span 
                className="text-4xl drop-shadow-2xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {categoryIcons[selectedCategory]}
              </motion.span>
              <h1 className={`text-3xl lg:text-4xl font-black ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl' 
                  : 'text-white drop-shadow-2xl'
              }`}>
                {selectedCategory}
              </h1>
            </motion.div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.2, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-2xl shadow-xl transition-all duration-300 backdrop-blur-sm ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-yellow-400/80 to-orange-400/80 text-gray-900 ring-2 ring-yellow-300/50' 
                    : 'bg-white/30 text-white ring-2 ring-white/50'
                }`}
                title={isDarkMode ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </motion.button>

              {/* Logout */}
              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-2xl ${isDarkMode ? 'bg-red-500/20 text-red-300 hover:bg-red-500/40 hover:text-red-100' : 'bg-white/20 text-white hover:bg-white/40'} shadow-lg transition-all duration-300`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Feed Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto px-6 py-12 pb-28 relative z-10"
      >
        <CategoryFeed 
          category={selectedCategory} 
          isDarkMode={isDarkMode} // ✅ PASSED GLOBAL THEME
        />
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setShowCreatePost(true)}
        whileHover={{ scale: 1.1, y: -5, boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-28 right-8 w-20 h-20 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-purple-500/50' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-purple-500/30'
        } text-white rounded-3xl shadow-2xl transition-all duration-300 flex items-center justify-center z-50 ring-4 ring-white/20 backdrop-blur-sm`}
      >
        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </motion.button>

      {/* Enhanced Bottom Navigation */}
      <motion.nav 
        className={`fixed bottom-0 left-0 right-0 ${
          isDarkMode 
            ? 'bg-gray-800/95 border-gray-700 backdrop-blur-xl shadow-2xl' 
            : 'bg-white/95 border-gray-200 backdrop-blur-xl shadow-2xl'
        } border-t z-40 transition-all duration-500`}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="flex items-center justify-around gap-2">
            {[
              { icon: "M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z", label: "Home", active: true },
              { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", label: "Trending", active: false },
              { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", label: "Profile", active: false }
            ].map((item, index) => (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 ${
                  item.active
                    ? isDarkMode 
                      ? 'text-purple-400 bg-purple-500/20 ring-2 ring-purple-400/30 shadow-lg' 
                      : 'text-purple-600 bg-purple-100 ring-2 ring-purple-300 shadow-lg'
                    : isDarkMode 
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-7 h-7" fill={item.active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={item.active ? 0 : 2} d={item.icon} />
                </svg>
                <span className="text-xs font-bold">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePost
          onClose={handlePostCreated}
          defaultCategory={selectedCategory}
          isDarkMode={isDarkMode} // ✅ PASSED GLOBAL THEME
        />
      )}
    </div>
  );
};

export default Dashboard;
