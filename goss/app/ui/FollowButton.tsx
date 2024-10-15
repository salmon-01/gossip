import { debounce } from 'lodash';
import { useCallback, useState, useEffect } from 'react';
import { useFollow } from '../context/FollowContext';
import { useSessionContext } from '../context/SessionContext';

interface FollowButtonProps {
  targetUserId: string;
  targetUserName: string;
  isFollowing: boolean;
  isLoading: boolean;
}

const FollowButton = ({
  isFollowing: initialIsFollowing, // Renamed for clarity
  isLoading,
  targetUserId,
  targetUserName,
}: FollowButtonProps) => {
  const { handleFollowToggle } = useFollow(); // Get the follow/unfollow handler from context
  const { data: session } = useSessionContext();
  const currentUserId = session?.profile.user_id;

  // Local state to manage the following status optimistically
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  // Sync local state with prop changes (in case follow status changes externally)
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

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
