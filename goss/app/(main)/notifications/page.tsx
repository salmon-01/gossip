'use client';

import NotificationCard from '@/app/ui/NotificationCard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotifications,
  markNotificationsRead,
} from '@/app/api/fetchNotifications';
import { useSessionContext } from '@/app/context/SessionContext';
import { useEffect } from 'react';

export default function Notifications() {
  const { data: session } = useSessionContext();
  const user = session?.profile;

  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchNotifications(user.user_id),
    staleTime: 0, // Ensure cache is not used, and fresh data is fetched
    refetchOnWindowFocus: true, // Fetch fresh data whenever the window is refocused
  });

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

  const unreadNotifications = notifications.filter((n) => !n.is_read);

  useEffect(() => {
    if (user && unreadNotifications.length > 0) {
      mutation.mutate(); // Automatically mark unread notifications as read
    }
    console.log('notifications read!'); // This was to check for looping
  }, [notifications]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">Loading notifications...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-red-500">
          Error loading notifications: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="mb-6 text-center text-2xl font-bold dark:text-slate-200">
        Notifications
      </h1>

      {/* <button
        onClick={handleMarkAllAsRead}
        className="mb-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        Mark all as read
      </button> */}

      {/* Container for notifications, centered in the screen */}
      <div className="flex flex-col items-center">
        {notifications.length === 0 && (
          <p className="text-center text-gray-500">
            You have no new notifications
          </p>
        )}
        {notifications.length > 0 &&
          notifications.map((notification) => (
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
