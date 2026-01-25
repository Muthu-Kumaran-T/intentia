// frontend/src/pages/Privacy.js - FULL THEME + SAVED HEADER ✅
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Privacy = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [settings, setSettings] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    allowFollowers: true,
    showActivity: true,
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = () => {
    alert('Privacy settings saved!');
  };

  const privacyOptions = [
    { key: 'profileVisible', title: 'Public Profile', description: 'Visible to everyone', icon: '👁️' },
    { key: 'showEmail', title: 'Show Email', description: 'Display on profile', icon: '📧' },
    { key: 'showPhone', title: 'Show Phone', description: 'Display phone number', icon: '📱' },
    { key: 'allowMessages', title: 'Allow Messages', description: 'Receive DMs', icon: '💬' },
    { key: 'allowFollowers', title: 'Allow Followers', description: 'Let others follow', icon: '👥' },
    { key: 'showActivity', title: 'Activity Status', description: 'Show last active', icon: '🟢' },
  ];

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
            Privacy
          </motion.h1>
          
          <div className="w-20" />
        </div>
      </motion.header>

      {/* COMPACT CONTENT */}
      <div className={`max-w-2xl mx-auto px-6 py-8 relative z-10 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        {/* Privacy Toggles */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className={`rounded-2xl p-6 mb-6 shadow-lg ${
            isDarkMode ? 'bg-gray-800/80 backdrop-blur border border-gray-700' : 'bg-white/80 backdrop-blur border'
          }`}
        >
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Privacy Settings</h2>
          
          <div className="space-y-3">
            {privacyOptions.map((option, index) => (
              <motion.div
                key={option.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-xl hover:shadow-md transition-all cursor-pointer group ${
                  isDarkMode 
                    ? 'bg-gray-700/50 hover:bg-purple-500/10 border border-gray-600 hover:border-purple-500/30' 
                    : 'bg-gray-50/50 hover:bg-purple-50 border border-gray-200 hover:border-purple-400/30'
                }`}
                onClick={() => handleToggle(option.key)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`text-xl p-2 rounded-lg shadow-sm ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-400/20 text-purple-500'}`}>
                    {option.icon}
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {option.title}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {option.description}
                    </p>
                  </div>
                </div>
                
                <motion.div
                  className={`w-12 h-6 rounded-full shadow-md flex-shrink-0 transition-all relative overflow-hidden ${
                    settings[option.key]
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-blue-500/25'
                      : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className="w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5"
                    animate={{ x: settings[option.key] ? 18 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.02 }}
            className={`w-full mt-6 py-3 rounded-xl font-semibold shadow-lg transition-all ${
              isDarkMode 
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700' 
                : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600'
            }`}
          >
            Save Changes
          </motion.button>
        </motion.div>

        {/* Data & Security */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-6 shadow-lg ${
            isDarkMode ? 'bg-gray-800/80 backdrop-blur border border-gray-700' : 'bg-white/80 backdrop-blur border'
          }`}
        >
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Data & Security</h2>
          
          <div className="space-y-3">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${
                isDarkMode 
                  ? 'bg-gray-700/50 hover:bg-gray-600 border border-gray-600 hover:border-purple-500/30 hover:shadow-lg' 
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-purple-400/30 hover:shadow-md'
              }`}
            >
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Download Data</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get account data copy</p>
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
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Two-Factor Auth</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage 2FA settings</p>
              </div>
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${
                isDarkMode 
                  ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 hover:shadow-lg' 
                  : 'bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-400 hover:shadow-md'
              }`}
            >
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>Delete Account</p>
                <p className={`text-sm ${isDarkMode ? 'text-red-500/80' : 'text-red-500'}`}>Permanently delete</p>
              </div>
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
