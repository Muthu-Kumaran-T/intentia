// frontend/src/pages/Onboarding.js - FULL GLOBAL THEME INTEGRATION ✅
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // ✅ ADDED GLOBAL THEME
import { authAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import SearchModal from './SearchModal';

const categories = [
  { name: 'Share & Thoughts', icon: '💭', color: 'bg-blue-500', description: 'Share moments & ideas' },
  { name: 'Music', icon: '🎵', color: 'bg-purple-500', description: 'Discover music' },
  { name: 'Play', icon: '🎮', color: 'bg-green-500', description: 'Gaming content' },
  { name: 'Buzz', icon: '📰', color: 'bg-orange-500', description: 'Latest news' },
  { name: 'Movies', icon: '🎬', color: 'bg-red-500', description: 'Film & cinema' },
  { name: 'Learning & Tech', icon: '💻', color: 'bg-indigo-500', description: 'Education & innovation' },
  { name: 'Sports', icon: '⚽', color: 'bg-emerald-500', description: 'Sports & fitness' },
  { name: 'Food', icon: '🍔', color: 'bg-amber-500', description: 'Food & recipes' },
  { name: 'Travel', icon: '✈️', color: 'bg-cyan-500', description: 'Travel & adventure' },
  { name: 'All', icon: '🌐', color: 'bg-gray-700', description: 'Explore all' },
];

// Profile Dropdown Component
const ProfileDropdown = ({ user, onClose, onLogout, isDarkMode }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuItems = [
    { icon: '👤', label: 'Profile', action: () => navigate('/profile') },
    { icon: '💾', label: 'Saved', action: () => navigate('/saved') },
    { icon: '📦', label: 'Archive', action: () => navigate('/archive') },
    { icon: '📊', label: 'Your Activity', action: () => navigate('/activity') },
    { icon: '⏰', label: 'Time Management', action: () => navigate('/time-management') },
    { icon: '🔒', label: 'Account Privacy', action: () => navigate('/privacy') },
    { icon: '⚙️', label: 'Settings', action: () => navigate('/settings') },
  ];

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className={`absolute left-0 top-full mt-2 w-64 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-2xl border overflow-hidden z-[10000]`}
    >
      {/* User Info Section */}
      <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gradient-to-r from-purple-900/50 to-blue-900/50' : 'border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50'}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
            {user?.username?.[0]?.toUpperCase() || 'M'}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} truncate`}>{user?.username || 'User'}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2 max-h-96 overflow-y-auto">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.action();
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} transition-colors text-left`}
          >
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 text-red-500 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'} transition-colors font-medium text-left`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

const Onboarding = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme(); // ✅ GLOBAL THEME HOOK
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // ✅ REMOVED: Local isDarkMode state & useEffect (ThemeContext handles this)

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category.name);
    
    try {
      await authAPI.completeOnboarding(category.name);
      
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.onboardingCompleted = true;
      userData.selectedIntent = category.name;
      localStorage.setItem('user', JSON.stringify(userData));
      
      setTimeout(() => {
        if (category.name === 'Share & Thoughts') {
          navigate('/dashboard?action=create');
        } else {
          navigate(`/dashboard?category=${encodeURIComponent(category.name)}`);
        }
      }, 300);
    } catch (error) {
      console.error('Onboarding error:', error);
      setTimeout(() => {
        if (category.name === 'Share & Thoughts') {
          navigate('/dashboard?action=create');
        } else {
          navigate(`/dashboard?category=${encodeURIComponent(category.name)}`);
        }
      }, 300);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} relative overflow-hidden transition-colors duration-300`}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <header className="relative z-[200] flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-11 h-11 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg hover:shadow-lg transition-shadow cursor-pointer ring-2 ring-white"
            >
              {user?.username?.[0]?.toUpperCase() || 'M'}
            </button>
            
            <AnimatePresence>
              {showProfileDropdown && (
                <ProfileDropdown
                  user={user}
                  onClose={() => setShowProfileDropdown(false)}
                  onLogout={logout}
                  isDarkMode={isDarkMode} // ✅ GLOBAL THEME PROP
                />
              )}
            </AnimatePresence>
          </div>
          <div>
            <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} text-base`}>
              Hello, {user?.username || 'User'}!
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Ready to explore?</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle - NOW GLOBAL ✅ */}
          <button
            onClick={toggleTheme} // ✅ GLOBAL TOGGLE FUNCTION
            className={`p-2 rounded-lg transition ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-white/50 text-gray-600'} hover:scale-110`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className={`flex items-center gap-2 px-3 py-1 text-sm ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'} transition rounded-lg`}
          >
            <span className="text-sm">Logout</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Animated Glowing Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 max-w-3xl mx-auto px-4 mt-4"
      >
        <div className="relative group">
          {/* Glowing effect */}
          <div className={`absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300 animate-glow`}></div>
          
          {/* Search bar */}
          <div className="relative">
            <button
              onClick={() => setShowSearchModal(true)}
              className={`w-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-2 rounded-2xl px-6 py-5 flex items-center gap-4 shadow-2xl hover:shadow-3xl transition-all duration-300 group-hover:scale-[1.02]`}
            >
              {/* Search Icon with Animation */}
              <div className="relative">
                <svg 
                  className={`w-7 h-7 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} transition-transform group-hover:scale-110`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {/* Pulse animation on icon */}
                <span className="absolute inset-0 animate-ping">
                  <svg className={`w-7 h-7 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} opacity-20`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>

              {/* Search Text */}
              <div className="flex-1 text-left">
                <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all`}>
                  Search for users...
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                  Find people, connect, and explore together
                </p>
              </div>

              {/* Right Arrow */}
              <svg 
                className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transform group-hover:translate-x-1 transition-transform`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-[100] max-w-6xl mx-auto px-6 py-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">✨</span>
            <h1 className={`text-3xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-purple-400 to-blue-400' : 'from-purple-600 to-blue-600'} bg-clip-text text-transparent`}>
              What do you want to do today?
            </h1>
            <span className="text-3xl">✨</span>
          </div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-base`}>
            Choose a category to explore and share amazing content
          </p>
        </motion.div>

        {/* Category Grid with Glowing Effect */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="relative group"
            >
              {/* Glowing border effect */}
              <div 
                className={`absolute -inset-0.5 bg-gradient-to-r ${
                  selectedCategory === category.name 
                    ? 'from-purple-600 via-pink-500 to-purple-600' 
                    : 'from-purple-600/50 via-blue-500/50 to-purple-600/50'
                } rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-300 animate-glow`}
              ></div>
              
              {/* Category Card */}
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategorySelect(category)}
                className={`relative w-full ${
                  selectedCategory === category.name ? 'ring-4 ring-purple-500' : ''
                }`}
              >
                <div className={`relative ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300`}>
                  <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-2xl mb-3 mx-auto transform group-hover:rotate-6 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  
                  <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} text-base mb-1`}>
                    {category.name}
                  </h3>
                  
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {category.description}
                  </p>

                  {selectedCategory === category.name && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        isDarkMode={isDarkMode} // ✅ GLOBAL THEME PROP
      />

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
