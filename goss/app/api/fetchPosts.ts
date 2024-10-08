import { createClient } from '@/utils/supabase/client';

export const fetchPosts = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(*)')

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
