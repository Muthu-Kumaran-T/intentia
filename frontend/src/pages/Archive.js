// frontend/src/pages/Archive.js - SAVED PAGE BACK BUTTON + COMPACT CONTENT ✅
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Archive = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* SAVED PAGE HEAVY BACK BUTTON - UNCHANGED */}
      <motion.header 
        className={`backdrop-blur-xl shadow-2xl sticky top-0 z-50 transition-all duration-500 border-b ${
          isDarkMode 
            ? 'bg-gray-800/95 border-gray-700' 
            : 'bg-white/90 border-gray-100 shadow-lg'
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
            Archive
          </motion.h1>
          
          <div className="w-20" />
        </div>
      </motion.header>

      {/* COMPACT CONTENT */}
      <div className={`max-w-3xl mx-auto px-6 py-8 relative z-10 transition-colors duration-300 ${
        isDarkMode ? 'text-gray-100' : 'text-gray-900'
      }`}>
        {/* Compact Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-8 text-center shadow-lg mb-6 ${
            isDarkMode 
              ? 'bg-gray-800/70 backdrop-blur-xl border border-gray-700' 
              : 'bg-white/80 backdrop-blur-xl border border-gray-200'
          }`}
        >
          <div className={`text-6xl mb-4 ${isDarkMode ? 'text-purple-500' : 'text-purple-400'}`}>📦</div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Archive is Empty
          </h2>
          <p className={`text-base mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Archive posts to hide from profile/dashboard. Restore anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.05 }}
              className={`px-6 py-2.5 rounded-xl font-semibold ${
                isDarkMode 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              Dashboard
            </motion.button>
            <motion.button
              onClick={() => navigate('/profile')}
              whileHover={{ scale: 1.02 }}
              className={`px-6 py-2.5 rounded-xl font-semibold ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              Profile
            </motion.button>
          </div>
        </motion.div>

        {/* Compact Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-xl shadow-lg border-l-4 ${
            isDarkMode 
              ? 'bg-gray-800/50 backdrop-blur border border-gray-700 border-l-purple-500' 
              : 'bg-blue-50 border border-gray-200 border-l-blue-500'
          }`}
        >
          <h3 className={`font-bold mb-3 text-lg ${isDarkMode ? 'text-purple-400' : 'text-blue-800'}`}>
            How Archive Works
          </h3>
          <div className="space-y-2 text-sm">
            <div>• Hidden from public profile</div>
            <div>• Only you can see them</div>
            <div>• Restore anytime</div>
            <div>• Organize content</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Archive;
