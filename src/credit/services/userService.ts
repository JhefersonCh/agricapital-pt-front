/* eslint-disable @typescript-eslint/no-unused-vars */
import { supabase } from '@/supabaseClient';

export class UserService {
  static async fetchClientUsers(page: number, limit: number) {
    const from = (page - 1) * limit;

    const { data, error } = await supabase.rpc('get_users_by_role', {
      role_id_param: 2,
      limit_param: limit,
      offset_param: from,
    });

    if (error) throw error;

    const count = data && data.length > 0 ? Number(data[0].total_count) : 0;

    const users = data?.map(({ total_count, ...user }) => user) || [];

    return { data: users, count };
  }

  static async fetchUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }
}
