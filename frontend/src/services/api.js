import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance WITHOUT default Content-Type
const api = axios.create({
  baseURL: API_URL,
  // ⚠️ REMOVED: 'Content-Type': 'application/json'
  // Let axios set Content-Type automatically based on data type
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ✅ CRITICAL FIX: Set Content-Type only for non-FormData requests
    if (config.data && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    // If data is FormData, axios will automatically set:
    // 'Content-Type': 'multipart/form-data; boundary=...'
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  verifyTOTPSetup: (userId, totpCode) => api.post('/auth/verify-totp-setup', { userId, totpCode }),
  login: (data) => api.post('/auth/login', data),
  completeOnboarding: (selectedIntent) => api.post('/auth/complete-onboarding', { selectedIntent }),
  disable2FA: (password) => api.post('/auth/disable-2fa', { password }),
  regenerateTOTP: (password) => api.post('/auth/regenerate-totp', { password }),
};

// Post APIs
export const postAPI = {
  // ✅ This will now work with FormData!
  create: (data) => {
    console.log('📤 Sending post data:', data instanceof FormData ? 'FormData' : 'JSON');
    return api.post('/posts', data);
  },
  getByCategory: (category, page = 1) => api.get(`/posts/category/${category}?page=${page}`),
  getByHashtag: (hashtag, page = 1) => api.get(`/posts/hashtag/${hashtag}?page=${page}`),
  getTrending: (category, timeframe = 'week') => api.get(`/posts/trending/${category}?timeframe=${timeframe}`),
  getTrendingHashtags: (timeframe = 'week', limit = 10) => api.get(`/posts/trending-hashtags?timeframe=${timeframe}&limit=${limit}`),
  like: (postId) => api.post(`/posts/${postId}/like`),
  addComment: (postId, content) => api.post(`/posts/${postId}/comment`, { content }),
  getComments: (postId) => api.get(`/posts/${postId}/comments`),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),

  // User posts 
  getUserPosts: () => api.get('/user/posts'),
  
  // Saved posts
  getSavedPosts: () => api.get('/user/saved'),
  savePost: (postId) => api.post(`/user/save/${postId}`),
  unsavePost: (postId) => api.delete(`/user/save/${postId}`),
  
  // Archived posts
  getArchivedPosts: () => api.get('/user/archived'),
  archivePost: (postId) => api.post(`/user/archive/${postId}`),
  unarchivePost: (postId) => api.delete(`/user/archive/${postId}`),
  
  // Activity
  getActivity: (type = 'all') => api.get(`/user/activity?type=${type}`),
  
  // Settings
  updatePrivacy: (settings) => api.put('/user/privacy', settings),
  updateNotifications: (settings) => api.put('/user/notifications', settings),
  updateTimeManagement: (settings) => api.put('/user/time-management', settings),
  updatePreferences: (settings) => api.put('/user/preferences', settings),
  
  // Follow
  followUser: (userId) => api.post(`/user/follow/${userId}`),
  unfollowUser: (userId) => api.delete(`/user/follow/${userId}`),
};

// Search APIs
export const searchAPI = {
  searchUsers: (query) => api.get(`/search/users?query=${encodeURIComponent(query)}`),
  getRecent: () => api.get('/search/recent'),
  addToRecent: (userId) => api.post(`/search/recent/${userId}`),
  clearRecent: () => api.delete('/search/recent'),
  
  // Convenience methods
  followUser: (userId) => userAPI.followUser(userId),
  unfollowUser: (userId) => userAPI.unfollowUser(userId),
};

export default api;