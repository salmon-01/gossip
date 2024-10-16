import { debounce } from 'lodash';
import { useCallback, useState, useEffect } from 'react';
import { useFollow } from '../hooks/useFollow';
import { useSessionContext } from '../context/SessionContext';

interface FollowButtonProps {
  targetUserId: string;
  targetUserName: string;
  isLoading: boolean;
}

const FollowButton = ({ targetUserId, targetUserName }: FollowButtonProps) => {
  const { handleFollowToggle, followingData } = useFollow(); // Access following data and toggle function from context
  const { data: session } = useSessionContext(); // Access the session to get the current user
  const currentUserId = session?.profile.user_id;

  // Determine if the current user is following the target user
  const isInitiallyFollowing = followingData?.some((follow) => {
    return follow.target_user_id === targetUserId; // Add return statement
  });

  // Local state to manage the following status optimistically
  const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);

  // Sync local state with context changes (in case follow status changes globally)
  useEffect(() => {
    setIsFollowing(isInitiallyFollowing);
  }, [isInitiallyFollowing]);

  // Debounced function to avoid rapid clicks
  const debouncedHandleClick = useCallback(
    debounce(() => {
      // Optimistically toggle the follow status
      setIsFollowing((prev) => !prev);
      handleFollowToggle(currentUserId, targetUserId, targetUserName); // Use the context function
    }, 1000),
    [handleFollowToggle, currentUserId, targetUserId, targetUserName] // Add necessary dependencies
  );

  return (
    <button
      onClick={debouncedHandleClick}
      className={`flex w-32 items-center justify-center rounded-lg border px-5 py-3 drop-shadow-xl ${
        isFollowing
          ? 'bg-gray-300 text-black'
          : 'dark:bg-darkModePrimaryBtn bg-darkModeSecondaryBtn text-white dark:text-darkModeParaText'
      } cursor-pointer`}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
