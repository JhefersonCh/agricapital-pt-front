/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/api';

export class RequestService {
  constructor() {}
  async createRequest(data: any) {
    const res = await api.post('/requests', data);
    return res.data;
  }

  async getRequests() {
    const res = await api.get('/requests');
    return res.data;
  }

  async getRequestByClientId(clientId: string) {
    const res = await api.get(`/requests/client/${clientId}`);
    return res.data;
  }

  async getRelatedData() {
    const res = await api.get(`/requests/related-data`);
    return res.data;
  }

  async getRequestById(id: string) {
    const res = await api.get(`/requests/${id}`);
    return res.data;
  }

  async getPaginatedList(
    page: number,
    limit: number,
    sort_order: 'asc' | 'desc',
    order_by: string,
  ) {
    const res = await api.get(`/requests/paginated-list`, {
      params: {
        page,
        per_page: limit,
        sort_order,
        order_by,
      },
    });
    return res.data;
  }

  async approveRequest(id: string, data: any) {
    const res = await api.patch(`/requests/${id}/approve`, data);
    return res.data;
  }

  async rejectRequest(id: string, data: any) {
    const res = await api.patch(`/requests/${id}/reject`, data);
    return res.data;
  }

  async changeRequestStatus(id: string, status_id: string) {
    const res = await api.patch(`/requests/${id}/change-status`, { status_id });
    return res.data;
  }
}
