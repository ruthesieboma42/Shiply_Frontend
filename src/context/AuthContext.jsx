import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        const userData = buildUserFromToken(decoded);
        setToken(storedToken);
        setUser(userData);
      } catch {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Backend returns a raw JWT string — decode it to get user info
  const buildUserFromToken = (decoded) => ({
    id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
    email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
    role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
  });

  const login = async (email, password) => {
  try {
    const response = await apiClient.post('/Auth/Login', { email, password });
    
    // Backend returns raw string token — could be in response.data directly
    const newToken = typeof response.data === 'string' 
      ? response.data 
      : response.data.token;

    if (!newToken) {
      return { success: false, error: 'No token received from server' };
    }

    const decoded = jwtDecode(newToken);
    const userData = buildUserFromToken(decoded);

    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    return { success: true, role: userData.role };
  } catch (error) {
    console.error('Login error:', error); 
    return { success: false, error: error.response?.data || error.message || 'Login failed' };
  }
};

  const register = async (userData) => {
    try {
      await apiClient.post('/Auth/Register', userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isDriver: user?.role === 'Driver',
    isCustomer: user?.role === 'Customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
