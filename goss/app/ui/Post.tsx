import {
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineBookmark,
  HiBookmark,
  HiTrash,
} from 'react-icons/hi2';
import moment from 'moment';
import VoiceNote from './VoiceNote';
import Reactions from './Reactions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { User, Post, Favourite } from '@/app/types';
import { deletePostById, fetchCommentsByPostId } from '../api/post';
import { createFavourite, deleteFavourite } from '../api/favourites';
import { useSessionContext } from '@/app/context/SessionContext';
import { useState } from 'react';
import DeletePostModal from '@/app/ui/DeletePostModal';

interface PostProps {
  user: User;
  post: Post;
  favourites: Favourite[];
}

export default function PostComponent({ user, post, favourites }: PostProps) {
  const [favouriteSelect, setFavouriteSelect] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const [showTranscription, setShowTranscription] = useState(false);

  const { data: session } = useSessionContext();
  const currentUserId = session?.user.id;

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      if (!currentUserId) return;
      await deletePostById(post.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
    },
  });

  const {
    data: comments = [],
    isLoading,
    isError,
    error,
  } = useQuery<Post[]>({
    queryKey: ['comments', post.id],
    queryFn: () => fetchCommentsByPostId(post.id),
    enabled: !!post,
  });

  if (isLoading) {
    return <div className="space-y-4">Loading comments...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">
          Error loading comments: {(error as Error).message}
        </p>
      </div>
    );
  }

  async function handleCreateFavourite () {
    if (!currentUserId) {
      return;
    }
    try {
      await createFavourite(currentUserId, post.id);
    } catch (error) {
      console.error(error);
    }
  };

  async function handleDeleteFavourite () {
    if (!currentUserId) {
      return;
    }
    try {
      await deleteFavourite(currentUserId, post.id);
    } catch (error) {
      console.error(error);
    }
  };

  async function handleDeletePost () {
    deletePostMutation.mutate();
    setShowModal(false);
  }

  return (
    <>
      <div className="my-1 flex w-full flex-col rounded-md bg-gray-100 p-2 px-6 pt-6">
        <Link href={`/${user.username}`}>
          <div className="flex h-6 w-full items-center">
            <img
              src={user.profile_img}
              alt="Profile picture"
              className="mr-3 h-12 w-12 rounded-full"
            />
            <div className="items-center text-sm font-medium">
              {user.display_name}
            </div>
            <div className="mx-2 text-sm text-gray-500">@{user.username}</div>
            <div className="ml-auto flex items-center space-x-2 text-sm text-gray-500">
              {moment(post.created_at).fromNow()}
            </div>
          </div>
        </Link>
        <Link href={`/post/${post.id}`}>
          <div className="mt-6 flex w-full text-base">{post.caption}</div>
        </Link>
        <div className="flex items-center">
          <VoiceNote audioUrl={post.audio} />
          <button
            className="h-8 w-8 rounded bg-purple-500 text-white hover:bg-purple-400"
            onClick={() => setShowTranscription(!showTranscription)}
          >
            A
          </button>
        </div>
        {showTranscription && post.transcription && (
          <div className="mt-4 text-sm text-gray-700">{post.transcription}</div>
        )}
        <div className="mb-2 w-full">
          <Reactions postId={post.id} postAuthorId={post.user_id} />
        </div>
        <div className="w-full">
          <div className="relative flex items-center">
            <div className="-mx-6 w-full flex-grow border-t border-gray-200"></div>
          </div>
          <div className="flex items-center pt-2">
            <HiOutlineChatBubbleLeftEllipsis color="#9333ea" size={16} />
            <Link href={`/post/${post.id}`}>
              <div className="ml-2 flex items-center text-base font-medium text-purple-600">
                Comment {comments.length > 0 ? `(${comments.length})` : null}
              </div>
            </Link>
            <div className='ml-auto flex'>
            {post.user_id === currentUserId && 
            <button onClick={() => setShowModal(true)} className='mr-4'>
              <HiTrash color="#9333ea" size={18} />
            </button> }
            {favourites.some((favourite) => favourite.post_id === post.id) ? (
              <button onClick={() => {{favouriteSelect ? handleDeleteFavourite() : handleCreateFavourite()}; {setFavouriteSelect(!favouriteSelect)}}}>
                {favouriteSelect ? <HiBookmark color="#9333ea" size={18} /> : <HiOutlineBookmark color="#9333ea" size={18} />}
              </button>
            ) : (
              <button onClick={() => {{favouriteSelect ? handleCreateFavourite() : handleDeleteFavourite()}; setFavouriteSelect(!favouriteSelect)}}>
                {favouriteSelect? <HiOutlineBookmark color="#9333ea" size={18} /> : <HiBookmark color="#9333ea" size={18} />}
              </button>
            )}
            </div>
          </div>
        </div>
      </div>

      <DeletePostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeletePost}
      />
    </>
  );
}
