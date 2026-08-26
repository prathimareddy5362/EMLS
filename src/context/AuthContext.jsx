import React, {
  createContext,
  useState,
  useEffect,
} from 'react';

import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  // ==============================
  // RESTORE LOGIN SESSION
  // ==============================

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser =
          localStorage.getItem('elms_user');

        const token =
          localStorage.getItem('elms_token');

        if (savedUser && token) {
          const parsedUser =
            JSON.parse(savedUser);

          setUser(parsedUser);

          setIsAuthenticated(true);
        } else {
          setUser(null);

          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error(
          'Failed to restore user:',
          error
        );

        localStorage.removeItem(
          'elms_user'
        );

        localStorage.removeItem(
          'elms_token'
        );

        localStorage.removeItem(
          'elms_user_id'
        );

        setUser(null);

        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ==============================
  // LOGIN
  // ==============================

  const login = async (
    email,
    password
  ) => {
    setLoading(true);

    try {
      const data =
        await authAPI.login(
          email,
          password
        );

      const loggedUser = data.user;

      if (!loggedUser) {
        throw new Error(
          'Login failed. User data not received.'
        );
      }

      setUser(loggedUser);

      setIsAuthenticated(true);

      localStorage.setItem(
        'elms_user',
        JSON.stringify(loggedUser)
      );

      if (data.token) {
        localStorage.setItem(
          'elms_token',
          data.token
        );
      }

      localStorage.setItem(
        'elms_user_id',
        String(loggedUser.id)
      );

      return loggedUser;

    } catch (error) {
      setUser(null);

      setIsAuthenticated(false);

      localStorage.removeItem(
        'elms_user'
      );

      localStorage.removeItem(
        'elms_token'
      );

      localStorage.removeItem(
        'elms_user_id'
      );

      throw error;

    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // REGISTER
  // ==============================

  const register = async (
    userData
  ) => {
    setLoading(true);

    try {
      const response =
        await authAPI.register(
          userData
        );

      return response;

    } catch (error) {
      throw error;

    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOGOUT
  // ==============================

  const logout = () => {
    authAPI.logout();

    setUser(null);

    setIsAuthenticated(false);
  };

  // ==============================
  // UPDATE PROFILE
  // ==============================

  const updateProfile = (
    updatedUser
  ) => {
    setUser((previousUser) => {
      if (!previousUser) {
        return previousUser;
      }

      const newUser = {
        ...previousUser,
        ...updatedUser,
      };

      localStorage.setItem(
        'elms_user',
        JSON.stringify(newUser)
      );

      return newUser;
    });
  };

  // ==============================
  // CONTEXT VALUE
  // ==============================

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};