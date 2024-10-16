import { createClient } from '@/utils/supabase/client';
const supabase = createClient();

export const createFavourite = async (userId: string, postId: string) => {
  const { data: existingFavourite, error } = await supabase
    .from('favourites')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .limit(1)

    if (error) {
      console.error('Error checking favourite:', error);
      throw error;
    }

    if (!existingFavourite || existingFavourite.length > 0) {
      return; 
    }

  const { error: insertError } = await supabase
  .from('favourites')
  .insert([{user_id: userId, post_id: postId}]);
  if (insertError) throw error;
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

export const deleteFavourite = async (userId: string, postId: string) => {
  const { data, error } = await supabase
    .from('favourites')          
    .delete()                     
    .eq('user_id', userId)       
    .eq('post_id', postId);       

  if (error) {
    console.error('Error deleting favourite:', error);
    throw new Error('Delete error');
  }
  return data; 
};