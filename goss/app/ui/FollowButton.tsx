import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFollowStatus, updateFollowStatus } from '../api/updateFollow';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';

interface User {
  user_id: string;
  username: string;
}

interface FollowButtonProps {
  user: User;
  targetUserId: string;
}

interface FollowStatus {
  status: 'active' | 'inactive';
}

const FollowButton = ({ user, targetUserId }: FollowButtonProps) => {
  const queryClient = useQueryClient();
  const userId = user.user_id;

  const { data: followStatus, isLoading: isFetchingStatus } = useQuery({
    queryKey: ['followStatus', userId, targetUserId],
    queryFn: () => fetchFollowStatus(userId, targetUserId),
    enabled: !!targetUserId,
  });

  const followMutation = useMutation({
    mutationFn: () => updateFollowStatus(userId, targetUserId),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['followStatus', userId, targetUserId],
      });

      const previousStatus = queryClient.getQueryData<FollowStatus>([
        'followStatus',
        userId,
        targetUserId,
      ]);

      // Optimistically update follow status
      const newStatus: FollowStatus = {
        status: previousStatus?.status === 'active' ? 'inactive' : 'active',
      };
      queryClient.setQueryData(
        ['followStatus', userId, targetUserId],
        newStatus
      );

      // Optimistically update follower counts
      const targetProfile = queryClient.getQueryData<any>([
        'profile',
        targetUserId,
      ]);
      const currentProfile = queryClient.getQueryData<any>(['profile', userId]);

      if (targetProfile) {
        const increment = newStatus.status === 'active' ? 1 : -1;
        queryClient.setQueryData(['profile', targetUserId], {
          ...targetProfile,
          follower_count: Math.max(0, targetProfile.follower_count + increment),
        });
      }

      if (currentProfile) {
        const increment = newStatus.status === 'active' ? 1 : -1;
        queryClient.setQueryData(['profile', userId], {
          ...currentProfile,
          following_total: Math.max(
            0,
            currentProfile.following_total + increment
          ),
        });
      }

      return { previousStatus, targetProfile, currentProfile };
    },
    onSuccess: (response) => {
      if (response.success) {
        const message =
          response.status === 'active'
            ? `You are now following ${user.username}`
            : `You are no longer following ${user.username}`;
        toast.success(message);

        // Invalidate profiles to refetch latest data
        queryClient.invalidateQueries({ queryKey: ['profile', targetUserId] });
        queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      } else {
        toast.error('Failed to update follow status');
      }
    },
    onError: (err, variables, context) => {
      toast.error('An error occurred while updating follow status');
      if (context) {
        // Revert follow status
        queryClient.setQueryData(
          ['followStatus', userId, targetUserId],
          context.previousStatus
        );
        // Revert profile counts
        if (context.targetProfile) {
          queryClient.setQueryData(
            ['profile', targetUserId],
            context.targetProfile
          );
        }
        if (context.currentProfile) {
          queryClient.setQueryData(['profile', userId], context.currentProfile);
        }
      }
    },
  });

  const isFollowing = followStatus?.status === 'active';
  const isLoading = followMutation.isPending || isFetchingStatus;

  const handleClick = useCallback(
    debounce(() => {
      followMutation.mutate();
    }, 1000),
    [followMutation]
  );

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center justify-center rounded-lg border border-white px-5 py-3 drop-shadow-2xl ${
        isFollowing ? 'bg-gray-300 text-black' : 'bg-purple-600 text-white'
      } ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
