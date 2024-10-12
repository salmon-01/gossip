import { createClient } from '@/utils/supabase/client';
const supabase = createClient();

export const createFavourite = async (userId: string, postId: string) => {
  const { data: existingFavourite } = await supabase
    .from('favourites')
    .select('id')  // You can select any column, 'id' is enough to check existence
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single();

    if (existingFavourite) {
      return; 
    }

  const { error } = await supabase
  .from('favourites')
  .insert([{user_id: userId, post_id: postId,},]);
  if (error) throw error;
};

export const fetchFavourites = async (userId: string) => {
  const { data, error } = await supabase
    .from('favourites')
    .select(`
      *, 
      profiles!user_id(*),
      posts: post_id(*, profiles!user_id(*))`)
      .eq('user_id', userId);
  if (error) throw error;
  return data;
};