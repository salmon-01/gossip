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
    if (notification.type === 'reaction') {
      return `reacted to your post: ${notification.context}`;
    }
    if (notification.type === 'tagged_post') {
      return `tagged you in a post.`;
    }
    if (notification.type === 'tagged_comment') {
      return `tagged you in a comment.`;
    }
    if (notification.type === 'message') {
      return `Sent you a message.`;
    }
    return notification.context;
  };

  // Ensure the notification.sender exists before trying to render it
  if (!notification.sender) {
    return (
      <div
        className={`dark:bg-darkModeSecondaryBackground mb-4 rounded-lg border bg-gray-100 p-4 ${className}`} // Styling for unknown sender in dark mode
      >
        <p className="dark:text-darkModeParaText text-gray-500">
          Unknown sender
        </p>
        <p className="dark:text-darkModeParaText">{formatContext()}</p>
        <p className="dark:text-darkModeParaText text-sm text-gray-500">
          {formattedDate}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`mb-4 rounded-lg border p-4 md:w-2/3 ${
        notification.is_read
          ? 'dark:bg-darkModeSecondaryBackground bg-gray-100'
          : 'dark:bg-darkModePrimaryBackground bg-white'
      } ${className} md:mx-auto md:max-w-4xl`} // Wider on desktop, centered
    >
      <Link href={`/${notification.sender.username}`}>
        <div className="flex items-center justify-between gap-4">
          <img
            src={notification.sender.profile_img}
            className="h-8 w-8 rounded-full"
            alt={`${notification.sender.username}'s profile image`}
          />
          <p className="dark:text-darkModeParaText flex-grow">
            <span className="font-bold hover:underline">
              {notification.sender.username}
            </span>{' '}
            {formatContext()}
          </p>
          <p className="dark:text-darkModeParaText text-sm text-gray-500">
            {formattedDate}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default NotificationCard;
