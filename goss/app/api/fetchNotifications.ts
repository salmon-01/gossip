// import { createClient } from '@/utils/supabase/client';

// export const fetchNotifications = async (userId: string) => {
//   const supabase = createClient();
//   const { data, error } = await supabase
//     .from('notifications')
//     .select('*')
//     .eq('user_id', userId);

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data;
// };

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
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
