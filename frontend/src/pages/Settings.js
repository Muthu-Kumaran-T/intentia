// frontend/src/pages/Settings.js - FULL THEME + SAVED HEADER ✅
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    likes: true,
    comments: true,
    follows: true,
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'light',
    autoplay: true,
  });

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        { key: 'email', label: 'Email Notifications', description: 'Receive updates via email', icon: '📧' },
        { key: 'push', label: 'Push Notifications', description: 'Browser notifications', icon: '🔔' },
        { key: 'likes', label: 'Likes', description: 'When someone likes your post', icon: '❤️' },
        { key: 'comments', label: 'Comments', description: 'When someone comments', icon: '💬' },
        { key: 'follows', label: 'New Followers', description: 'When someone follows you', icon: '👥' },
      ],
    },
  ];

  const handleNotificationToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleSave = () => {
    alert('Settings saved!');
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
            Settings
          </motion.h1>
          
          <div className="w-20" />
        </div>
      </motion.header>

      {/* COMPACT CONTENT */}
      <div className={`max-w-2xl mx-auto px-6 py-8 relative z-10 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        {/* Notifications */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className={`rounded-2xl p-6 mb-6 shadow-lg ${
            isDarkMode ? 'bg-gray-800/80 backdrop-blur border border-gray-700' : 'bg-white/80 backdrop-blur border'
          }`}
        >
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Notifications</h2>
          
          <div className="space-y-3">
            {settingsSections[0].items.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-xl hover:shadow-md transition-all cursor-pointer group ${
                  isDarkMode 
                    ? 'bg-gray-700/50 hover:bg-blue-500/10 border border-gray-600 hover:border-blue-500/30' 
                    : 'bg-gray-50/50 hover:bg-blue-50 border border-gray-200 hover:border-blue-400/30'
                }`}
                onClick={() => handleNotificationToggle(item.key)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`text-xl p-2 rounded-lg shadow-sm ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-400/20 text-blue-500'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.label}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <motion.div
                  className={`w-12 h-6 rounded-full shadow-md flex-shrink-0 transition-all relative overflow-hidden ${
                    notifications[item.key]
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-blue-500/25'
                      : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className="w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5"
                    animate={{ x: notifications[item.key] ? 18 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 mb-6 shadow-lg ${
            isDarkMode ? 'bg-gray-800/80 backdrop-blur border border-gray-700' : 'bg-white/80 backdrop-blur border'
          }`}
        >
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Preferences</h2>
          
          <div className="space-y-6">
            {/* Language */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 font-medium shadow-sm focus:outline-none focus:ring-4 transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500/50 focus:border-purple-500' 
                    : 'bg-white border-gray-200 text-gray-900 focus:ring-purple-400/50 focus:border-purple-400'
                }`}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
              </select>
            </div>

            {/* Theme */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                Theme
              </label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 font-medium shadow-sm focus:outline-none focus:ring-4 transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500/50 focus:border-purple-500' 
                    : 'bg-white border-gray-200 text-gray-900 focus:ring-purple-400/50 focus:border-purple-400'
                }`}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">System</option>
              </select>
            </div>

            {/* Autoplay Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/50">
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Autoplay Videos</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Auto-play in feed</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setPreferences({ ...preferences, autoplay: !preferences.autoplay })}
                className={`w-12 h-6 rounded-full transition-all shadow-md flex-shrink-0 ${
                  preferences.autoplay 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                    : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <motion.div 
                  className="w-5 h-5 bg-white rounded-full shadow-sm"
                  animate={{ x: preferences.autoplay ? 18 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* About & Legal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-6 shadow-lg ${
            isDarkMode ? 'bg-gray-800/80 backdrop-blur border border-gray-700' : 'bg-white/80 backdrop-blur border'
          }`}
        >
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>About</h2>
          
          <div className="space-y-3 mb-6">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${
                isDarkMode 
                  ? 'bg-gray-700/50 hover:bg-gray-600 border border-gray-600 hover:border-purple-500/30 hover:shadow-lg' 
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-purple-400/30 hover:shadow-md'
              }`}
            >
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Help Center</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get support</p>
              </div>
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400 group-hover:text-purple-400' : 'text-gray-500 group-hover:text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${
                isDarkMode 
                  ? 'bg-gray-700/50 hover:bg-gray-600 border border-gray-600 hover:border-blue-500/30 hover:shadow-lg' 
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-blue-400/30 hover:shadow-md'
              }`}
            >
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Terms of Service</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Read terms</p>
              </div>
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${
                isDarkMode 
                  ? 'bg-gray-700/50 hover:bg-gray-600 border border-gray-600 hover:border-emerald-500/30 hover:shadow-lg' 
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-emerald-400/30 hover:shadow-md'
              }`}
            >
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Privacy Policy</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Data handling</p>
              </div>
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400 group-hover:text-emerald-400' : 'text-gray-500 group-hover:text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          {/* Version Info */}
          <div className={`p-4 rounded-xl text-center border ${
            isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Version 1.0.0</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>© 2026 Intentia</p>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.02 }}
            className={`w-full py-3 rounded-xl font-semibold shadow-lg transition-all mx-auto block ${
              isDarkMode 
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700' 
                : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600'
            }`}
          >
            Save All Changes
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
