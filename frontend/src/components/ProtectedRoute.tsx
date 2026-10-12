import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { RoleType } from './navConfig';
import { toast } from './ui/Toast';

interface ProtectedRouteProps {
  allowedRoles?: RoleType[];
  children?: React.ReactNode;
}

/**
 * Guardián perimetral de rutas para el frontend (React Router).
 * 1. Comprueba si el usuario tiene una sesión activa (token JWT). Si no, lo redirige a /login preservando la ruta previa.
 * 2. Comprueba si el rol del usuario figura en allowedRoles. Si no, lo redirige con notificación amigable.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = (localStorage.getItem('role') as RoleType) || null;

  // 1. Verificación de Autenticación
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Verificación de Autorización por Rol
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      toast.friendlyError('Acceso restringido', {
        description: 'No cuentas con los permisos requeridos para acceder a esta sección.',
        duration: 4000,
      });

      // Redirigir a la vista por defecto permitida según su rol actual
      const fallbackPath = role === 'DOCTORA' ? '/app/clinical' : '/app/agenda';
      return <Navigate to={fallbackPath} replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
