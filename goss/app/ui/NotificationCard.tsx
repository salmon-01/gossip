import { Notification } from '../types/index';
import { formatDistanceToNow } from 'date-fns';

interface NotificationProps {
  notification: Notification; // Using the Notification interface
}

const NotificationCard: React.FC<NotificationProps> = ({ notification }) => {
  const formattedDate = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  // Format notification content based on type
  const formatContext = () => {
    if (notification.type === 'new_comment') {
      return `commented: "${notification.context}"`;
    }
    if (notification.type === 'follow_request') {
      return `requested to follow you.`;
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
      className={`mb-4 rounded-lg border p-4 ${notification.is_read ? 'bg-gray-100' : 'bg-white'}`}
    >
      <div className="flex items-center justify-between gap-4">
        <img
          src={notification.sender.profile_img}
          className="h-8 w-8 rounded-full"
        />
        <p>
          <span className="font-bold">{notification.sender.username}</span>{' '}
          {formatContext()}
        </p>
        <p className="text-sm text-gray-500">{formattedDate}</p>
      </div>
    </div>
  );
};

export default NotificationCard;
