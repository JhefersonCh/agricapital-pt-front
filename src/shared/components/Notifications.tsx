import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { BellIcon } from 'lucide-react';
import type { NotificationsUser } from '@/shared/interfaces/notification.interface';
import React from 'react';

interface NotificationsProps {
  notifications: NotificationsUser[];
  count: number;
}

export const Notifications = ({ notifications, count }: NotificationsProps) => {
  return (
    <Menu as="div" className="relative ml-3">
      <MenuButton
        aria-label="Notifications"
        className="relative flex rounded-full bg-gray-800 p-2 text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <BellIcon className="size-6" aria-hidden="true" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
            {count}
          </span>
        )}
      </MenuButton>

      <MenuItems className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none overflow-auto max-h-[200px]">
        <div className="px-4 py-3 border-b text-sm font-semibold text-gray-700">
          Notificaciones
        </div>

        {notifications?.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500">
            Sin notificaciones
          </div>
        ) : (
          notifications?.map((notification) => (
            <MenuItem key={notification.id || notification.notification_id}>
              {({ active }) => (
                <div
                  className={`cursor-pointer px-4 py-2 text-sm ${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  }`}
                >
                  <div className="font-medium">
                    {notification.title || notification.notification?.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {notification.message || notification.notification?.message}
                  </div>
                  {notification.created_at && (
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </MenuItem>
          ))
        )}
      </MenuItems>
    </Menu>
  );
};
