// CommentSection.test.tsx
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import CommentSection from './CommentSection';
import { useSessionContext } from '../../app/context/SessionContext';
import moment from 'moment';

vi.mock('../../app/context/SessionContext', () => ({
  useSessionContext: vi.fn(),
}));

describe('CommentSection Component', () => {
  const mockUser = {
    user_id: 'user123',
    profile_img: 'http://example.com/profile.jpg',
    display_name: 'John Doe',
  };

  const mockComments = [
    {
      id: 'comment1',
      content: 'This is a test comment',
      created_at: '2023-10-01T12:00:00Z',
      post_id: 'post1',
      profiles: {
        user_id: 'user123',
        profile_img: 'http://example.com/profile.jpg',
        display_name: 'John Doe',
      },
      user_id: 'user123',
    },
    {
      id: 'comment2',
      content: 'Another comment from a different user',
      created_at: '2023-10-02T15:30:00Z',
      post_id: 'post1',
      profiles: {
        user_id: 'user456',
        profile_img: '',
        display_name: 'Jane Smith',
      },
      user_id: 'user456',
    },
  ];

  const onDeleteCommentMock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    // @ts-ignore
    (useSessionContext as vi.Mock).mockReturnValue({
      data: {
        profile: mockUser,
      },
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders comments correctly', () => {
    render(
      <CommentSection
        comments={mockComments}
        onDeleteComment={onDeleteCommentMock}
      />
    );

    expect(screen.getByText('Comments')).toBeInTheDocument();

    // Check if the comments are rendered
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    expect(
      screen.getByText('Another comment from a different user')
    ).toBeInTheDocument();

    // Check if display names are rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test("does not show delete button for other users' comments", () => {
    render(
      <CommentSection
        comments={mockComments}
        onDeleteComment={onDeleteCommentMock}
      />
    );

    // Find the second comment (other user's comment)
    const otherComment = screen
      .getByText('Another comment from a different user')
      .closest('div');

    // There should be no menu button within other user's comment
    const menuButton = within(otherComment!).queryByRole('button');

    expect(menuButton).toBeNull();
  });

  test('opens and closes the menu when the menu button is clicked', () => {
    render(
      <CommentSection
        comments={mockComments}
        onDeleteComment={onDeleteCommentMock}
      />
    );

    // Find the menu button in the user's own comment
    const ownComment = screen
      .getByText('This is a test comment')
      .closest('div');
    const menuButton = within(ownComment!).getByRole('button');

    // Click the menu button to open the menu
    fireEvent.click(menuButton);

    // Check if the delete button appears
    const deleteButton = within(ownComment!).getByText('Delete');
    expect(deleteButton).toBeInTheDocument();

    // Click the menu button again to close the menu
    fireEvent.click(menuButton);

    // The delete button should no longer be in the document
    expect(within(ownComment!).queryByText('Delete')).toBeNull();
  });

  test('calls onDeleteComment when delete button is clicked', () => {
    render(
      <CommentSection
        comments={mockComments}
        onDeleteComment={onDeleteCommentMock}
      />
    );

    // Open the menu
    const ownComment = screen
      .getByText('This is a test comment')
      .closest('div');
    const menuButton = within(ownComment!).getByRole('button');
    fireEvent.click(menuButton);

    // Click the delete button
    const deleteButton = within(ownComment!).getByText('Delete');
    fireEvent.click(deleteButton);

    expect(onDeleteCommentMock).toHaveBeenCalledTimes(1);
    expect(onDeleteCommentMock).toHaveBeenCalledWith('comment1');
  });

  test('displays relative time correctly', () => {
    // Mock moment to return a fixed time
    const mockMoment = vi
      .spyOn(moment.prototype, 'fromNow')
      .mockReturnValue('2 hours ago');

    render(
      <CommentSection
        comments={mockComments}
        onDeleteComment={onDeleteCommentMock}
      />
    );

    expect(screen.getAllByText('2 hours ago').length).toBe(2);

    mockMoment.mockRestore();
  });

  test('displays initials when profile image is not available', () => {
    render(
      <CommentSection
        comments={mockComments}
        onDeleteComment={onDeleteCommentMock}
      />
    );

    // Find the other user's comment
    const otherComment = screen
      .getByText('Another comment from a different user')
      .closest('div');

    // Check for the initials avatar
    const initialsAvatar = within(otherComment!).getByText('JS');
    expect(initialsAvatar).toBeInTheDocument();
  });

  test('handles loading state', () => {
    // @ts-ignore
    (useSessionContext as vi.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <CommentSection
        comments={mockComments}
        onDeleteComment={onDeleteCommentMock}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('handles error state', () => {
    // @ts-ignore
    (useSessionContext as vi.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Failed to load session' },
    });

    render(
      <CommentSection
        comments={mockComments}
        onDeleteComment={onDeleteCommentMock}
      />
    );

    expect(
      screen.getByText('Error: Failed to load session')
    ).toBeInTheDocument();
  });

  test('handles not logged in state', () => {
    // @ts-ignore
    (useSessionContext as vi.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(
      <CommentSection
        comments={mockComments}
        onDeleteComment={onDeleteCommentMock}
      />
    );

    expect(screen.getByText('Not logged in')).toBeInTheDocument();
  });

  test('displays message when there are no comments', () => {
    render(
      <CommentSection comments={[]} onDeleteComment={onDeleteCommentMock} />
    );

    expect(
      screen.getByText('No comments yet. Be the first to comment!')
    ).toBeInTheDocument();
  });
});
