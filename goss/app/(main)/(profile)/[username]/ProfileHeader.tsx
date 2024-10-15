import React from 'react';
import Link from 'next/link';
import FollowButton from '@/app/ui/FollowButton';
import { useSessionContext } from '@/app/context/SessionContext';
import MessageButton from '@/app/ui/MessageButton';
import { GoMail } from 'react-icons/go';
import { FiEdit } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { fetchFollowStatus } from '@/app/api/follow';

export default function ProfileHeader({ user }) {
  const { data: session } = useSessionContext();
  const loggedInUsername = session?.profile.username;
  const loggedInUserId = session?.profile.user_id;
  const otherUserId = user?.user_id;

  // Fetch the follow status using the modern useQuery format
  const { data: followStatus, isLoading } = useQuery({
    queryKey: ['followStatus', loggedInUserId, otherUserId],
    queryFn: () => fetchFollowStatus(loggedInUserId, otherUserId),
    enabled: !!loggedInUserId && !!otherUserId, // Enable the query only if both IDs are present
  });

  // Check if the user is following the other user
  const isFollowing = followStatus?.status === 'active';

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

        {/* Edit and message buttons for the logged-in user */}
        {user.username === loggedInUsername ? (
          <div>
            <Link
              href={`/settings/profile`}
              className="mr-3 mt-1 p-0 text-2xl hover:text-purple-700"
              prefetch={true}
            >
              <FiEdit className="inline" />
            </Link>
            <Link
              href={`/chats`}
              className="p-0 text-2xl hover:text-purple-700"
              prefetch={true}
            >
              <GoMail className="inline" />
            </Link>
          </div>
        ) : null}
      </div>

      <div className="mx-auto my-3 w-11/12">
        <p className="mx-auto my-3 text-sm text-gray-900">{user.bio}</p>

        {/* Badge display for the logged-in user */}
        {user.username === loggedInUsername ? (
          <p className="text-md my-3 w-24 rounded border border-gray-200 bg-gray-200 py-1 text-center">
            {user.badge}
          </p>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              {/* FollowButton with isFollowing and isLoading passed as props */}
              <FollowButton
                targetUserId={user.user_id}
                targetUserName={user.display_name}
                isFollowing={isFollowing}
                isLoading={isLoading}
              />
              <MessageButton
                otherUserId={otherUserId}
                loggedInUserId={loggedInUserId}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
