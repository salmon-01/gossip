import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import ProfileCard from './ProfileCard';
import { useSessionContext } from '../context/SessionContext';

vi.mock('../context/SessionContext', () => ({
  useSessionContext: vi.fn(),
}));

vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ href, children }: { href: string; children: React.ReactNode }) => (
      <a href={href}>{children}</a>
    ),
  };
});

vi.mock('./FollowButton', () => ({
  __esModule: true,
  default: vi.fn(() => <button>Follow</button>),
}));

describe('ProfileCard Component', () => {
  const mockUser = {
    user_id: 'user123',
    display_name: 'Test User',
    username: 'testuser',
    profile_img: 'http://example.com/profile.jpg',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders user information correctly', () => {
    (useSessionContext as vi.Mock).mockReturnValue({
      data: { profile: { user_id: 'currentUser' } },
    });

    render(<ProfileCard user={mockUser} isFollowing={false} isLoading={false} />);

    const profileImage = screen.getByAltText(`Test User's profile`);
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', 'http://example.com/profile.jpg');

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();

    const profileLink = screen.getByText('Test User').closest('a');
    expect(profileLink).toHaveAttribute('href', '/testuser');
  });

  test('renders FollowButton when viewing another user', () => {
    (useSessionContext as vi.Mock).mockReturnValue({
      data: { profile: { user_id: 'currentUser' } },
    });

    render(<ProfileCard user={mockUser} isFollowing={false} isLoading={false} />);

    expect(screen.getByText('Follow')).toBeInTheDocument();
  });

  test('does not render FollowButton when viewing own profile', () => {
    (useSessionContext as vi.Mock).mockReturnValue({
      data: { profile: { user_id: 'user123' } },
    });

    render(<ProfileCard user={mockUser} isFollowing={false} isLoading={false} />);

    expect(screen.queryByText('Follow')).not.toBeInTheDocument();
  });

  test('handles missing session data correctly', () => {
    (useSessionContext as vi.Mock).mockReturnValue({
      data: null,
    });

    render(<ProfileCard user={mockUser} isFollowing={false} isLoading={false} />);

    expect(screen.getByText('Follow')).toBeInTheDocument();
  });
});
