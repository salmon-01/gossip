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
  addComment,
  fetchPostOwner,
  createNotification,
  deleteCommentById,
} from '@/app/api/post';
import LoadingSpinner from '@/app/ui/LoadingSpinner';
import { useCallback, useState } from 'react';

const supabase = createClient();

export default function PostPage() {
  const params = useParams();
  const postId = params.id;
  const queryClient = useQueryClient();
  const [showTranscription, setShowTranscription] = useState(false);

  const {
    data: postData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId as string),
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

  const handleAddComment = useCallback(
    (content: string) => {
      addCommentMutation.mutate({ post_id: postId as string, content });
    },
    [postId, addCommentMutation]
  );

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await deleteCommentById(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.error('Comment deleted');
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Error loading post: {error.message}</p>;

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto w-full max-w-7xl p-4 lg:p-10">
        <div className="mb-4">
          <button
            onClick={() => window.history.back()}
            className="text-xl text-gray-700 dark:text-white"
          >
            Back
          </button>
        </div>
        <div className="rounded-md bg-gray-100 px-6 py-3 dark:bg-darkModeSecondaryBackground">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={postData.profiles.profile_img}
                alt={`${postData.profiles.display_name}'s profile`}
                className="h-16 w-16 rounded-full"
              />
              <div className="ml-3 flex flex-col">
                <p className="font-semibold text-gray-700 dark:text-white">
                  {postData.profiles.display_name}
                </p>
                <p className="text-gray-400">@{postData.profiles.username}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {moment(postData.created_at).fromNow()}
            </div>
          </div>
          <div className="text-gray-700 dark:text-gray-200">
            {postData.caption}
          </div>
          <div className="flex items-center">
            <VoiceNote audioUrl={postData.audio} />
            <button
              className="bg-darkModeSecondaryBtn dark:bg-darkModeSecondaryBtn h-8 w-8 rounded text-white dark:text-white"
              onClick={() => setShowTranscription(!showTranscription)}
            >
              A
            </button>
          </div>
          {showTranscription && postData.transcription && (
            <div className="mt-4 text-sm text-gray-600 dark:text-white">
              {postData.transcription}
            </div>
          )}
          <div className="mt-4">
            <Reactions
              postAuthorId={postData.profiles.user_id}
              post={postData}
            />
          </div>
        </div>
        <p className="mb-2 mt-6 font-semibold text-black dark:text-white">
          Goss about it
        </p>
        <AddComment onAddComment={handleAddComment} postId={postId} />
        <CommentSection
          comments={postData.comments || []}
          onDeleteComment={(commentId: string) =>
            deleteCommentMutation.mutate(commentId)
          }
        />
      </div>
    </div>
  );
}
