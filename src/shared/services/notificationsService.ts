import api from '@/api';

export class NotificationsService {
  async getNotifications() {
    const response = await api.get('/notifications');
    return response.data;
  }
}
