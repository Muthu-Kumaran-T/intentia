// frontend/src/pages/Profile.js - REMOVED SAVED TAB ✅
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userAPI} from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const { user: authUser, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(authUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({
    username: authUser?.username || '',
    bio: authUser?.bio || '',
  });

  useEffect(() => { 
    fetchProfile(); 
    fetchUserPosts();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await userAPI.getProfile();
      setUser(data.data);
      setFormData({
        username: data.data.username,
        bio: data.data.bio || '',
      });
    } catch (error) { 
      console.error(error); 
    }
  };

  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);
      const { data } = await userAPI.getUserPosts();
      setPosts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await userAPI.updateProfile(formData);
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    } finally { 
      setLoading(false); 
    }
  };

  const stats = [
    { label: 'Posts', value: user?.totalPosts || 0 },
    { label: 'Followers', value: user?.followers?.length || 0 },
    { label: 'Following', value: user?.following?.length || 0 },
  ];

  // Post Modal Component (UNCHANGED)
  const PostModal = ({ post, onClose }) => {
    if (!post) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`max-w-5xl w-full rounded-2xl overflow-hidden shadow-2xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col md:flex-row max-h-[90vh]">
            {/* Media Section */}
            <div className="flex-1 bg-black flex items-center justify-center">
              {post.mediaUrl ? (
                post.mediaType === 'video' ? (
                  <video 
                    src={post.mediaUrl} 
                    controls 
                    className="max-h-[90vh] w-full object-contain"
                  />
                ) : (
                  <img 
                    src={post.mediaUrl} 
                    alt="Post" 
                    className="max-h-[90vh] w-full object-contain"
                  />
                )
              ) : (
                <div className="p-8 text-center">
                  <p className="text-white text-lg">{post.content}</p>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className={`w-full md:w-96 flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Header */}
              <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user?.username}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {post.category}
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-4`}>
                  {post.content}
                </p>
                {post.keywords && post.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.keywords.map((keyword, idx) => (
                      <span 
                        key={idx} 
                        className={`px-2 py-1 rounded-full text-xs ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                )}
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(post.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {/* Actions */}
              <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2">
                    <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {post.likes?.length || 0}
                    </span>
                  </button>
                  <button className="flex items-center gap-2">
                    <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {post.commentsCount || 0}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-pink-50'}`}>
      {/* Header */}
      <motion.header className={`backdrop-blur-xl shadow-2xl sticky top-0 z-40 transition-all duration-500 border-b ${
        isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/90 border-gray-100 shadow-lg'
      }`}>
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
            Profile
          </motion.h1>
          
          <motion.button 
            onClick={logout} 
            whileHover={{ scale: 1.05 }}
            className={`px-4 py-1 rounded-lg text-sm font-medium ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            Logout
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Info Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8"
        >
          <div className="flex items-start gap-8 mb-8">
            {/* Profile Picture */}
            <div className={`w-32 h-32 ${isDarkMode ? 'bg-purple-600' : 'bg-gradient-to-br from-purple-500 to-blue-500'} rounded-full flex items-center justify-center text-white font-bold text-5xl shadow-xl`}>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.username || 'Username'}
                </h2>
                <motion.button 
                  onClick={() => setIsEditing(!isEditing)} 
                  whileHover={{ scale: 1.05 }}
                  className={`px-6 py-2 rounded-xl font-medium ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </motion.button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mb-4">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stat.value}
                    </span>
                    <span className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bio */}
              {!isEditing ? (
                <div>
                  <p className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user?.email || 'email@example.com'}
                  </p>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                    {user?.bio || 'No bio yet. Click "Edit Profile" to add one!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={`w-full p-3 rounded-xl border focus:ring-2 focus:outline-none ${
                      isDarkMode 
                        ? 'bg-gray-700/70 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/30' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/30'
                    }`}
                    placeholder="Username"
                  />
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows="3"
                    className={`w-full p-3 rounded-xl border focus:ring-2 focus:outline-none resize-none ${
                      isDarkMode 
                        ? 'bg-gray-700/70 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/30' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/30'
                    }`}
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex gap-3">
                    <motion.button 
                      onClick={handleSave} 
                      disabled={loading} 
                      whileHover={{ scale: 1.02 }}
                      className={`flex-1 p-3 rounded-xl font-semibold transition-all ${
                        loading 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : isDarkMode 
                            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg' 
                            : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg'
                      }`}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                    <motion.button 
                      onClick={() => setIsEditing(false)}
                      whileHover={{ scale: 1.02 }}
                      className={`px-6 rounded-xl font-semibold ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }`}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Posts Grid - NO TABS */}
        <div className="mt-6">
          {postsLoading ? (
            <div className="grid grid-cols-3 gap-1">
              {[...Array(9)].map((_, i) => (
                <div 
                  key={i} 
                  className={`aspect-square ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse rounded`}
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <svg className={`w-24 h-24 mx-auto mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                No Posts Yet
              </p>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                When you share photos and videos, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <motion.div
                  key={post._id}
                  whileHover={{ opacity: 0.8 }}
                  className="aspect-square cursor-pointer relative group overflow-hidden rounded"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.mediaUrl ? (
                    post.mediaType === 'video' ? (
                      <div className="relative w-full h-full">
                        <video 
                          src={post.mediaUrl} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={post.mediaUrl} 
                        alt="Post" 
                        className="w-full h-direct object-cover"
                      />
                    )
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center p-4 ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <p className={`text-sm text-center line-clamp-6 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {post.content}
                      </p>
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-white">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span className="font-bold">{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                      </svg>
                      <span className="font-bold">{post.commentsCount || 0}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <PostModal 
            post={selectedPost} 
            onClose={() => setSelectedPost(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
