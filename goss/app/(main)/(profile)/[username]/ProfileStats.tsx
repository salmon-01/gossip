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
  const { data: profileData } = useQuery({
    queryKey: ['profile', user.user_id],
    initialData: user,
  });

  return (
    <div className="mx-auto my-3 mt-4 w-11/12">
      <Link href={`/${user.username}/followers`} className="hover:underline dark:text-darkModeParaText">
        <span>{profileData.following_total}</span>
        <span className="mr-3 text-gray-600 dark:text-darkModeParaText"> Followers</span>
      </Link>
      <Link href={`/${user.username}/following`} className="hover:underline dark:text-darkModeParaText">
        <span>{profileData.follower_count}</span>
        <span className="mr-3 text-gray-600 dark:text-darkModeParaText"> Followers</span>
      </Link>
    </div>
  );
}
