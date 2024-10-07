import { HiOutlineHandThumbUp, HiOutlineHandThumbDown } from "react-icons/hi2";
import { User } from '@/app/types';

interface PostProps {
  user: User;
}

export default function ({user}: PostProps) {

  return (
    <>
    <div className='flex flex-col bg-gray-200 rounded-md px-2 pt-2 pb-4 mt-2'>
        <div className='flex items-center h-6 w-full'>
          <img src={user.profile_img} alt="Profile picture" className="w-6 h-6 rounded-full shadow-md bg-black mr-3"  />
          <div className='font-bold items-center'>
          {user.display_name}
          </div>
          <div className='mx-2 text-gray-600 text-xs items-center'>
          @{user.username}
          </div>
          <div className='ml-auto flex items-center space-x-2'>
            <HiOutlineHandThumbUp size={20}/>
            <HiOutlineHandThumbDown size={20}/>
          </div>
        </div>
        <div className='mt-3 w-full flex items-center'>
          <audio className='w-full h-9' controls src=""></audio>
        </div>
      </div>
    </>
  )
}