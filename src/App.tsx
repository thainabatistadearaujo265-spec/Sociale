import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NicheSelection from './pages/NicheSelection';
import Generator from './pages/Generator';
import SavedContent from './pages/SavedContent';
import Premium from './pages/Premium';
import Layout from './components/Layout';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!profile?.niche && window.location.pathname !== '/niche') {
    return <Navigate to="/niche" />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="niche" element={<NicheSelection />} />
            <Route path="generate/:type" element={<Generator />} />
            <Route path="saved" element={<SavedContent />} />
            <Route path="premium" element={<Premium />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
