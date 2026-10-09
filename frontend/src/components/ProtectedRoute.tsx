import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Protects all routes that require an authenticated session.
 * If no token is found in localStorage the user is redirected to /login.
 */
export const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('token');

  if (!token || token.trim() === '') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
