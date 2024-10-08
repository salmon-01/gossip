import { HiOutlineHandThumbUp, HiOutlineHandThumbDown } from 'react-icons/hi2';
import { User, Post } from '@/app/types';
import moment from 'moment';

interface PostProps {
  user: User;
  post: Post;
}

export default function ({ user, post }: PostProps) {
  return (
    <>
      <div className="mt-2 flex w-full flex-col rounded-md bg-gray-200 px-2 pb-4 pt-2">
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
          <div className="ml-auto flex items-center space-x-2">
            <HiOutlineHandThumbUp size={20} />
            <HiOutlineHandThumbDown size={20} />
          </div>
        </div>
        <div className="mt-1 flex w-full items-center justify-around text-xs">
          <div className="italic">{`"${post.caption}"`}</div>
          <div>{moment(post.created_at).format('L, HH:mm')}</div>
        </div>
        <div className="mt-1 flex w-full items-center">
          <audio className="h-9 w-full" controls src=""></audio>
        </div>
      </div>
    </>
  );
}
