'use client';
import { useState } from 'react';
import { HiOutlineMicrophone, HiOutlineTrash } from "react-icons/hi2";
import { createPost } from '../login/actions';
import { useSessionContext } from '../context/SessionContext';


export default function CreatePost () {
  const { data: session, isLoading, error} = useSessionContext();
  const user = session?.profile;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!session) return <div>Not logged in</div>;

  const [caption, setCaption] = useState('');
  
  return (
    <>
    <form >
      <div className='flex flex-col bg-gray-200 rounded-md px-2 pt-2 pb-4'>
        <div className='flex items-center h-8 w-full'>
          <img src={user.profile_img} alt="Profile picture" className="w-8 h-8 rounded-full shadow-md bg-black mr-3"  />
          <input 
            type="text"
            name='caption'
            value={caption}
            placeholder='Write a caption'
            className='rounded-md w-full px-1'
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <div className='mt-3 w-full flex items-center'>
          <HiOutlineMicrophone size={32} color='#9333ea'/>
          <audio className='mx-1' controls src=""></audio>
          <HiOutlineTrash size={32} color='#9333ea'/>
        </div>
      </div>
      <div className='flex justify-center mt-2'>
        <button type='submit' formAction={createPost} className='bg-purple-500 rounded-xl px-4 py-1 text-white'>Post</button>
      </div>
    </form>
    </>
  )
}