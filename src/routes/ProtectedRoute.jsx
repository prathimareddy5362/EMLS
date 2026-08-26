import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const ProtectedRoute = ({ children }) => {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  // Auth restore complete ayye varaku wait
  if (loading) {
    return <Loader fullScreen />;
  }

  // User login kakapothe login page ki redirect
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Login ayithe requested page show
  return children;
};

export default ProtectedRoute;