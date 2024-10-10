'use client';

import { createClient } from '@/utils/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import moment from 'moment';
import Reactions from '@/app/ui/Reactions';
import AddComment from '@/app/ui/AddComment';
import CommentSection from '@/app/ui/CommentSection';
import VoiceNote from '@/app/ui/VoiceNote';
import toast from 'react-hot-toast';
import {
  fetchPostById,
  fetchCommentsByPostId,
  addComment,
  fetchPostOwner,
  createNotification,
  deleteCommentById,
} from '@/app/api/posts';

const supabase = createClient();

interface NewComment {
  post_id: string;
  content: string;
}

export default function PostPage() {
  const params = useParams();
  const postId = params.id;
  const queryClient = useQueryClient();

  const {
    data: postData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId as string),
  });

  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchCommentsByPostId(postId as string),
  });

  const addCommentMutation = useMutation({
    mutationFn: async (newComment: { post_id: string; content: string }) => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw userError;

      const userId = userData.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const commentData = await addComment(newComment, userId);

      const postData = await fetchPostOwner(newComment.post_id);

      if (postData.user_id !== userId) {
        await createNotification(postData.user_id, userId, newComment.content);
      }

      return commentData;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment added');
    },

    onError: (error) => {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await deleteCommentById(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.error('Comment deleted');
    },
  });

  if (isLoading) return <p>Loading post...</p>;
  if (error) return <p>Error loading post: {error.message}</p>;

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto w-full max-w-md p-4">
        <div className="mb-4">
          <button onClick={() => window.history.back()} className="text-xl">
            Back
          </button>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={postData.profiles.profile_img}
              alt={`${postData.profiles.display_name}'s profile`}
              className="h-16 w-16 rounded-full"
            />
            <div className="ml-3 flex flex-col">
              <p className="font-semibold">{postData.profiles.display_name}</p>
              <p className="text-gray-500">@{postData.profiles.username}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {moment(postData.created_at).fromNow()}
          </div>
        </div>
        <VoiceNote audioUrl={postData.audio} />
        <div className="mt-4">
          <Reactions postId={postId} />
        </div>
        <p className="mb-2 mt-6 font-semibold">Goss about it</p>
        <AddComment
          onAddComment={(content: string) =>
            addCommentMutation.mutate({ post_id: postId as string, content })
          }
        />
        <CommentSection
          comments={comments || []}
          onDeleteComment={(commentId: string) =>
            deleteCommentMutation.mutate(commentId)
          }
        />
      </div>
    </div>
  );
}
