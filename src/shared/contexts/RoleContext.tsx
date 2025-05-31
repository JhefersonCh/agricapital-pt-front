/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext'; // asumiendo que ya tienes este
import { RoleService } from '../services/RoleService';

interface Role {
  id: number;
  name: string;
  permissions: string[];
}

interface RoleContextType {
  role: Role | null;
  setRole: (role: Role | null) => void;
  loadingRole: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;

      const service = new RoleService();
      const role = await service.getRoleByUserId(user.id);
      setRole(role);
      setLoadingRole(false);
    };
    if (!loading) {
      fetchRole();
    }
  }, [user?.id, loading]);

  return (
    <RoleContext.Provider value={{ role, setRole, loadingRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
