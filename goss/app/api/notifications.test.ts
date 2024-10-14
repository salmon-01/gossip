import { mockSupabaseClient } from '@/mocks/supabaseClientMock'; // Import the Supabase mock
import {
  fetchNotifications,
  getUserId,
  markNotificationsRead,
} from '@/app/api/notifications';
import { vi } from 'vitest';

// Mock the Supabase client globally to prevent real API calls
vi.mock('@/utils/supabase/client', () => ({
  createClient: () => mockSupabaseClient(), // This ensures that the mocked client is returned
}));

// Initialize the mock client
let supabaseMock: any;

beforeEach(() => {
  supabaseMock = mockSupabaseClient();
  vi.clearAllMocks();
});

describe('fetchNotifications', () => {
  test('should fetch notifications for a user', async () => {
    const mockNotifications = [
      {
        id: 1,
        is_read: false,
        context: 'Test Notification 1',
        created_at: '2023-01-01',
      },
      {
        id: 2,
        is_read: true,
        context: 'Test Notification 2',
        created_at: '2023-01-02',
      },
    ];

    // Mock Supabase response
    supabaseMock.from.mockReturnThis();
    supabaseMock.select.mockReturnThis();
    supabaseMock.eq.mockReturnThis();
    supabaseMock.order.mockResolvedValue({
      data: mockNotifications,
      error: null,
    });

    const result = await fetchNotifications('test-user-id');

    expect(supabaseMock.from).toHaveBeenCalledWith('notifications');
    expect(supabaseMock.select).toHaveBeenCalled();
    expect(supabaseMock.eq).toHaveBeenCalledWith('user_id', 'test-user-id');
    expect(supabaseMock.order).toHaveBeenCalledWith('created_at', {
      ascending: false,
    });
    expect(result).toEqual(mockNotifications);
  });

  test('should return an empty array if userId is null', async () => {
    const result = await fetchNotifications(null);
    expect(result).toEqual([]);
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  test('should throw an error if fetching notifications fails', async () => {
    supabaseMock.from.mockReturnThis();
    supabaseMock.select.mockReturnThis();
    supabaseMock.eq.mockReturnThis();
    supabaseMock.order.mockResolvedValue({
      data: null,
      error: { message: 'Something went wrong' },
    });

    await expect(fetchNotifications('test-user-id')).rejects.toThrow(
      'Something went wrong'
    );
  });
});

describe('getUserId', () => {
  test('should return user ID if authenticated', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });

    const result = await getUserId();
    expect(supabaseMock.auth.getUser).toHaveBeenCalled();
    expect(result).toBe('test-user-id');
  });

  test('should return null if there is an error fetching user ID', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({
      data: null,
      error: { message: 'Auth error' },
    });

    const result = await getUserId();
    expect(supabaseMock.auth.getUser).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
