import React from 'react';

import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';

import Layout from '../components/layout/Layout';

import { useAuth } from '../hooks/useAuth';

import Loader from '../components/common/Loader';

// ==============================
// PAGES
// ==============================

import Login from '../pages/Login';
import Register from '../pages/Register';

import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';

import ApplyLeave from '../pages/ApplyLeave';
import MyLeaves from '../pages/MyLeaves';
import LeaveHistory from '../pages/LeaveHistory';

import Profile from '../pages/Profile';

import NotFound from '../pages/NotFound';

// ==============================
// PROTECTED LAYOUT
// ==============================

const RouteLayoutWrapper = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
};

// ==============================
// APP ROUTES
// ==============================

const AppRoutes = () => {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  // Wait until auth session is restored

  if (loading) {
    return <Loader />;
  }

  const isLoggedIn =
    Boolean(isAuthenticated && user);

  // ==============================
  // ROLE BASED HOME
  // ==============================

  const getHomeRoute = () => {
    if (user?.role === 'admin') {
      return '/admin';
    }

    return '/dashboard';
  };

  return (
    <Routes>

      {/* =========================
          LOGIN
      ========================== */}

      <Route
        path="/login"
        element={
          isLoggedIn
            ? (
              <Navigate
                to={getHomeRoute()}
                replace
              />
            )
            : (
              <Login />
            )
        }
      />

      {/* =========================
          REGISTER
      ========================== */}

      <Route
        path="/register"
        element={
          isLoggedIn
            ? (
              <Navigate
                to={getHomeRoute()}
                replace
              />
            )
            : (
              <Register />
            )
        }
      />

      {/* =========================
          ROOT
      ========================== */}

      <Route
        path="/"
        element={
          isLoggedIn
            ? (
              <Navigate
                to={getHomeRoute()}
                replace
              />
            )
            : (
              <Navigate
                to="/login"
                replace
              />
            )
        }
      />

      {/* =========================
          PROTECTED ROUTES
      ========================== */}

      <Route
        element={<RouteLayoutWrapper />}
      >

        {/* =========================
            EMPLOYEE DASHBOARD
        ========================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* =========================
            ADMIN DASHBOARD
        ========================== */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        {/* =========================
            APPLY LEAVE
        ========================== */}

        <Route
          path="/apply-leave"
          element={<ApplyLeave />}
        />

        {/* =========================
            MY LEAVES
        ========================== */}

        <Route
          path="/my-leaves"
          element={<MyLeaves />}
        />

        {/* =========================
            LEAVE HISTORY
        ========================== */}

        <Route
          path="/leave-history"
          element={<LeaveHistory />}
        />

        {/* =========================
            PROFILE
        ========================== */}

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Route>

      {/* =========================
          404
      ========================== */}

      <Route
        path="*"
        element={
          isLoggedIn
            ? (
              <Navigate
                to={getHomeRoute()}
                replace
              />
            )
            : (
              <NotFound />
            )
        }
      />

    </Routes>
  );
};

export default AppRoutes;