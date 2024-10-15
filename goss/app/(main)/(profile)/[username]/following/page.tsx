'use client';

import { useParams } from 'next/navigation';
import { fetchFollowing } from '@/app/api/fetchFollowers';
import ProfileCard from '@/app/ui/ProfileCard';
import { useQuery } from '@tanstack/react-query';
import { fetchFollowingUsername } from '@/app/api/follow';

interface Follower {
  user_name: string;
  // Add other follower properties as needed
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
    queryKey: ['following', username],
    queryFn: () => fetchFollowingUsername(username),
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
        <p className="text-gray-500">{username} is not following anyone.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {followers.map((follower) =>
        follower ? (
          <ProfileCard
            key={follower.target_user_id}
            user={{
              user_id: follower.target_user_id,
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
