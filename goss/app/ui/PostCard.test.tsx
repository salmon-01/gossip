import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import PostCard from './PostCard';

vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ href, children }: { href: string; children: React.ReactNode }) => (
      <a href={href}>{children}</a>
    ),
  };
});

describe('PostCard Component', () => {
  const mockPost = {
    id: 'post123',
    caption: 'This is a test caption for the post card component.',
    profiles: {
      display_name: 'Test User',
      profile_img: 'http://example.com/profile.jpg',
      username: 'testuser',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders post information correctly', () => {
    render(<PostCard post={mockPost} />);

    const profileImage = screen.getByAltText(`Test User's profile`);
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', 'http://example.com/profile.jpg');

    const captionElement = screen.getByText((content, element) => {
      return content.startsWith('This is a test caption');
    });
    expect(captionElement).toBeInTheDocument();

    expect(screen.getByText('@testuser')).toBeInTheDocument();

    const postLink = screen.getByText('@testuser').closest('a');
    expect(postLink).toHaveAttribute('href', 'post/post123');
  });

  test('handles missing profile image correctly', () => {
    const postWithoutImage = {
      ...mockPost,
      profiles: {
        ...mockPost.profiles,
        profile_img: '',
      },
    };

    render(<PostCard post={postWithoutImage} />);

    const profileImage = screen.getByAltText(`Test User's profile`);
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', ''); 
  });

  test('handles missing user data correctly', () => {
    const postWithoutUser = {
      ...mockPost,
      profiles: null,
    };

    render(<PostCard post={postWithoutUser as any} />);

    expect(screen.queryByAltText(/profile/)).not.toBeInTheDocument();
    expect(screen.queryByText('@')).not.toBeInTheDocument();
  });
});
