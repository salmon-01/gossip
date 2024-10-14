import { createClient } from '@/utils/supabase/client';
import { Notification } from '../types';

const supabase = createClient();

// Fetch notifications for a specific user
export const fetchNotifications = async (
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

  return data as unknown as Notification[];
};

// Get the authenticated user ID from Supabase
export const getUserId = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching user ID:', error.message);
    return null;
  }

  return data?.user?.id || null;
};

export const markNotificationsRead = async (userId: number) => {
  const supabase = createClient();

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};
