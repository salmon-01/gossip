import { createContext, useContext, ReactNode } from 'react';
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { updateFollowStatus } from '@/app/api/follow';
import toast from 'react-hot-toast';
import { fetchFollowing } from '@/app/api/follow';
import { useSessionContext } from './SessionContext';
import { FollowResponse, FollowContextType } from '../types';

// Define the type for the mutation variables
interface FollowMutationVariables {
  userId: string;
  targetUserId: string;
  targetUserName: string;
}

// Create the FollowContext with a default value of null
export const FollowContext = createContext<FollowContextType | null>(null);

// Provide the FollowContext to the app
export const FollowProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { data: session, isLoading } = useSessionContext(); // Assuming useSessionContext returns session and isLoading

  // Check if session and user_id are available
  const userId = session?.user?.id; // Adjust this based on the actual session structure
  const username = session?.profile?.username; // Get the username from session

  if (!userId && !isLoading) {
    console.error('User ID is not available');
  }

  // Mutation for following/unfollowing a user
  const mutation: UseMutationResult<
    FollowResponse,
    Error,
    FollowMutationVariables
  > = useMutation({
    mutationFn: ({
      userId,
      targetUserId,
      targetUserName,
    }: FollowMutationVariables) =>
      updateFollowStatus(userId, targetUserId, targetUserName),
    onSuccess: (response, variables) => {
      if (response.success) {
        const message =
          response.status === 'active'
            ? `You are now following ${variables.targetUserName}`
            : `You have unfollowed ${variables.targetUserName}`;

        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: ['followStatus', response.userId, response.targetUserId],
        });

        queryClient.invalidateQueries({
          queryKey: ['profile', variables.targetUserName],
        });

        queryClient.invalidateQueries({
          queryKey: ['followers', variables.targetUserName], // Ensure correct key
        });
      }
    },
    onError: () => {
      toast.error('Failed to update follow status');
    },
  });

  // Query to fetch following data, only enabled when userId is available
  const {
    data: followingData,
    isLoading: isFollowingLoading,
    refetch: refetchFollowing,
  } = useQuery({
    queryKey: ['following', username, userId], // Include userId in the query key for uniqueness
    queryFn: () => fetchFollowing(userId as string),
    staleTime: 60000, // Cache data for 60 seconds
    refetchOnWindowFocus: false,
    enabled: !!userId, // Only run the query if userId is available
  });

  // Function to toggle follow status
  const handleFollowToggle = (
    userId: string,
    targetUserId: string,
    targetUserName: string
  ) => {
    mutation.mutate({ userId, targetUserId, targetUserName });
  };

  return (
    <FollowContext.Provider
      value={{
        handleFollowToggle,
        isLoading: mutation.isPending,
        followingData,
        isFollowingLoading,
        refetchFollowing,
      }}
    >
      {children}
    </FollowContext.Provider>
  );
};
