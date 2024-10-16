import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PostComponent from './Post';
import { User, Post, Favourite } from '@/app/types';
import { SessionContext } from '@/app/context/SessionContext';

const mockUser: User = {
  id: '1',
  username: 'testuser',
  display_name: 'Test User',
  profile_img: 'test.jpg',
};

const mockPost: Post = {
  id: '1',
  user_id: '1',
  caption: 'Test caption',
  audio: 'test.mp3',
  transcription: 'Test transcription',
  created_at: new Date().toISOString(),
  comments: [],
};

const mockFavourites: Favourite[] = [];

const mockSession = {
  user: {
    id: '1',
  },
};

describe('PostComponent', () => {
  it('renders post details correctly', () => {
    render(
      <SessionContext.Provider value={{ data: mockSession }}>
        <PostComponent user={mockUser} post={mockPost} favourites={mockFavourites} />
      </SessionContext.Provider>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText('Test caption')).toBeInTheDocument();
  });

});