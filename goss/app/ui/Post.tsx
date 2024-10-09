import { HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2';
import moment from 'moment';
import VoiceNote from './VoiceNote';

import Link from 'next/link';
import { User, Post } from '@/app/types';

interface PostProps {
  user: User;
  post: Post;
}

export default function PostComponent({ user, post }: PostProps) {

  return (
    <>
      <div className="mt-2 flex w-full flex-col rounded-tr-md rounded-tl-md bg-gray-200 p-2">
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
          <VoiceNote audioUrl={post.audio}/>
      </div>
      <div className='border-slate-300 border-t rounded-bl-md rounded-br-md bg-gray-200 w-full'>
        <Link href={`/post/${post.id}`}>
          <div className='flex items-center pt-1 pb-2 ml-5'>
            <HiOutlineChatBubbleLeftEllipsis color='#9333ea' size={16}/>
            <div className='text-sm text-purple-600 flex items-center ml-1 font-bold'>
              Comment
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
