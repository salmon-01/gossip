import { render, screen } from '@testing-library/react';
import { formatDistanceToNow } from 'date-fns';
import NotificationCard from './NotificationCard'; // Assuming the path is correct
import { Notification } from '../types';
import { vi } from 'vitest';
import Link from 'next/link';

// Mock the Next.js Link component
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe('NotificationCard component', () => {
  const notification: Notification = {
    id: '1',
    user_id: 'e232133',
    sender_id: 'eweq2321',
    type: 'new_comment',
    context: 'This is a comment.',
    created_at: new Date().toISOString(),
    is_read: false,
    sender: {
      username: 'senderuser',
      profile_img: 'sender_image_url',
    },
    recipient: {
      username: 'recipientuser',
      profile_img: 'recipient_image_url',
    },
  };

  test('renders notification with correct data', () => {
    render(<NotificationCard notification={notification} />);

    // Check if the profile image is rendered
    const profileImage = screen.getByAltText("senderuser's profile image");
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', 'sender_image_url');

    // Check if the username link is rendered
    const usernameLink = screen.getByText('senderuser');
    expect(usernameLink).toBeInTheDocument();
    expect(usernameLink).toHaveClass('font-bold hover:underline');

    // Check if the comment context is rendered
    const contextText = screen.getByText(/commented: "This is a comment."/);
    expect(contextText).toBeInTheDocument();

    // Check if the date is rendered correctly
    const formattedDate = formatDistanceToNow(
      new Date(notification.created_at),
      {
        addSuffix: true,
      }
    );
    const dateElement = screen.getByText(formattedDate);
    expect(dateElement).toBeInTheDocument();
  });

  test('renders follow request notification', () => {
    const followNotification: Notification = {
      ...notification,
      type: 'follow',
      context: '', // No context for follow requests
    };

    render(<NotificationCard notification={followNotification} />);

    // Check if the follow request message is rendered
    const followRequestText = screen.getByText('has followed you.');
    expect(followRequestText).toBeInTheDocument();
  });

  test('renders like notification', () => {
    const likeNotification: Notification = {
      ...notification,
      type: 'reaction',
      context: '', // No context for likes
    };

    render(<NotificationCard notification={likeNotification} />);

    // Check if the like notification message is rendered
    const likeNotificationText = screen.getByText('reacted to your post:');
    expect(likeNotificationText).toBeInTheDocument();
  });

  test('renders tagged post notification', () => {
    const taggedNotification: Notification = {
      ...notification,
      type: 'tagged_post',
      context: '', // No context for tagged posts
    };

    render(<NotificationCard notification={taggedNotification} />);

    // Check if the tagged post notification message is rendered
    const taggedText = screen.getByText('tagged you in a post.');
    expect(taggedText).toBeInTheDocument();
  });

  test('username link goes to correct path', () => {
    render(<NotificationCard notification={notification} />);

    const usernameLink = screen.getByText('senderuser');
    expect(usernameLink.closest('a')).toHaveAttribute('href', '/senderuser');
  });

  test('applies read status class correctly', () => {
    const readNotification: Notification = {
      ...notification,
      is_read: true,
    };

    const { container } = render(
      <NotificationCard notification={readNotification} />
    );

    // Check if the container has the correct read status class
    expect(container.firstChild).toHaveClass('bg-gray-100');
  });

  test('applies unread status class correctly', () => {
    const unreadNotification: Notification = {
      ...notification,
      is_read: false,
    };

    const { container } = render(
      <NotificationCard notification={unreadNotification} />
    );

    // Check if the container has the correct unread status class
    expect(container.firstChild).toHaveClass('bg-white');
  });
});
