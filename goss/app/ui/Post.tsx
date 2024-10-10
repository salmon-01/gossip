import { HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2';
import moment from 'moment';
import VoiceNote from './VoiceNote';
import Reactions from './Reactions';

import Link from 'next/link';
import { User, Post } from '@/app/types';

interface PostProps {
  user: User;
  post: Post;
}

export default function PostComponent({ user, post }: PostProps) {
  return (
    <>
      <div className="my-2 flex w-full flex-col rounded-tl-md rounded-tr-md p-2">
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
            <div className="flex items-center pb-2 pt-1">
              <HiOutlineChatBubbleLeftEllipsis color="#9333ea" size={16} />
              <div className="ml-2 flex items-center text-base font-medium text-purple-600">
                Comment
              </div>
            </div>
          </Link>
        </div>
      <div className="relative flex items-center py-2">
        <div className="flex-grow w-full border-t border-gray-400"></div>
      </div>
      </div>
    </>
  );
}
