export interface NotificationsUser {
  id: string;
  notification_id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  read_at: null;
  title?: string;
  message?: string;
  notification: Notification;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: Date;
  updated_at: Date;
}
