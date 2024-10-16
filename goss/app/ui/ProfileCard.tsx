import Link from 'next/link';
import FollowButton from './FollowButton'; // Import the FollowButton component
import { useSessionContext } from '../context/SessionContext';
import { User } from '../types';

interface ProfileCardProps {
  user: User; // Assuming User type has fields like display_name, username, user_id, etc.
  isFollowing: boolean;
  isLoading: boolean;
}

const ProfileCard = ({ user, isLoading }: ProfileCardProps) => {
  const { data: session } = useSessionContext();
  const currentUserId = session?.profile.user_id;

  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow dark:bg-darkModeSecondaryBackground">
      <div className="flex items-center">
        <img
          src={user.profile_img}
          alt={`${user.display_name}'s profile`}
          className="h-10 w-10 rounded-full"
        />
        <Link href={`/${user.username}`}>
          <div className="ml-3 flex flex-col">
            <p className="font-semibold dark:text-darkModeParaText">
              {user.display_name}
            </p>
            <p className="text-gray-500 dark:text-darkModeDimText">
              @{user.username}
            </p>
          </div>
        </Link>
      </div>

      {String(user.user_id) !== String(currentUserId) && ( // Force comparison as strings
        <FollowButton
          targetUserId={user.user_id}
          targetUserName={user.display_name}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ProfileCard;
