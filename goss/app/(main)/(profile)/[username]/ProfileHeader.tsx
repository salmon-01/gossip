import React from 'react';
import Link from 'next/link';

export default function ProfileHeader({ user, loggedInUser }) {
  // console.log("Logged-in user:", loggedInUser);
  //console.log("Viewing user:", user.user_id);
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
            <div className="font-bold">{user.display_name}</div>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>

        {/* Follow button */}
        {user.user_id === loggedInUser ? (
          <div>
            <Link href={`/${user.username}/edit`}
            className="rounded-xl border border-gray-400 px-3 py-1 hover:bg-violet-700 hover:text-white"
            >
              Edit profile
            </Link>
          </div>
        ) : (
          <div>
            <button className="rounded-xl border border-gray-400 px-3 py-1 hover:bg-violet-700 hover:text-white">
              Follow
            </button>
          </div>
        )}
      </div>

      <p className="mx-auto my-3 w-11/12">{user.bio}</p>
    </>
  );
}
