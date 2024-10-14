'use client';

import NotificationCard from '@/app/ui/NotificationCard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markNotificationsRead } from '@/app/api/notifications';
import { useSessionContext } from '@/app/context/SessionContext';
import { useEffect } from 'react';
import { useGlobalNotifications } from '@/app/context/NotificationsContext';
import LoadingSpinner from '@/app/ui/LoadingSpinner';

export default function Notifications() {
  const { data: session } = useSessionContext();
  const user = session?.profile;

  const queryClient = useQueryClient();

  const { notifications = null, isLoading, error } = useGlobalNotifications();

  const mutation = useMutation({
    mutationFn: () => markNotificationsRead(user.user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
    onError: (error) => {
      console.error('Failed to mark notifications as read:', error);
    },
  });

  const unreadNotifications = notifications?.filter((n) => !n.is_read) || [];

  useEffect(() => {
    if (user && unreadNotifications.length > 0) {
      mutation.mutate(); // Automatically mark unread notifications as read
    }
  }, [notifications]);

  // Handle the loading state
  if (isLoading || notifications === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle the error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-red-500">
          Error loading notifications: {error.message}
        </p>
      </div>
    );
  }

  // If no notifications are found after loading is complete
  if (!isLoading && notifications.length === 0) {
    return (
      <div className="min-h-screen p-4">
        <h1 className="mb-6 text-center text-2xl font-bold dark:text-slate-200">
          Notifications
        </h1>
        <p className="text-center text-gray-500">
          You have no new notifications
        </p>
      </div>
    );
  }

  // If notifications are present, display them
  return (
    <div className="min-h-screen p-4">
      <h1 className="mb-6 text-center text-2xl font-bold dark:text-slate-200">
        Notifications
      </h1>

      <div className="flex flex-col items-center">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            className="transform transition-transform hover:scale-105 hover:shadow-lg"
          />
        ))}
      </div>
    </div>
  );
}
