import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface ProfileStatsProps {
  user: {
    user_id: string;
    follower_count: number;
    following_total: number;
  };
}

export default function ProfileStats({ user }: ProfileStatsProps) {
  const { data: profileData } = useQuery({
    queryKey: ['profile', user.user_id],
    initialData: user,
  });

  return (
    <div className="mx-auto my-3 mt-4 w-11/12">
      <span>{profileData.following_total}</span>
      <span className="mr-3 text-gray-600"> Followers</span>
      <span>{profileData.follower_count} </span>
      <span className="text-gray-600">Following</span>
    </div>
  );
}
