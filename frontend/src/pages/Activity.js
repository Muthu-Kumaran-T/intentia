// frontend/src/pages/Activity.js - FULL THEME + SAVED HEADER ✅
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Activity = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [activities] = useState([
    { id: 1, type: 'post', action: 'Created a post in Movies', time: '2 hours ago', icon: '📝' },
    { id: 2, type: 'like', action: 'Liked 3 posts in Music category', time: '5 hours ago', icon: '❤️' },
    { id: 3, type: 'comment', action: 'Commented on "Best games of 2024"', time: '1 day ago', icon: '💬' },
    { id: 4, type: 'follow', action: 'Started following @john_doe', time: '2 days ago', icon: '👥' },
    { id: 5, type: 'login', action: 'Logged in from new device', time: '3 days ago', icon: '🔐' },
  ]);

  const [filter, setFilter] = useState('all');
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.type === filter);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-800' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
      {/* SAVED PAGE HEAVY HEADER */}
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
            Activity
          </motion.h1>
          
          <div className="w-20" />
        </div>
      </motion.header>

      {/* COMPACT CONTENT */}
      <div className={`max-w-2xl mx-auto px-6 py-8 relative z-10 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        {/* Compact Filters */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {['all', 'post', 'like', 'comment', 'follow'].map((type) => (
            <motion.button
              key={type}
              onClick={() => setFilter(type)}
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex-shrink-0 shadow-sm ${
                filter === type
                  ? isDarkMode 
                    ? 'bg-purple-600 text-white shadow-purple-500/25' 
                    : 'bg-purple-500 text-white shadow-purple-400/25'
                  : isDarkMode 
                    ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600 border border-gray-600 hover:border-gray-500' 
                    : 'bg-white/70 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Activity List */}
        <div className="space-y-3">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl p-4 shadow-md hover:shadow-lg transition-all border cursor-pointer group ${
                isDarkMode 
                  ? 'bg-gray-800/70 backdrop-blur border-gray-700 hover:border-purple-500/50 hover:bg-purple-500/5' 
                  : 'bg-white/80 backdrop-blur border-gray-200 hover:border-purple-400/50 hover:bg-purple-50/50'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-3">
                <div className={`text-xl p-2 rounded-lg ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-400/20 text-purple-500'}`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {activity.action}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {activity.time}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-8 text-center shadow-lg mt-8 ${
              isDarkMode 
                ? 'bg-gray-800/80 backdrop-blur border border-gray-700' 
                : 'bg-white/80 backdrop-blur border border-gray-200'
            }`}
          >
            <div className={`text-4xl mb-4 ${isDarkMode ? 'text-purple-500' : 'text-purple-400'}`}>📊</div>
            <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Activity Found
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No {filter} activity yet
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Activity;
