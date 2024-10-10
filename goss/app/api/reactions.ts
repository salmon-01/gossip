import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const addReaction = async (
  postId: string,
  userId: string,
  reaction: string
) => {
  const { error } = await supabase.from('reactions').insert({
    post_id: postId,
    user_id: userId,
    reaction,
  });

  if (error) {
    throw error;
  }
};

export const removeReaction = async (
  postId: string,
  userId: string,
  reaction: string
) => {
  const { error } = await supabase.from('reactions').delete().match({
    post_id: postId,
    user_id: userId,
    reaction,
  });
  if (error) throw error;
};

export const fetchReactions = async (postId: string) => {
  const { data, error } = await supabase
    .from('reactions')
    .select('reaction, user_id')
    .eq('post_id', postId);

  if (error) {
    throw error;
  }
  return data;
};
