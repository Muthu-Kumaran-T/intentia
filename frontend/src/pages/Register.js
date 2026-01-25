import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/api';

const Register = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: TOTP Setup
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [userId, setUserId] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      });

      // Store QR code and user info
      setQrCode(response.data.data.qrCode);
      setSecret(response.data.data.secret);
      setUserId(response.data.data.userId);
      
      // Debug: Check if QR code is received
      console.log('QR Code received:', response.data.data.qrCode ? 'YES' : 'NO');
      console.log('Secret:', response.data.data.secret);
      
      setStep(2); // Move to TOTP setup
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.verifyTOTPSetup(userId, totpCode);

      // Store token and user data
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));

      // Force a hard redirect to ensure route change
      window.location.href = '/onboarding';

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500 p-4">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          // Step 1: Registration Form
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Join Intentia</h1>
              <p className="text-gray-600">Create your secure account</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+91 1234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">For account recovery</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 text-white py-2 rounded-lg font-medium hover:bg-primary-600 transition disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Continue to 2FA Setup'}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 font-medium hover:underline">
                Login
              </Link>
            </p>
          </motion.div>
        ) : (
          // Step 2: TOTP Setup
          <motion.div
            key="totp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Set Up 2FA</h1>
              <p className="text-gray-600 text-sm">
                Scan this QR code with Google Authenticator app
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              {/* QR Code */}
              <div className="flex justify-center mb-4">
                {qrCode ? (
                  <img 
                    src={qrCode} 
                    alt="QR Code for 2FA Setup" 
                    className="w-48 h-48 border-4 border-white shadow-lg rounded-xl bg-white"
                    onError={(e) => {
                      console.error('QR Code image failed to load');
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-48 h-48 border-4 border-gray-300 rounded-xl flex items-center justify-center bg-white">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Loading QR Code...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Entry */}
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-2">Or enter this code manually:</p>
                <div className="bg-white px-3 py-2 rounded border inline-block">
                  <code className="text-sm font-mono text-gray-800 select-all">
                    {secret || 'Loading...'}
                  </code>
                </div>
                {secret && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(secret);
                      alert('Secret copied to clipboard!');
                    }}
                    className="ml-2 text-xs text-primary-500 hover:underline"
                  >
                    📋 Copy
                  </button>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-sm">
              <p className="font-medium text-blue-800 mb-2">📱 How to set up:</p>
              <ol className="text-blue-700 space-y-1 list-decimal list-inside">
                <li>Download Google Authenticator app</li>
                <li>Tap "+" and scan QR code above</li>
                <li>Enter the 6-digit code below</li>
              </ol>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerifyTOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest font-bold"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || totpCode.length !== 6}
                className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Complete Setup'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-gray-500 text-sm hover:underline"
              >
                ← Back to Registration
              </button>
            </form>

            {/* Warning */}
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                ⚠️ Save your backup codes! You'll need your authenticator app for every login.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;