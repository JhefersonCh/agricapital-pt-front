import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '../contexts/RoleContext';
import { useAuth } from '../contexts/AuthContext';

export const RoleGuard = ({ children }: { children: React.ReactNode }) => {
  const { role, loadingRole } = useRole();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !loadingRole) {
      if (!user) {
        navigate('/auth/login', {
          replace: true,
          state: { from: location.pathname },
        });
        return;
      }

      if (!role) {
        navigate('/unauthorized', { replace: true });
        return;
      }

      if (!role.permissions.some((p) => location.pathname.includes(p))) {
        navigate('/unauthorized', { replace: true });
      }
    }

    if (!loading && !user) {
      navigate('/auth/login', {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [loading, user, role, navigate, location.pathname, loadingRole]);

  if (loading || (user && loadingRole)) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return null;
  }

  if (!role) {
    return null;
  }

  if (!role.permissions.some((p) => location.pathname.includes(p))) {
    return null;
  }

  return <>{children}</>;
};
