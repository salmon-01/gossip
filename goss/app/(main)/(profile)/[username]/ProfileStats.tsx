import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useProfile } from '@/app/context/ProfileContext';

interface ProfileStatsProps {
  user: {
    user_id: string;
    follower_count: number;
    following_total: number;
  };
}

export default function ProfileStats() {
  const profile = useProfile();

  const user = profile;

  return (
    <div className="mx-auto my-3 mt-4 w-11/12">
      <Link
        href={`/${user.username}/followers`}
        className="dark:text-darkModeParaText hover:underline"
      >
        <span>{profile.follower_count}</span>
        <span className="dark:text-darkModeParaText mr-3 text-gray-600">
          {' '}
          Followers
        </span>
      </Link>
      <Link
        href={`/${user.username}/following`}
        className="dark:text-darkModeParaText hover:underline"
      >
        <span>{profile.following_total}</span>
        <span className="dark:text-darkModeParaText mr-3 text-gray-600">
          {' '}
          Following
        </span>
      </Link>
    </div>
  );
}
