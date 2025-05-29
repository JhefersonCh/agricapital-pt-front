import React, { useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useRole } from '../contexts/RoleContext';
import { useAuth } from '../contexts/AuthContext';

export const RoleGuard = ({ children }: { children: React.ReactNode }) => {
  const { role, loadingRole } = useRole();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.warn(
          'RoleGuard: Usuario no autenticado. Redirigiendo a login.',
        );
        navigate('/auth/login', {
          replace: true,
          state: { from: location.pathname },
        });
        return;
      }

      if (!role) {
        console.warn(
          'RoleGuard: No se pudo cargar el rol del usuario. Redirigiendo a /unauthorized.',
        );
        navigate('/unauthorized', { replace: true });
        return;
      }

      if (!role.permissions.includes(location.pathname)) {
        console.warn(
          `RoleGuard: El usuario con rol "${role.name}" no tiene permiso para acceder a "${location.pathname}". Redirigiendo a /unauthorized.`,
        );
        navigate('/unauthorized', { replace: true });
      }
    }
  }, [loading, user, role, navigate, location.pathname, loadingRole]);

  if (loading || loadingRole) {
    return null;
  }

  if (!user) {
    return (
      <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
    );
  }

  if (!role) {
    console.warn(
      'RoleGuard: No se pudo cargar el rol del usuario. Redirigiendo a /unauthorized.',
    );
    navigate('/unauthorized', { replace: true });
    return;
  }

  if (!role.permissions.includes(location.pathname)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
