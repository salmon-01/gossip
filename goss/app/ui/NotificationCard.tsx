import Link from 'next/link';
import { Notification } from '../types/index';
import { formatDistanceToNow } from 'date-fns';

interface NotificationProps {
  notification: Notification;
  className?: string;
}

const NotificationCard: React.FC<NotificationProps> = ({
  notification,
  className = '',
}) => {
  const formattedDate = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  // Format notification content based on type
  const formatContext = () => {
    if (notification.type === 'new_comment') {
      return `commented: "${notification.context}"`;
    }
    if (notification.type === 'follow') {
      return `has followed you.`;
    }
    if (notification.type === 'like') {
      return `liked your post!`;
    }
    if (notification.type === 'tagged_post') {
      return `tagged you in a post.`;
    }
    if (notification.type === 'tagged_comment') {
      return `tagged you in a comment.`;
    }
    return notification.context;
  };

  return (
    <div
      className={`mb-4 rounded-lg border p-4 ${
        notification.is_read ? 'bg-gray-100' : 'bg-white'
      } ${className}`} // Combine default styles with custom className if provided
    >
      <Link href={`/${notification.sender.username}`}>
        <div className="flex items-center justify-between gap-4">
          <img
            src={notification.sender.profile_img}
            className="h-8 w-8 rounded-full"
            alt={`${notification.sender.username}'s profile image`}
          />
          <p>
            <span className="font-bold hover:underline">
              {notification.sender.username}
            </span>{' '}
            {formatContext()}
          </p>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
      </Link>
    </div>
  );
};

export default NotificationCard;
