// frontend/src/pages/TimeManagement.js - FULL THEME + BAR CHART ✅
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const TimeManagement = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [dailyLimit, setDailyLimit] = useState(60);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [breakReminder, setBreakReminder] = useState(30);

  const stats = {
    today: 45,
    week: 280,
    average: 40,
  };

  const handleSave = () => {
    alert('Time management settings saved!');
  };

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
            Time Management
          </motion.h1>
          
          <div className="w-20" />
        </div>
      </motion.header>

      {/* COMPACT CONTENT */}
      <div className={`max-w-2xl mx-auto px-6 py-8 relative z-10 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        {/* Usage Stats Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className={`rounded-2xl p-6 mb-6 shadow-lg ${
            isDarkMode ? 'bg-gray-800/80 backdrop-blur border border-gray-700' : 'bg-white/80 backdrop-blur border'
          }`}
        >
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Your Usage</h2>
          
          {/* Bar Chart */}
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Today</span>
                <span>{stats.today}/{dailyLimit} min</span>
              </div>
              <div className={`h-4 rounded-full bg-gray-200 ${isDarkMode ? 'bg-gray-700' : ''}`}>
                <motion.div 
                  className="h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stats.today / dailyLimit) * 100, 100)}%` }}
                  transition={{ duration: 1.5 }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>This Week</span>
                <span>{stats.week} min</span>
              </div>
              <div className={`h-4 rounded-full bg-gray-200 ${isDarkMode ? 'bg-gray-700' : ''}`}>
                <motion.div 
                  className="h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Daily Avg</span>
                <span>{stats.average} min</span>
              </div>
              <div className={`h-4 rounded-full bg-gray-200 ${isDarkMode ? 'bg-gray-700' : ''}`}>
                <motion.div 
                  className="h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: '67%' }}
                  transition={{ duration: 1.5, delay: 0.4 }}
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className={`text-center p-3 rounded-xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{stats.today}m</div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Today</div>
            </div>
            <div className={`text-center p-3 rounded-xl ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-50'}`}>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>{stats.week/7}m</div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg/Week</div>
            </div>
            <div className={`text-center p-3 rounded-xl ${isDarkMode ? 'bg-green-500/20' : 'bg-green-50'}`}>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{stats.average}m</div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average</div>
            </div>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 mb-6 shadow-lg ${
            isDarkMode ? 'bg-gray-800/80 backdrop-blur border border-gray-700' : 'bg-white/80 backdrop-blur border'
          }`}
        >
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Time Limits</h2>
          
          <div className="space-y-6">
            {/* Daily Limit */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                Daily Limit
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="15" max="180" step="15"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(parseInt(e.target.value))}
                  className={`flex-1 h-2 rounded-lg cursor-pointer ${isDarkMode ? 'bg-gray-700 accent-purple-500' : 'bg-gray-200 accent-purple-500'}`}
                />
                <span className={`text-lg font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} w-20 text-right`}>
                  {dailyLimit}min
                </span>
              </div>
            </div>

            {/* Break Reminder */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                Break Every
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="15" max="60" step="15"
                  value={breakReminder}
                  onChange={(e) => setBreakReminder(parseInt(e.target.value))}
                  className={`flex-1 h-2 rounded-lg cursor-pointer ${isDarkMode ? 'bg-gray-700 accent-emerald-500' : 'bg-gray-200 accent-emerald-500'}`}
                />
                <span className={`text-lg font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} w-20 text-right`}>
                  {breakReminder}min
                </span>
              </div>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/50">
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Usage Reminders</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Notify when reaching limit</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setReminderEnabled(!reminderEnabled)}
                className={`w-12 h-6 rounded-full transition-all shadow-md flex-shrink-0 ${
                  reminderEnabled 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                    : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <motion.div 
                  className="w-5 h-5 bg-white rounded-full shadow-sm"
                  animate={{ x: reminderEnabled ? 18 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                />
              </motion.button>
            </div>
          </div>

          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.02 }}
            className={`w-full mt-6 py-3 rounded-xl font-semibold shadow-lg transition-all ${
              isDarkMode 
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
            }`}
          >
            Save Settings
          </motion.button>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-xl shadow-lg border-l-4 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-l-green-500 border border-gray-700 text-gray-300' 
              : 'bg-green-50 border-l-green-500 border border-gray-200 text-green-800'
          }`}
        >
          <h3 className={`font-bold mb-4 text-lg ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>
            💡 Healthy Usage Tips
          </h3>
          <div className="space-y-1 text-sm">
            <div>• Take breaks every 30 minutes</div>
            <div>• Limit to specific times daily</div>
            <div>• Focus on quality interactions</div>
            <div>• Use intent-based browsing</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TimeManagement;
