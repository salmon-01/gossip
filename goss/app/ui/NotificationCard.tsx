import { Notification } from '../types/index';
import { formatDistanceToNow } from 'date-fns';

interface NotificationProps {
  notification: Notification; // Using the Notification interface
}

const NotificationCard: React.FC<NotificationProps> = ({ notification }) => {
  const formattedDate = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  return (
    <div
      className={`mb-4 rounded-lg border p-4 ${notification.is_read ? 'bg-gray-100' : 'bg-white'}`}
    >
      <div className="flex items-center justify-between gap-4">
        <img src={notification.avatar} className="h-8 w-8 rounded-full" />
        <p>
          <span className="font-bold">{notification.sender_id}</span>{' '}
          {notification.context}
        </p>
        <p className="text-sm text-gray-500">{formattedDate}</p>
      </div>
    </div>
  );
};

export default NotificationCard;
