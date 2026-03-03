import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireDriver = false, requireCustomer = false }) => {
  const { isAuthenticated, isDriver, isCustomer, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireDriver && !isDriver) {
    return <Navigate to="/send-package" replace />;
  }

  if (requireCustomer && !isCustomer) {
    return <Navigate to="/driver-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
