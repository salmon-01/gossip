import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFollowStatus, updateFollowStatus } from '../api/updateFollow';
import { useCallback, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import toast from 'react-hot-toast';
import { debounce } from 'lodash'; // Import Lodash debounce

interface FollowButtonProps {
  userId: string;
  targetUserId: string;
}

interface FollowStatus {
  status: 'active' | 'inactive';
}

const FollowButton = ({ userId, targetUserId }: FollowButtonProps) => {
  const queryClient = useQueryClient();

  // Fetch initial follow status
  const { data: followStatus, isLoading: isFetchingStatus } = useQuery({
    queryKey: ['followStatus', userId, targetUserId],
    queryFn: () => fetchFollowStatus(userId, targetUserId),
  });

  const followMutation = useMutation({
    mutationFn: () => updateFollowStatus(userId, targetUserId),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['followStatus', userId, targetUserId],
      });

      // Save previous status
      const previousStatus = queryClient.getQueryData<FollowStatus>([
        'followStatus',
        userId,
        targetUserId,
      ]);

      // Optimistically update the status
      const newStatus: FollowStatus = {
        status: previousStatus?.status === 'active' ? 'inactive' : 'active',
      };

      queryClient.setQueryData(
        ['followStatus', userId, targetUserId],
        newStatus
      );

      return { previousStatus };
    },
    onSuccess: (data) => {
      // Display success toast based on the new status
      if (data.status === 'active') {
        toast.success(`You are now following them`);
      } else {
        toast.success(`You are no longer following them`);
      }

      // // Invalidate the cache to refetch the latest data
      // queryClient.invalidateQueries(['followStatus', userId, targetUserId]);
    },
    onError: (err, variables, context) => {
      // Revert optimistic update on error
      queryClient.setQueryData(
        ['followStatus', userId, targetUserId],
        context?.previousStatus
      );
    },
    onSettled: () => {
      // Refetch to ensure server-client consistency
      queryClient.invalidateQueries({
        queryKey: ['followStatus', userId, targetUserId],
      });
    },
  });

  const isFollowing = followStatus?.status === 'active';

  const isLoading = followMutation.isPending || isFetchingStatus;

  // Prevent button clicks more than once a second
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
      style={{
        padding: '8px 16px',
        minWidth: '100px',
        backgroundColor: isFollowing ? '#ffffff' : '#0070f3',
        color: isFollowing ? '#000000' : '#ffffff',
        border: isFollowing ? '1px solid #000000' : 'none',
        borderRadius: '4px',
      }}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
