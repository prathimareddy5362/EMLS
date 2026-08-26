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
  // CLEAR AUTH DATA
  // ==============================

  const clearAuthData = () => {
    localStorage.removeItem('elms_user');
    localStorage.removeItem('elms_token');
    localStorage.removeItem('elms_user_id');
  };

  // ==============================
  // RESTORE LOGIN SESSION
  // ==============================

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token =
          localStorage.getItem('elms_token');

        // Token lekapothe login session ledu
        if (!token) {
          setUser(null);
          setIsAuthenticated(false);
          return;
        }

        // Backend nundi current logged-in user ni fetch chestham
        const response =
          await authAPI.getCurrentUser();

        const currentUser =
          response.user;

        if (!currentUser) {
          throw new Error(
            'User data not received'
          );
        }

        // Latest user data state lo save
        setUser(currentUser);

        setIsAuthenticated(true);

        // Local storage update
        localStorage.setItem(
          'elms_user',
          JSON.stringify(currentUser)
        );

        localStorage.setItem(
          'elms_user_id',
          String(currentUser.id)
        );

      } catch (error) {
        console.error(
          'Failed to restore login session:',
          error
        );

        // Token invalid/expired ayithe clear
        clearAuthData();

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

      const loggedUser =
        data.user;

      const token =
        data.token;

      if (!loggedUser) {
        throw new Error(
          'Login failed. User data not received.'
        );
      }

      if (!token) {
        throw new Error(
          'Login failed. Authentication token not received.'
        );
      }

      // State update
      setUser(loggedUser);

      setIsAuthenticated(true);

      // Save login session
      localStorage.setItem(
        'elms_user',
        JSON.stringify(loggedUser)
      );

      localStorage.setItem(
        'elms_token',
        token
      );

      localStorage.setItem(
        'elms_user_id',
        String(loggedUser.id)
      );

      return loggedUser;

    } catch (error) {
      clearAuthData();

      setUser(null);

      setIsAuthenticated(false);

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