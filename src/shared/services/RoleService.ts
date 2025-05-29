/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/supabaseClient';

interface Role {
  id: number;
  name: string;
  permissions: string[];
}

interface SupabaseFetchedRoleData {
  role: {
    id: number;
    name: string;
    role_permissions: Array<{
      permissions: {
        link: string;
      };
    }>;
  };
}

export class RoleService {
  constructor() {}

  async getRoleByUserId(userId: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .select(
        `
            role:roles (
            id,
            name,
            role_permissions (
                permissions (
                    link
                )
            )
            )
        `,
      )
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error al obtener el rol con permisos:', error);
      return null;
    }
    const typedData = data as unknown as SupabaseFetchedRoleData;
    const role: Role = {
      id: Number(typedData?.role?.id),
      name: typedData?.role?.name,
      permissions:
        typedData?.role?.role_permissions?.map(
          (rp: any) => rp.permissions.link,
        ) || [],
    };

    console.log(role);

    return role;
  }
}
