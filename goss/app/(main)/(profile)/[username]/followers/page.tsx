'use client';

import { useParams } from 'next/navigation';
import ProfileCard from '@/app/ui/ProfileCard';
import { useQuery } from '@tanstack/react-query';
import { fetchFollowersUsername } from '@/app/api/follow';

interface Follower {
  user_id: string; // Ensure user_id is defined in the interface
  statusprofiles: {
    username: string;
    display_name: string;
    profile_img: string;
  };
}

export default function FollowPage() {
  const params = useParams();
  const username = params?.username as string;

  const {
    data: followers = [],
    isLoading,
    isError,
    error,
  } = useQuery<Follower[]>({
    queryKey: ['followers', username],
    queryFn: () => fetchFollowersUsername(username),
    enabled: !!username,
  });

  if (isLoading) {
    return <div className="space-y-4">Loading followers...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <h1>{username}</h1>
        <p className="text-red-800">
          Error loading followers: {(error as Error).message}
        </p>
      </div>
    );
  }

  if (!followers || followers.length === 0) {
    return (
      <div className="py-8 text-center">
        <h1>{username}</h1>
        <p className="text-gray-500">No followers found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {followers.map((follower) =>
        follower ? (
          <ProfileCard
            key={follower.user_id} // Ensure follower.user_id is valid
            user={{
              user_id: follower.user_id, // Pass user_id from the follower object
              username: follower.username,
              display_name: follower.display_name,
              profile_img: follower.profile_img,
            }}
          />
        ) : null
      )}
    </div>
  );
}
