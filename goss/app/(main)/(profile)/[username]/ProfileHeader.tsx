import React from 'react';
import Link from 'next/link';
import FollowButton from '@/app/ui/FollowButton';
import { useSessionContext } from '@/app/context/SessionContext';
import MessageButton from '@/app/ui/MessageButton';

import { useQuery } from '@tanstack/react-query';
import { fetchFollowStatus } from '@/app/api/follow';
import {
  HiOutlineBookmark,
  HiOutlineEnvelope,
  HiOutlinePencilSquare,
} from 'react-icons/hi2';
import { useProfile } from '@/app/context/ProfileContext';

export default function ProfileHeader() {
  const { data: session } = useSessionContext();
  const loggedInUsername = session?.profile.username;

  const loggedInUserId = session?.profile.user_id;

  const profile = useProfile();
  const user = profile;
  const otherUserId = user?.user_id;

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
            <div className="text-xl font-bold dark:text-darkModeHeader">
              {user.display_name}
            </div>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>

        {/* Edit and message buttons for the logged-in user */}
        {user.username === loggedInUsername ? (
          <div>
            <Link
              href={`/settings/profile`}
              className="hover:text-darkModePrimaryBtn dark:hover:text-darkModePrimaryBtn mx-1 p-0 text-2xl dark:text-darkModeParaText"
              prefetch={true}
            >
              <HiOutlinePencilSquare className="inline" />
            </Link>
            <Link
              href={`/favourites`}
              className="hover:text-darkModePrimaryBtn dark:hover:text-darkModePrimaryBtn mx-1 p-0 text-2xl dark:text-darkModeParaText"
              prefetch={true}
            >
              <HiOutlineBookmark className="inline" />
            </Link>
            <Link
              href={`/chats`}
              className="hover:text-darkModePrimaryBtn dark:hover:text-darkModePrimaryBtn mx-1 p-0 text-2xl dark:text-darkModeParaText"
              prefetch={true}
            >
              <HiOutlineEnvelope className="inline" />
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="mx-auto my-3 w-11/12">
        <p className="mx-auto my-3 text-sm text-gray-900 dark:text-darkModeParaText">
          {user.bio}
        </p>

        {/* Badge display for the logged-in user */}
        {user.username === loggedInUsername ? (
          <p className="text-md my-3 w-36 rounded border border-gray-200 bg-gray-200 py-1 text-center dark:bg-darkModeSecondaryBackground dark:text-darkModeParaText">
            {user.badge}
          </p>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              {/* FollowButton with isFollowing and isLoading passed as props */}
              <FollowButton
                targetUserId={user.user_id}
                targetUserName={user.username}
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
