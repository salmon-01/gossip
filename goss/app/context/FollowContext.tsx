import { createContext, useContext, ReactNode } from 'react';
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import { updateFollowStatus } from '@/app/api/follow';
import toast from 'react-hot-toast';

// Define the type for the follow response
interface FollowResponse {
  success: boolean;
  status: 'active' | 'inactive';
  userId: string;
  targetUserId: string;
}

// Define the type for the mutation variables
interface FollowMutationVariables {
  userId: string;
  targetUserId: string;
  targetUserName: string;
}

// Define the type for the FollowContext
interface FollowContextType {
  handleFollowToggle: (
    userId: string,
    targetUserId: string,
    targetUserName: string
  ) => void;
  isLoading: boolean;
}

// Create the FollowContext with a default value of null
const FollowContext = createContext<FollowContextType | null>(null);

// Provide the FollowContext to the app
export const FollowProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

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
      }
    },
    onError: () => {
      toast.error('Failed to update follow status');
    },
  });

  const handleFollowToggle = (
    userId: string,
    targetUserId: string,
    targetUserName: string
  ) => {
    mutation.mutate({ userId, targetUserId, targetUserName });
  };

  return (
    <FollowContext.Provider
      value={{ handleFollowToggle, isLoading: mutation.isPending }}
    >
      {children}
    </FollowContext.Provider>
  );
};

// Hook to use the FollowContext
export const useFollow = () => {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return context;
};
