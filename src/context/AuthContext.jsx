import React, { createContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore login data when app starts
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('elms_user');
      const savedToken = localStorage.getItem('elms_token');

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);

        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to restore login session:', error);

      localStorage.removeItem('elms_user');
      localStorage.removeItem('elms_token');
      localStorage.removeItem('elms_user_id');

      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (email, password) => {
    setLoading(true);

    try {
      const data = await authAPI.login(email, password);

      console.log('Login response:', data);

      // Support different backend response formats
      const loggedUser = data?.user || data?.data?.user || data;

      if (!loggedUser || !loggedUser.id) {
        throw new Error('Invalid login response from server');
      }

      const token =
        data?.token ||
        data?.accessToken ||
        data?.data?.token ||
        null;

      // Save user
      localStorage.setItem(
        'elms_user',
        JSON.stringify(loggedUser)
      );

      // Save token if backend returns one
      if (token) {
        localStorage.setItem('elms_token', token);
      }

      localStorage.setItem(
        'elms_user_id',
        String(loggedUser.id)
      );

      setUser(loggedUser);
      setIsAuthenticated(true);

      return loggedUser;
    } catch (error) {
      console.error('Login failed:', error);

      setUser(null);
      setIsAuthenticated(false);

      localStorage.removeItem('elms_user');
      localStorage.removeItem('elms_token');
      localStorage.removeItem('elms_user_id');

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    setLoading(true);

    try {
      const response = await authAPI.register(userData);

      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('elms_token');
    localStorage.removeItem('elms_user_id');
    localStorage.removeItem('elms_user');

    setUser(null);
    setIsAuthenticated(false);
  };

  // Update profile
  const updateProfile = (updatedUser) => {
    setUser((previousUser) => {
      if (!previousUser) {
        return previousUser;
      }

      const newUser = {
        ...previousUser,
        ...updatedUser
      };

      localStorage.setItem(
        'elms_user',
        JSON.stringify(newUser)
      );

      return newUser;
    });
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};