'use client';

import { createClient } from '@/utils/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import moment from 'moment';
import Reactions from '@/app/ui/Reactions';
import AddComment from '@/app/ui/AddComment';
import CommentSection from '@/app/ui/CommentSection';

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
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles!user_id(*)')
        .eq('id', postId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*, profiles!user_id(*)')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (newComment: NewComment) => {
      const { data, error } = await supabase
        .from('comments')
        .insert([newComment])
        .select('*, profiles!user_id(*)');

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', postId],
      });
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
        <div className="mb-4">
          <audio src={postData.audio} controls className="w-full"></audio>
        </div>
        <Reactions />
        <p className="mb-2 mt-6 font-semibold">Goss about it</p>
        <AddComment
          onAddComment={(content: string) =>
            addCommentMutation.mutate({ post_id: postId as string, content })
          }
        />
        <CommentSection comments={comments || []} />
      </div>
    </div>
  );
}
