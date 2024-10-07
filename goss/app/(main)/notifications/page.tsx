import NotificationCard from '@/app/ui/NotificationCard';
import { mockNotifications } from '../../../mocks/mockNotifications';

export default function Notifications() {
  return (
    <div className="min-h-screen p-4">
      {/* Title centered at the top */}
      <h1 className="mb-6 text-center text-2xl font-bold">Notifications</h1>

      {/* Container for notifications, centered in the screen */}
      <div className="flex flex-col items-center">
        {mockNotifications.length === 0 && <p>You have no new notifications</p>}
        {mockNotifications.length > 0 &&
          mockNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
      </div>
    </div>
  );
}
