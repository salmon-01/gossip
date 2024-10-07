import NotificationCard from '@/app/ui/NotificationCard';

const mockNotifications = [
  {
    id: 1,
    type: 'new_comment',
    content: ' commented: "Great d!"',
    sender: 'ILoveS',
    created_at: '2024-10-07T14:32:00Z',
    avatar: '/kier.png',
    is_read: false,
  },
  {
    id: 2,
    type: 'new_like',
    content: ' liked your post.',
    sender: 'Scottish Truck',
    created_at: '2024-10-06T12:45:00Z',
    avatar: 'scottish_truck.jpg',
    is_read: true,
  },
  {
    id: 3,
    type: 'new_follower',
    content: ` started following you`,
    sender: 'Police K9',
    created_at: '2024-10-05T09:15:00Z',
    avatar: '',
    is_read: false,
  },
];

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
