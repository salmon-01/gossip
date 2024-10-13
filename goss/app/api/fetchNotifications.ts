import { createClient } from '@/utils/supabase/client';

export const fetchNotifications = async (userId: number) => {
  const supabase = createClient();

  // Fetch all notifications
  const { data: notifications, error } = await supabase
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

  return notifications; // Return just the notifications array
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
