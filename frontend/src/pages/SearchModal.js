import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { userAPI } from '../services/api';

const SearchModal = ({ isOpen, onClose, isDarkMode }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Fetch recent searches on mount
  useEffect(() => {
    if (isOpen) {
      fetchRecentSearches();
    }
  }, [isOpen]);

  // Search with debounce
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setActiveTab('recent');
      return;
    }

    setActiveTab('all');
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const fetchRecentSearches = async () => {
    try {
      // Get recent searches from localStorage for now
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      setRecentSearches(recent.slice(0, 5)); // Show only last 5
    } catch (error) {
      console.error('Failed to fetch recent searches:', error);
    }
  };

  const performSearch = async (searchQuery) => {
    try {
      setLoading(true);
      // Use the userAPI to search users
      const response = await userAPI.searchUsers(searchQuery);
      setResults(response.data.data || []);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (user) => {
    try {
      // Add to recent searches in localStorage
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const filtered = recent.filter(u => u._id !== user._id);
      const updated = [user, ...filtered].slice(0, 10); // Keep only 10
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      // Close modal and navigate
      onClose();
      navigate(`/profile/${user.username}`);
    } catch (error) {
      console.error('Failed to add to recent:', error);
      onClose();
      navigate(`/profile/${user.username}`);
    }
  };

  const handleClearRecent = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  const handleFollowToggle = async (userId, currentlyFollowing) => {
    try {
      if (currentlyFollowing) {
        await userAPI.unfollowUser(userId);
      } else {
        await userAPI.followUser(userId);
      }
      
      // Update results
      setResults(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, isFollowing: !currentlyFollowing }
          : user
      ));
      
      // Update recent searches
      setRecentSearches(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, isFollowing: !currentlyFollowing }
          : user
      ));
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  if (!isOpen) return null;

  const displayData = activeTab === 'recent' && query.trim().length === 0 
    ? recentSearches 
    : results;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`w-full max-w-2xl ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } rounded-2xl shadow-2xl border-2 overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Search Users
                  </h2>
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-lg ${
                      isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                    } transition-colors`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for users..."
                    className={`w-full pl-12 pr-10 py-3 ${
                      isDarkMode 
                        ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                        : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300'
                    } border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Results Area */}
              <div className={`max-h-[400px] overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                {/* Recent Searches Header */}
                {activeTab === 'recent' && recentSearches.length > 0 && !query && (
                  <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Recent Searches
                    </h3>
                    <button
                      onClick={handleClearRecent}
                      className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'} font-medium transition`}
                    >
                      Clear all
                    </button>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className={`ml-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Searching...</p>
                  </div>
                )}

                {/* No Query */}
                {!loading && !query && recentSearches.length === 0 && (
                  <div className="text-center py-12">
                    <svg className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                      Search for users
                    </p>
                    <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-sm mt-2`}>
                      Start typing to find people
                    </p>
                  </div>
                )}

                {/* No Results */}
                {!loading && query && displayData.length === 0 && (
                  <div className="text-center py-12">
                    <svg className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                      No users found
                    </p>
                    <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-sm mt-2`}>
                      Try searching for "{query}"
                    </p>
                  </div>
                )}

                {/* User Results */}
                {!loading && displayData.length > 0 && (
                  <div className="p-2">
                    {displayData.map((user) => (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 rounded-xl ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-white'} transition-colors mb-1`}
                      >
                        <div className="flex items-center justify-between">
                          <div 
                            className="flex items-center gap-3 flex-1 cursor-pointer"
                            onClick={() => handleUserClick(user)}
                          >
                            {/* Avatar */}
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                              {user.username[0].toUpperCase()}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} truncate`}>
                                {user.username}
                              </p>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                                {user.email || `@${user.username}`}
                              </p>
                            </div>
                          </div>

                          {/* Follow Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFollowToggle(user._id, user.isFollowing);
                            }}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition shadow-sm ${
                              user.isFollowing
                                ? isDarkMode
                                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                            }`}
                          >
                            {user.isFollowing ? 'Following' : 'Follow'}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`p-3 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Press <kbd className={`px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} font-mono text-xs`}>ESC</kbd> to close
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;