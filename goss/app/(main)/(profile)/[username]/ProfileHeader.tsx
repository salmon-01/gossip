import React from 'react';
import Link from 'next/link';
import FollowButton from '@/app/ui/FollowButton';
import { useSessionContext } from '@/app/context/SessionContext';
import MessageButton from '@/app/ui/MessageButton';
import { GoMail } from "react-icons/go";
import { FiEdit } from "react-icons/fi";


export default function ProfileHeader({ user }) {
  const { data: session } = useSessionContext();
  const loggedInUsername = session?.profile.username;
  const loggedInUserId = session?.profile.user_id
  const otherUserId = user?.user_id



  return (
    <>
      <div className="mx-auto flex w-11/12 items-center  justify-between pt-4">
        <div className="flex items-center">

          <img
            src={user.profile_img}
            className="h-16 w-16 rounded-full bg-black"
            alt="Profile"
          />

          <div className="ml-4">
            <div className="text-xl font-bold">{user.display_name}</div>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>

        {/* Follow button */}
        {user.username === loggedInUsername ? (
          <div className='mr-10'>
          <Link
            href={`/settings/profile`}
            className="p-0 text-2xl hover:text-purple-700  mt-1 mr-3"
            prefetch={true}
          >
            <FiEdit className='inline' />
          </Link>
          <Link
            href={`/chats`}
            className="p-0 text-2xl hover:text-purple-700 "
            prefetch={true}
          >
            <GoMail className='inline' />
          </Link>
        </div>) : (<></>)}
      </div>

      <div className="mx-auto my-3 w-11/12">
        <p className="mx-auto my-3 text-sm text-gray-900">
          {user.bio}
        </p>

        {user.username === loggedInUsername ? (
          <p className="my-3 w-24 rounded border border-gray-200 bg-gray-200 py-1 text-center text-md ">
            {user.badge}
          </p>

        ) : (
          <>
            <div className="flex items-center space-x-2"> {/* Use Flexbox to align items and add spacing */}
              <FollowButton user={user} targetUserId={loggedInUserId} />
              <MessageButton otherUserId={otherUserId} loggedInUserId={loggedInUserId} />
            </div>
          </>


        )}
      </div>
    </>
  );
}
