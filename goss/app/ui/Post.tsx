import { HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2';
import moment from 'moment';
import VoiceNote from './VoiceNote';
import Reactions from './Reactions';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { User, Post } from '@/app/types';
import { fetchCommentsByPostId } from '../api/post';

interface PostProps {
  user: User;
  post: Post;
}

export default function PostComponent({ user, post }: PostProps) {
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
        <VoiceNote audioUrl={post.audio} />
        <div className="mb-2 w-full">
          <Reactions postId={post.id} postAuthorId={post.user_id} />
        </div>
        <div className="w-full">
          <Link href={`/post/${post.id}`}>
            <div className="relative flex items-center">
              <div className="-mx-6 w-full flex-grow border-t border-gray-200"></div>
            </div>
            <div className="flex items-center pt-2">
              <HiOutlineChatBubbleLeftEllipsis color="#9333ea" size={16} />
              <div className="ml-2 flex items-center text-base font-medium text-purple-600">
                Comment {comments.length > 0 ? `(${comments.length})` : null}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
