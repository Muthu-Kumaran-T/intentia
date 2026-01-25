import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [requiresTOTP, setRequiresTOTP] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ username, password, totpCode });

      // If TOTP required, show TOTP input
      if (response.data.requiresTOTP) {
        setRequiresTOTP(true);
        setLoading(false);
        return;
      }

      // Store token and user data
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));

      // Force a hard redirect to ensure route change
      window.location.href = '/onboarding';

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Intentia</h1>
          <p className="text-gray-600">Secure Login with 2FA</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
              disabled={requiresTOTP}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
              disabled={requiresTOTP}
            />
          </div>

          {requiresTOTP && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t pt-4 mt-4"
            >
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 text-sm">
                <p className="text-blue-800 font-medium">🔐 2FA Required</p>
                <p className="text-blue-700 text-xs mt-1">
                  Enter the 6-digit code from your Google Authenticator app
                </p>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Authenticator Code
              </label>
              <input
                type="text"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest font-bold"
                placeholder="000000"
                maxLength="6"
                autoFocus
                required
              />
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading || (requiresTOTP && totpCode.length !== 6)}
            className="w-full bg-primary-500 text-white py-2 rounded-lg font-medium hover:bg-primary-600 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : requiresTOTP ? 'Verify & Login' : 'Continue'}
          </button>

          {requiresTOTP && (
            <button
              type="button"
              onClick={() => {
                setRequiresTOTP(false);
                setTotpCode('');
                setError('');
              }}
              className="w-full text-gray-500 text-sm hover:underline"
            >
              ← Back to Login
            </button>
          )}
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 font-medium hover:underline">
            Register
          </Link>
        </p>

        {/* Help Section */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-gray-500 text-center">
            Lost access to your authenticator?{' '}
            <button 
              type="button"
              onClick={() => alert('Please contact support@intentia.com')}
              className="text-primary-500 hover:underline"
            >
              Contact Support
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;