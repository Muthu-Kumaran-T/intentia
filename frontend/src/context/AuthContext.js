// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Check auth on mount
  useEffect(() => {
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password, totpCode) => {
    try {
      const response = await authAPI.login({ email, password, totpCode });
      
      if (response.data.requiresTOTP) {
        return { requiresTOTP: true };
      }

      const { token: newToken, ...userData } = response.data.data;
      
      // Save to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setToken(newToken);
      setUser(userData);
      
      // ALWAYS navigate to onboarding after login
      navigate('/onboarding');
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await authAPI.register({ username, email, password });
      const { token: newToken, ...userData } = response.data.data;
      
      // Save to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setToken(newToken);
      setUser(userData);
      
      // ALWAYS navigate to onboarding after registration
      navigate('/onboarding');
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Clear everything
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    
    // Go back to login
    navigate('/login');
  };

  const selectCategory = (categoryName) => {
    // Just navigate to dashboard with category
    // No API call, no localStorage update for onboarding
    navigate(`/dashboard?category=${encodeURIComponent(categoryName)}`);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    selectCategory,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;