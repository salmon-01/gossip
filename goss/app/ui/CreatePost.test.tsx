import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import CreatePost from './CreatePost';
import { useSessionContext } from '../../app/context/SessionContext';
import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from '@tanstack/react-query';
import { createClient } from '../../utils/supabase/client';

interface MockMutationOptions {
  mutationFn: () => Promise<any>;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

// Mock dependencies
import * as SessionContextModule from '../../app/context/SessionContext';

// Mock other dependencies
vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock('../../utils/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user123' } },
        error: null,
      }),
    },
    storage: {
      from: vi.fn().mockReturnThis(),
      upload: vi.fn().mockResolvedValue({
        data: { path: 'path/to/audio.webm' },
        error: null,
      }),
      getPublicUrl: vi.fn().mockReturnValue({
        data: { publicUrl: 'http://example.com/audio.webm' },
      }),
    },
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({
      data: [{ id: 'post123' }],
      error: null,
    }),
  })),
}));

vi.mock('@/app/ui/AudioRecorder', () => ({
  __esModule: true,
  default: vi.fn(({ onAudioSave }) => {
    // Simulate rendering the component and calling onAudioSave when needed
    const handleSave = () => {
      const blob = new Blob(['audio data'], { type: 'audio/webm' });
      onAudioSave(blob);
    };
    return (
      <div data-testid="audio-recorder">
        <button onClick={handleSave}>Simulate Audio Save</button>
      </div>
    );
  }),
}));

vi.mock('./LoadingSpinner', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="loading-spinner">Loading...</div>),
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('CreatePost Component', () => {
  const mockUser = {
    user: {
      id: 'user123',
    },
    profile: {
      profile_img: 'http://example.com/profile.jpg',
    },
  };

  const onPostCreatedMock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock useSessionContext using vi.spyOn
    vi.spyOn(SessionContextModule, 'useSessionContext').mockReturnValue({
      data: mockUser as any,
      isLoading: false,
      error: null,
    } as any);

    const invalidateQueriesMock = vi.fn();
    // @ts-ignore
    (useQueryClient as vi.Mock).mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    });
    // @ts-ignore
    (useMutation as vi.Mock).mockImplementation(
      (options: MockMutationOptions) => {
        const { mutationFn, onSuccess, onError } = options;
        return {
          mutate: () => {
            mutationFn().then(onSuccess).catch(onError);
          },
        };
      }
    );

    // @ts-ignore
    (createClient as vi.Mock).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user123' } },
          error: null,
        }),
      },
      storage: {
        from: vi.fn().mockReturnThis(),
        upload: vi.fn().mockResolvedValue({
          data: { path: 'path/to/audio.webm' },
          error: null,
        }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'http://example.com/audio.webm' },
        }),
      },
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockResolvedValue({
        data: [{ id: 'post123' }],
        error: null,
      }),
    });
  });

  test('displays loading state when session is loading', () => {
    // @ts-ignore
    (useSessionContext as vi.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<CreatePost onPostCreated={onPostCreatedMock} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error message when session has error', () => {
    // @ts-ignore
    (useSessionContext as vi.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Session error' },
    });

    render(<CreatePost onPostCreated={onPostCreatedMock} />);
    expect(screen.getByText('Error: Session error')).toBeInTheDocument();
  });

  test('displays not logged in message when session is null', () => {
    // @ts-ignore
    (useSessionContext as vi.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(<CreatePost onPostCreated={onPostCreatedMock} />);
    expect(screen.getByText('Not logged in')).toBeInTheDocument();
  });
});
