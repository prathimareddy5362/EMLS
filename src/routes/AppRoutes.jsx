import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ApplyLeave from '../pages/ApplyLeave';
import MyLeaves from '../pages/MyLeaves';
import LeaveHistory from '../pages/LeaveHistory';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

const RouteLayoutWrapper = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
};

const AppRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  const getRootRedirect = () => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  };

  return (
    <Routes>

      {/* Public Routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated
            ? <Login />
            : <Navigate to="/dashboard" replace />
        }
      />

      <Route
        path="/register"
        element={
          !isAuthenticated
            ? <Register />
            : <Navigate to="/dashboard" replace />
        }
      />

      {/* Root */}
      <Route
        path="/"
        element={getRootRedirect()}
      />

      {/* Protected Routes */}
      <Route element={<RouteLayoutWrapper />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/apply-leave"
          element={<ApplyLeave />}
        />

        <Route
          path="/my-leaves"
          element={<MyLeaves />}
        />

        <Route
          path="/leave-history"
          element={<LeaveHistory />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

    </Routes>
  );
};

export default AppRoutes;