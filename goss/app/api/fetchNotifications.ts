// fetchNotifications.ts
import { createClient } from '@/utils/supabase/client';

export const fetchNotifications = async (userId: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
