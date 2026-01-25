// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import Saved from './pages/Saved';
import Archive from './pages/Archive';
import Activity from './pages/Activity';
import TimeManagement from './pages/TimeManagement';
import Privacy from './pages/Privacy';
import Settings from './pages/Settings';
import HashtagPage from './pages/HashtagPage';

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
    <div className="text-center">
      <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 mt-4 font-medium">Loading...</p>
    </div>
  </div>
);

// Public Route - Only for login/register (redirects to onboarding if logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // If logged in, go to onboarding (always!)
  if (isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }

  // Not logged in, show login/register
  return children;
};

// Onboarding Route - Requires login
const OnboardingRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Not logged in, go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, show onboarding
  return children;
};

// Protected Route - Requires login (for dashboard and other pages)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Not logged in, go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, show protected page
  return children;
};

function App() {
  return (
    <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          {/* ONBOARDING ROUTE */}
          <Route
            path="/onboarding"
            element={
              <OnboardingRoute>
                <Onboarding />
              </OnboardingRoute>
            }
          />

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <Saved />
              </ProtectedRoute>
            }
          />
          <Route
            path="/archive"
            element={
              <ProtectedRoute>
                <Archive />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <Activity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/time-management"
            element={
              <ProtectedRoute>
                <TimeManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy"
            element={
              <ProtectedRoute>
                <Privacy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/hashtag/:hashtag"
            element={
              <ProtectedRoute>
                <HashtagPage />
              </ProtectedRoute>
            }
          />

          {/* DEFAULT ROUTE - Always go to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 404 - Unknown routes go to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;