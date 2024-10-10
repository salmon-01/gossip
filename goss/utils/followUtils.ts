import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Optimistically update the follower count for a profile
export const updateProfileCount = (
  queryClient: QueryClient,
  profileKey: string[],
  increment: number
) => {
  const profile = queryClient.getQueryData<any>(profileKey);
  if (profile) {
    queryClient.setQueryData(profileKey, {
      ...profile,
      following_total: profile.following_total + increment,
    });
  }
};

// Show success notification for follow/unfollow actions
export const handleSuccessNotification = (
  status: 'active' | 'inactive',
  username: string
) => {
  const message =
    status === 'active'
      ? `You are now following ${username}`
      : `You are no longer following ${username}`;
  toast.success(message);
};
