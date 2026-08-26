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

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
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

  // Auth session restore ayye varaku
  // routes redirect avvakunda wait chestundi
  if (loading) {
    return <Loader />;
  }

  const isLoggedIn =
    Boolean(isAuthenticated && user);

  return (
    <Routes>

      {/* =========================
          PUBLIC ROUTES
      ========================== */}

      <Route
        path="/login"
        element={
          isLoggedIn
            ? (
              <Navigate
                to="/dashboard"
                replace
              />
            )
            : <Login />
        }
      />

      <Route
        path="/register"
        element={
          isLoggedIn
            ? (
              <Navigate
                to="/dashboard"
                replace
              />
            )
            : <Register />
        }
      />

      {/* =========================
          ROOT ROUTE
      ========================== */}

      <Route
        path="/"
        element={
          isLoggedIn
            ? (
              <Navigate
                to="/dashboard"
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

      {/* =========================
          404 PAGE
      ========================== */}

      <Route
        path="*"
        element={
          isLoggedIn
            ? (
              <Navigate
                to="/dashboard"
                replace
              />
            )
            : <NotFound />
        }
      />

    </Routes>
  );
};

export default AppRoutes;