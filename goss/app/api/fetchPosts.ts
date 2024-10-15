import { createClient } from '@/utils/supabase/client';

export const fetchPosts = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      profiles(*),
      comments (
        *,
        profiles!user_id(*)
      )
    `
    )
    .order('created_at', { ascending: false }); // Order the posts by creation time, latest first (or change as needed)

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
