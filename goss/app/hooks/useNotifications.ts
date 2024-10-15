import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Notification } from '../types';
import { fetchNotifications, getUserId } from '../api/notifications';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const useNotifications = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  // Get the authenticated user ID once on mount
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  // Fetch notifications
  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => fetchNotifications(userId),
    enabled: !!userId, // Enable query only when userId is available
    refetchOnWindowFocus: true, // Refetch the data when window is refocused
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
  });

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('realtime-notification-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          toast(`New notification received!`, {
            icon: '🔔',
          });

          // Update cached notifications in TanStack Query
          queryClient.setQueryData<Notification[]>(
            ['notifications', userId],
            (oldData) => {
              if (!oldData) return [payload.new as Notification];
              return [payload.new as Notification, ...oldData];
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return {
    notifications,
    isLoading,
    error,
  };
};

export default useNotifications;
