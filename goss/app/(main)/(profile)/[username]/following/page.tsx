'use client';

import { useParams } from 'next/navigation';
import { fetchFollowing } from '@/app/api/fetchFollowers';
import ProfileCard from '@/app/ui/ProfileCard';
import { useQuery } from '@tanstack/react-query';

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
    queryFn: () => fetchFollowing(username),
    enabled: !!username,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" /> */}
        Loading followers...
      </div>
    );
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
        follower.profiles ? (
          <ProfileCard
            key={follower.user_id}
            user={{
              user_id: follower.user_id,
              username: follower.profiles.username,
              display_name: follower.profiles.display_name,
              profile_img: follower.profiles.profile_img,
            }}
          />
        ) : null
      )}
    </div>
  );
}
