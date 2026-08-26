import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('elms_token');
      if (token) {
        try {
          const data = await authAPI.getCurrentUser();
          setUser(data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to restore authentication', error);
          // Token expired or invalid
          localStorage.removeItem('elms_token');
          localStorage.removeItem('elms_user_id');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return data.user;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authAPI.register(userData);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('elms_token');
    localStorage.removeItem('elms_user_id');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedUser) => {
    setUser((prev) => (prev && prev.id === updatedUser.id ? { ...prev, ...updatedUser } : prev));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
