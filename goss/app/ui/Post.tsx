import {
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineBookmark,
  HiBookmark,
  HiTrash,
} from 'react-icons/hi2';
import moment from 'moment';
import VoiceNote from './VoiceNote';
import Reactions from './Reactions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { User, Post, Favourite } from '@/app/types';
import { deletePostById } from '../api/post';
import { createFavourite, deleteFavourite } from '../api/favourites';
import { useSessionContext } from '@/app/context/SessionContext';
import { useState } from 'react';
import DeletePostModal from '@/app/ui/DeletePostModal';
import toast from 'react-hot-toast';

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
      queryClient.invalidateQueries({ queryKey: ['post', post.id] });
      toast.success('Post deleted');
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
    },
  });

  const comments = post.comments;

  async function handleCreateFavourite() {
    if (!currentUserId) {
      return;
    }
    try {
      await createFavourite(currentUserId, post.id);
      toast.success('Saved to favourites');
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteFavourite() {
    if (!currentUserId) {
      return;
    }
    try {
      await deleteFavourite(currentUserId, post.id);
      toast.success('Removed from favourites');
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeletePost() {
    deletePostMutation.mutate();
    setShowModal(false);
  }

  return (
    <>
      <div className="my-3 flex w-full flex-col rounded-md bg-gray-100 p-2 px-6 pt-6 dark:bg-darkModeSecondaryBackground dark:text-darkModeParaText md:max-w-2xl">
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
            <div className="mx-2 text-sm text-gray-500 dark:text-darkModeDimText">
              @{user.username}
            </div>
            <div className="ml-auto flex items-center space-x-2 text-sm text-gray-500 dark:text-darkModeDimText">
              {moment(post.created_at).fromNow()}
            </div>
          </div>
        </Link>
        <Link href={`/post/${post.id}`}>
          <div className="mt-6 flex w-full">{post.caption}</div>
        </Link>
        <div className="flex items-center">
          <VoiceNote audioUrl={post.audio} />
          <button
            className="bg-darkModePrimaryBtn dark:bg-darkModeSecondaryBtn h-8 w-8 rounded text-white"
            onClick={() => setShowTranscription(!showTranscription)}
          >
            A
          </button>
        </div>
        {showTranscription && post.transcription && (
          <div className="my-2 text-sm text-gray-600 dark:text-slate-200">
            {post.transcription}
          </div>
        )}
        <div className="mb-2 w-full">
          <Reactions postAuthorId={post.user_id} post={post} />
        </div>
        <div className="w-full">
          <div className="relative flex items-center">
            <div className="-mx-6 w-full flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="flex items-center pt-2">
            <Link href={`/post/${post.id}`}>
              <HiOutlineChatBubbleLeftEllipsis
                className={'text-[#464548] dark:text-darkModeHeader'}
                size={16}
              />
            </Link>
            <Link href={`/post/${post.id}`}>
              <div className="ml-2 flex items-center text-base font-medium text-gray-500 dark:text-darkModeHeader">
                Comment
                {post.comments?.length > 0 ? `(${post.comments.length})` : null}
              </div>
            </Link>
            <div className="ml-auto flex">
              {post.user_id === currentUserId && (
                <button onClick={() => setShowModal(true)} className="mr-4">
                  <HiTrash
                    className={'text-[#464548] dark:text-darkModeHeader'}
                    size={18}
                  />
                </button>
              )}
              {favourites.some((favourite) => favourite.post_id === post.id) ? (
                <button
                  onClick={() => {
                    {
                      favouriteSelect
                        ? handleDeleteFavourite()
                        : handleCreateFavourite();
                    }
                    {
                      setFavouriteSelect(!favouriteSelect);
                    }
                  }}
                >
                  {favouriteSelect ? (
                    <HiBookmark
                      className={'text-[#464548] dark:text-darkModeHeader'}
                      size={18}
                    />
                  ) : (
                    <HiOutlineBookmark
                      className={'text-[#464548] dark:text-darkModeHeader'}
                      size={18}
                    />
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    {
                      favouriteSelect
                        ? handleCreateFavourite()
                        : handleDeleteFavourite();
                    }
                    setFavouriteSelect(!favouriteSelect);
                  }}
                >
                  {favouriteSelect ? (
                    <HiOutlineBookmark
                      className={'text-[#464548] dark:text-darkModeHeader'}
                      size={18}
                    />
                  ) : (
                    <HiBookmark
                      className={'text-[#464548] dark:text-darkModeHeader'}
                      size={18}
                    />
                  )}
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
