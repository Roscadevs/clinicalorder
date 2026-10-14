import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface RoleGuardProps {
  allowedRoles: string[];
  fallback?: string;
}

/**
 * Restricts a route tree to specific roles.
 * If the current role is not in allowedRoles the user is redirected to fallback.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  fallback = '/app/agenda',
}) => {
  const role = localStorage.getItem('role') ?? '';

  if (!allowedRoles.includes(role)) {
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};
