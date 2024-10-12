import { useState } from 'react';
import { useSessionContext } from '../context/SessionContext';
import Link from 'next/link';
import { User } from '../types';

const ProfileCard = ({ user }) => {
  // dummy for visual concept, can add following logic later
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow">
      <div className="flex items-center">
        <img
          src={user.profile_img}
          alt={`${user.display_name}'s profile`}
          className="h-16 w-16 rounded-full"
        />
        <Link href={`/${user.username}`}>
          <div className="ml-3 flex flex-col">
            <p className="font-semibold">{user.display_name}</p>

            <p className="text-gray-500">@{user.username}</p>
          </div>
        </Link>
      </div>
      <div className="rounded-full bg-blue-500 px-3 py-1 text-white">
        <button onClick={handleFollowToggle}>
          {isFollowing ? 'Followed' : 'Follow'}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
