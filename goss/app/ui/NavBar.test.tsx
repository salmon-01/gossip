import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import NavBar from './NavBar';
import { useSessionContext } from '../context/SessionContext';
import { useGlobalNotifications } from '../context/NotificationsContext';
import { Session } from '../types';

// Mock usePathname, useSessionContext, and useGlobalNotifications
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('../context/SessionContext', () => ({
  useSessionContext: vi.fn(),
}));

vi.mock('../context/NotificationsContext', () => ({
  useGlobalNotifications: vi.fn(),
}));

describe('NavBar component', () => {
  const mockSession: Session = {
    profile: {
      username: 'testuser',
      profile_img: 'profile_image_url',
      badge: 'badge',
      bio: 'Just vibes',
    },
  };

  beforeEach(() => {
    // Mock the session context to return a valid session object
    vi.mocked(useSessionContext).mockReturnValue({
      data: mockSession as any,
    } as any);

    // Mock the global notifications context to return mock notifications
    vi.mocked(useGlobalNotifications).mockReturnValue({
      notifications: [{ id: 1, is_read: false }], // Simulate an unread notification
      isLoading: false, // Simulate that loading is done
    });
  });

  test('renders navigation links correctly', () => {
    render(<NavBar />); // Ensure component is rendered
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile')).toBeInTheDocument();
  });

  test('renders profile link with correct username', () => {
    render(<NavBar />);
    const profileLink = screen.getByLabelText('Profile');
    // Check that the Profile link contains the username in its href
    expect(profileLink).toHaveAttribute('href', `/testuser`);
  });
});
