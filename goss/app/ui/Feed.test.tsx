import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Feed from './Feed';
import { useQuery } from '@tanstack/react-query';
import { useSessionContext } from '../context/SessionContext';
import { useFollow } from '../hooks/useFollow';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('../context/SessionContext', () => ({
  useSessionContext: vi.fn(),
}));

vi.mock('../hooks/useFollow', () => ({
  useFollow: vi.fn(),
}));

vi.mock('../api/fetchPosts', () => ({
  fetchPosts: vi.fn(),
}));

vi.mock('../api/favourites', () => ({
  fetchFavourites: vi.fn(),
}));

vi.mock('./Post', () => ({
  __esModule: true,
  default: ({ post }) => <div>{post.title}</div>,
}));

vi.mock('./LoadingSpinner', () => ({
  __esModule: true,
  default: () => <div>Loading...</div>,
}));

describe('Feed', () => {
  const mockPosts = [
    { id: 1, title: 'Post 1', created_at: '2023-01-01', user_id: 1, profiles: {} },
    { id: 2, title: 'Post 2', created_at: '2023-01-02', user_id: 2, profiles: {} },
  ];

  const mockFavourites = [1];

  const mockSession = {
    user: {
      id: '1',
    },
  };

  const mockFollowingData = [
    { target_user_id: 1 },
  ];

  beforeEach(() => {
    useQuery.mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'posts') {
        return { data: mockPosts, isLoading: false, isError: false };
      }
      if (queryKey[0] === 'favourites') {
        return { data: mockFavourites, isLoading: false, isError: false };
      }
      return { data: [], isLoading: false, isError: false };
    });

    useSessionContext.mockReturnValue({ data: mockSession });
    useFollow.mockReturnValue({ followingData: mockFollowingData });
  });

  it('renders loading spinner when loading', () => {
    useQuery.mockImplementationOnce(() => ({ isLoading: true }));
    render(<Feed />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message on error', () => {
    useQuery.mockImplementationOnce(() => ({ isError: true, error: { message: 'Error' } }));
    render(<Feed />);
    expect(screen.getByText('Error loading posts: Error')).toBeInTheDocument();
  });

  it('renders posts', () => {
    render(<Feed />);
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
  });

  it('toggles sort order', () => {
    render(<Feed />);
    const sortButton = screen.getByRole('button', { name: /sort posts/i });
    fireEvent.click(sortButton);
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
  });

  it('filters posts by following', () => {
    render(<Feed />);
    const forYouButton = screen.getByRole('button', { name: /for you/i });
    fireEvent.click(forYouButton);
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.queryByText('Post 2')).not.toBeInTheDocument();
  });
});