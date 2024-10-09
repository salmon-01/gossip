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
      <div className="mt-2 flex w-full flex-col rounded-tl-md rounded-tr-md bg-gray-200 p-2">
        <Link href={`/${user.username}`}>
          <div className="flex h-6 w-full items-center">
            <img
              src={user.profile_img}
              alt="Profile picture"
              className="mr-3 h-6 w-6 rounded-full bg-black shadow-md"
            />
            <div className="items-center font-bold">{user.display_name}</div>
            <div className="mx-2 items-center text-xs text-gray-600">
              @{user.username}
            </div>
            <div className="ml-auto flex items-center space-x-2 text-xs text-gray-700">
              {moment(post.created_at).fromNow()}
            </div>
          </div>
        </Link>
        <Link href={`/${user.username}`}>
          <div className="mt-1 flex w-full text-sm text-gray-700">
            {post.caption}
          </div>
        </Link>
        <VoiceNote audioUrl={post.audio} />
      </div>
      <div className='w-full p-2 bg-gray-200'>
        <Reactions postId={post.id} />
      </div>
      <div className="w-full rounded-bl-md rounded-br-md border-t border-slate-300 bg-gray-200">
        <Link href={`/post/${post.id}`}>
          <div className="ml-4 flex items-center p-1">
            <HiOutlineChatBubbleLeftEllipsis color="#9333ea" size={16} />
            <div className="ml-1 flex items-center text-sm font-bold text-purple-600">
              Comment
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
