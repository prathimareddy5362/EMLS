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

// Layout wrapper for protected routes
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
  const { user, isAuthenticated } = useAuth();

  // Root redirect helper based on roles
  const getRootRedirect = () => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" replace={true} />;
    }
    return user.role === 'admin' 
      ? <Navigate to="/admin" replace={true} /> 
      : <Navigate to="/dashboard" replace={true} />;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : getRootRedirect()} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : getRootRedirect()} />

      {/* Root redirect */}
      <Route path="/" element={getRootRedirect()} />

      {/* Employee Protected Routes */}
      <Route element={<RouteLayoutWrapper allowedRoles={['employee']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/my-leaves" element={<MyLeaves />} />
        <Route path="/leave-history" element={<LeaveHistory />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<RouteLayoutWrapper allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/leave-requests" element={<LeaveRequests />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      {/* Shared Protected Routes (both admin and employee) */}
      <Route element={<RouteLayoutWrapper allowedRoles={['employee', 'admin']} />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* 404 Route */}
      <Route element={<RouteLayoutWrapper allowedRoles={['employee', 'admin']} />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
