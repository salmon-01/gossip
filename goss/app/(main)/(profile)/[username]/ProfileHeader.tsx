import React from 'react';
import Link from 'next/link';
import FollowButton from '@/app/ui/FollowButton';
import { useSessionContext } from '@/app/context/SessionContext';

export default function ProfileHeader({ user}) {
  const { data: session } = useSessionContext();
  const loggedInUsername = session?.profile.username;
  const loggedInUserId = session?.profile.user_id 
  return (
    <>
      <div className="mx-auto flex w-11/12 items-center justify-between pt-4">
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
        <p className="my-3 w-24 rounded border border-pink-700 bg-pink-400 py-1 text-center text-sm text-white">
          {user.badge}
        </p>
      </div>

      <div className="mx-auto my-3 w-11/12">
        <p className="mx-auto my-3 text-sm text-gray-500">
          {user.bio} 
        </p>

        {user.username === loggedInUsername ? (
          <div>
            <Link
              href={`/settings/profile`}
              className="rounded-xl border border-gray-400 px-3 py-1 hover:bg-violet-700 hover:text-white"
            >
              Edit profile
            </Link>
          </div>
        ) : (
          <div>
            <FollowButton user={user} targetUserId={loggedInUserId} />
          </div>
        )}
      </div>
    </>
  );
}
