import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

// Fetch a single post by its ID
export const fetchPostById = async (postId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      profiles!user_id(*),
      comments (
        *,
        profiles!user_id(*)
      ),
      reactions (
        reaction,
        user_id,
        profiles!user_id(*)
      )
    `
    )
    .eq('id', postId)
    .single(); // Since you're fetching a single post by ID

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Add a new comment to a post
export const addComment = async (
  newComment: { post_id: string; content: string },
  userId: string
) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ ...newComment, user_id: userId }])
    .select('*, profiles!user_id(*)')
    .single();

  if (error) throw error;
  return data;
};

// Fetch the post owner by post ID
export const fetchPostOwner = async (postId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single();

  if (error) throw error;
  return data;
};

// Create a new notification
export const createNotification = async (
  postOwnerId: string,
  commenterId: string,
  content: string
) => {
  const { error } = await supabase.from('notifications').insert([
    {
      user_id: postOwnerId,
      sender_id: commenterId,
      type: 'new_comment',
      context: content,
    },
  ]);

  if (error) throw error;
};

// Delete a comment by its ID
export const deleteCommentById = async (commentId: string) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
};

export const deletePostById = async (postId: string) => {
  const { error } = await supabase.from('posts').delete().eq('id', postId);

  if (error) throw error;
  return true;
};
