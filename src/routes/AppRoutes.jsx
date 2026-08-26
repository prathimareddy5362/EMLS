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
import AdminDashboard from '../pages/AdminDashboard';
import Employees from '../pages/Employees';
import LeaveRequests from '../pages/LeaveRequests';
import Reports from '../pages/Reports';
import NotFound from '../pages/NotFound';

const RouteLayoutWrapper = ({ allowedRoles }) => {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
};

const AppRoutes = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Wait until authentication check is complete
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '18px',
        }}
      >
        Loading...
      </div>
    );
  }

  const getRootRedirect = () => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" replace />;
    }

    return user.role === 'admin'
      ? <Navigate to="/admin" replace />
      : <Navigate to="/dashboard" replace />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : getRootRedirect()}
      />

      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : getRootRedirect()}
      />

      {/* Root */}
      <Route path="/" element={getRootRedirect()} />

      {/* Employee Routes */}
      <Route element={<RouteLayoutWrapper allowedRoles={['employee']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/my-leaves" element={<MyLeaves />} />
        <Route path="/leave-history" element={<LeaveHistory />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<RouteLayoutWrapper allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/leave-requests" element={<LeaveRequests />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      {/* Shared Routes */}
      <Route
        element={
          <RouteLayoutWrapper allowedRoles={['employee', 'admin']} />
        }
      >
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;