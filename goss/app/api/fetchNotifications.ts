import { createClient } from '@/utils/supabase/client';

export const fetchNotifications = async (userId: number) => {
  const supabase = createClient();

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

  return data;
};
