import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loader fullScreen={true} />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace={true} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user's role is not authorized, redirect to their respective dashboard
    const fallbackPath = user.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={fallbackPath} replace={true} />;
  }

  return children;
};

export default ProtectedRoute;
