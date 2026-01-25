// frontend/src/components/CreatePost.jsx
import React, { useState } from 'react';
import { postAPI } from '../services/api';
import { motion } from 'framer-motion';

const categories = [
  'Share & Thoughts',
  'Music',
  'Play', 
  'Buzz',
  'Movies',
  'Learning & Tech',
  'Sports',
  'Food',
  'Travel',
  'All'
];

const CreatePost = ({ onClose, defaultCategory }) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(defaultCategory || 'Share & Thoughts');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  // Extract hashtags from content for preview (MERGED from 1st version)
  const extractHashtags = (text) => {
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? [...new Set(matches.map(tag => tag.slice(1).toLowerCase()))] : [];
  };

  const detectedHashtags = extractHashtags(content);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File size validation (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    // File type validation
    const fileType = file.type.split('/')[0];
    if (fileType !== 'image' && fileType !== 'video') {
      setError('Only images and videos are allowed');
      return;
    }

    setMediaFile(file);
    setMediaType(fileType);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !mediaFile) {
      setError('Please write something or add a media file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('category', category);
      
      if (mediaFile) {
        formData.append('media', mediaFile); // Matches your Cloudinary routes
      }

      const response = await postAPI.create(formData);
      
      if (response.data.success) {
        onClose(); // Close modal without page reload
        window.location.reload(); // Refresh parent feed
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      setError(error.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create Post</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={loading}
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                disabled={loading}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Content Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's on your mind?
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition"
                rows="6"
                placeholder="Share your thoughts... Use #hashtags to categorize your post"
                maxLength="2000"
                disabled={loading}
              />
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-gray-500">
                  {content.length}/2000 characters
                </span>
                <span className="text-purple-600 font-medium">
                  Use #hashtags for discoverability
                </span>
              </div>
            </div>

            {/* Detected Hashtags Preview (MERGED FEATURE) */}
            {detectedHashtags.length > 0 && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium text-purple-800 mb-2">
                  ✨ Detected Hashtags:
                </p>
                <div className="flex flex-wrap gap-2">
                  {detectedHashtags.slice(0, 6).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                  {detectedHashtags.length > 6 && (
                    <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                      +{detectedHashtags.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Media Preview */}
            {mediaPreview && (
              <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                {mediaType === 'image' ? (
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <video 
                    src={mediaPreview} 
                    controls 
                    className="w-full h-64 object-cover"
                    preload="metadata"
                  />
                )}
                <button
                  onClick={removeMedia}
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg"
                  disabled={loading}
                  title="Remove media"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Media Upload Button */}
            {!mediaPreview && (
              <div>
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    className="hidden"
                    disabled={loading}
                  />
                  <div className="border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 rounded-xl p-8 text-center transition-all duration-200">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-700 mb-1">Click to upload</p>
                    <p className="text-gray-500">Image or Video • Max 10MB</p>
                  </div>
                </label>
              </div>
            )}

            {/* AI Features Info (MERGED from 2nd version) */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-blue-900 mb-2">🤖 AI-Powered Post Enhancement</p>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• Auto-classifies content if no category selected</li>
                    <li>• Generates smart summaries for long posts</li>
                    <li>• Extracts keywords & hashtags automatically</li>
                    <li>• Content moderation for safety</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || (!content.trim() && !mediaFile)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-semibold focus:ring-4 focus:ring-purple-500 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </>
                ) : (
                  'Post Now'
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePost;
