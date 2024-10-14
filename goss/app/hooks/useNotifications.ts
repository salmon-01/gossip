import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Notification } from '../types';
import { useState } from 'react';

const supabase = createClient();

const fetchNotifications = async (
  userId: string | null
): Promise<Notification[]> => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select(
      `
      id,
      context,
      type,
      created_at,
      is_read,
      user_id,
      sender_id,
      recipient:user_id (
        username,
        profile_img
      ),
      sender:sender_id (
        username,
        profile_img
      )
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return [];
  }

  return data as unknown as Notification[];
};

const useNotifications = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  // Get the authenticated user ID once on mount
  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUserId();
  }, []);

  // Fetch notifications initially
  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => fetchNotifications(userId),
    enabled: !!userId, // Enable query only when userId is available
    refetchOnWindowFocus: true,
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
          console.log(payload.new);
          toast(`New notification received: ${payload.new.context}`, {
            icon: '🔔',
          }); // Show notification
          console.log(payload);
          // Update the cached notifications in TanStack Query
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
  }, [userId, supabase]);

  return {
    notifications,
    isLoading,
    error,
  };
};

export default useNotifications;
