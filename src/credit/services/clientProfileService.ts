/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/api';

export class ClientProfileService {
  constructor() {}
  async createClientProfile(data: any) {
    const res = await api.post('/clients', data);
    return res.data;
  }

  async getClientProfile(userId: string) {
    const res = await api.get(`/clients/${userId}`);
    return res.data;
  }
}
