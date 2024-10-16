import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Reactions from './Reactions';
import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from '@tanstack/react-query';
import { addReaction, removeReaction } from '../api/reactions';

import * as SessionContextModule from '../context/SessionContext';

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock('../api/reactions', () => ({
  addReaction: vi.fn(),
  removeReaction: vi.fn(),
}));

vi.mock('@/utils/supabase/client', () => ({
  createClient: vi.fn(() => ({})),
}));

describe('Reactions Component', () => {
  const mockUser = {
    user: {
      id: 'user123',
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(SessionContextModule, 'useSessionContext').mockReturnValue({
      data: mockUser as any,
    } as any);

    const invalidateQueriesMock = vi.fn();
    // @ts-ignore
    (useQueryClient as vi.Mock).mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    });

    // @ts-ignore
    (useMutation as vi.Mock).mockImplementation(
      (options: UseMutationOptions<any, any, any, any>) => {
        const { mutationFn, onSuccess, onError } = options;
        return {
          mutate: async (variables: any) => {
            try {
              const result = await mutationFn(variables);
              if (onSuccess) onSuccess(result, variables, undefined);
            } catch (error) {
              if (onError) onError(error, variables, error);
            }
          },
        };
      }
    );
  });

  test('displays loading message when post is null', () => {
    render(<Reactions postAuthorId="author123" post={null} />);
    expect(screen.getByText('Loading reactions...')).toBeInTheDocument();
  });

  test('renders reactions correctly when post has reactions', () => {
    const mockPost = {
      id: 'post123',
      reactions: [
        { reaction: '😀', user_id: 'user456' },
        { reaction: '😀', user_id: 'user789' },
        { reaction: '❤️', user_id: 'user123' },
      ],
    };

    render(<Reactions postAuthorId="author123" post={mockPost} />);

    expect(screen.getByText('😀')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('❤️')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    const heartReactionButton = screen.getByText('❤️').closest('button');
    expect(heartReactionButton).toHaveClass('bg-purple-600');
  });

  test('clicking on a reaction removes it if the user has reacted', async () => {
    const mockPost = {
      id: 'post123',
      reactions: [{ reaction: '❤️', user_id: 'user123' }],
    };

    const removeReactionMock = removeReaction as vi.MockedFunction<
      typeof removeReaction
    >;
    removeReactionMock.mockResolvedValue({});

    const invalidateQueriesMock = vi.fn();
    // @ts-ignore
    (useQueryClient as vi.Mock).mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    });

    render(<Reactions postAuthorId="author123" post={mockPost} />);

    const heartReactionButton = screen.getByText('❤️').closest('button');
    fireEvent.click(heartReactionButton!);

    await waitFor(() => {
      expect(removeReactionMock).toHaveBeenCalledWith(
        'post123',
        'user123',
        '❤️'
      );
      expect(invalidateQueriesMock).toHaveBeenCalledWith({
        queryKey: ['reactions', 'post123'],
      });
    });
  });

  test('clicking on a reaction adds it if the user has not reacted', async () => {
    const mockPost = {
      id: 'post123',
      reactions: [{ reaction: '😀', user_id: 'user456' }],
    };

    const addReactionMock = addReaction as vi.MockedFunction<
      typeof addReaction
    >;
    addReactionMock.mockResolvedValue({});

    const invalidateQueriesMock = vi.fn();
    // @ts-ignore
    (useQueryClient as vi.Mock).mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    });

    render(<Reactions postAuthorId="author123" post={mockPost} />);

    const happyReactionButton = screen.getByText('😀').closest('button');
    fireEvent.click(happyReactionButton!);

    await waitFor(() => {
      expect(addReactionMock).toHaveBeenCalledWith(
        'post123',
        'user123',
        '😀',
        'author123'
      );
      expect(invalidateQueriesMock).toHaveBeenCalledWith({
        queryKey: ['reactions', 'post123'],
      });
    });
  });

  test('clicking on "..." shows the emoji picker', () => {
    const mockPost = {
      id: 'post123',
      reactions: [{ reaction: '😀', user_id: 'user456' }],
    };

    render(<Reactions postAuthorId="author123" post={mockPost} />);

    const emojiPickerButton = screen.getByText('...');
    fireEvent.click(emojiPickerButton);

    // Check that the emoji picker is displayed
    const newEmojis = ['😢', '❤️', '🔥', '👍', '👎', '🎉', '😮'];
    newEmojis.forEach((emoji) => {
      expect(screen.getByText(emoji)).toBeInTheDocument();
    });
  });

  test('clicking on an emoji in the picker adds the reaction', async () => {
    const mockPost = {
      id: 'post123',
      reactions: [{ reaction: '😀', user_id: 'user456' }],
    };

    const addReactionMock = addReaction as vi.MockedFunction<
      typeof addReaction
    >;
    addReactionMock.mockResolvedValue({});

    const invalidateQueriesMock = vi.fn();
    // @ts-ignore
    (useQueryClient as vi.Mock).mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    });

    render(<Reactions postAuthorId="author123" post={mockPost} />);

    const emojiPickerButton = screen.getByText('...');
    fireEvent.click(emojiPickerButton);

    const fireEmojiButton = screen.getByText('🔥').closest('button');
    fireEvent.click(fireEmojiButton!);

    await waitFor(() => {
      expect(addReactionMock).toHaveBeenCalledWith(
        'post123',
        'user123',
        '🔥',
        'author123'
      );
      expect(invalidateQueriesMock).toHaveBeenCalledWith({
        queryKey: ['reactions', 'post123'],
      });
    });
  });

  test('does not show "..." button when all emojis are used', () => {
    const availableEmojis = ['😀', '😢', '❤️', '🔥', '👍', '👎', '🎉', '😮'];
    const mockPost = {
      id: 'post123',
      reactions: availableEmojis.map((emoji) => ({
        reaction: emoji,
        user_id: 'user456',
      })),
    };

    render(<Reactions postAuthorId="author123" post={mockPost} />);

    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });
});
