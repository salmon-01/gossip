import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import NavBar from './NavBar';
import { usePathname } from 'next/navigation';
import { useSessionContext } from '../context/SessionContext'; // Import the context
import { Session } from '../types';

// Mock usePathname and useSessionContext
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('../context/SessionContext', () => ({
  useSessionContext: vi.fn(),
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
      data: mockSession,
    });
  });

  test('renders navigation links correctly', () => {
    render(<NavBar />); // Ensure component is rendered
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile')).toBeInTheDocument();
  });

  test('applies active style to the correct link based on pathname', () => {
    vi.mocked(usePathname).mockReturnValue('/search');
    render(<NavBar />); // Ensure component is rendered

    const searchIcon = screen.getByLabelText('Search');
    const homeIcon = screen.getByLabelText('Home');

    // Check that the "Search" link is active
    expect(searchIcon.firstChild).toHaveStyle({
      color: '#9333ea',
      strokeWidth: '2.5',
    });

    // Check that the "Home" link is inactive
    expect(homeIcon.firstChild).toHaveStyle({
      color: '#7b53bb',
      strokeWidth: '1',
    });
  });

  test('renders profile link with correct username', () => {
    render(<NavBar />);
    const profileLink = screen.getByLabelText('Profile');
    // Check that the Profile link contains the username in its href
    expect(profileLink).toHaveAttribute('href', `/testuser`);
  });
});
