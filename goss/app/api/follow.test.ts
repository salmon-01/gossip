import { mockSupabaseClient } from '@/mocks/supabaseClientMock';
import { fetchFollowStatus, updateFollowStatus } from './follow';
import { describe, beforeEach, test, expect } from 'vitest';

describe('fetchFollowStatus', () => {
  let supabaseMock: any;

  beforeEach(() => {
    // Initialize the Supabase mock before each test
    supabaseMock = mockSupabaseClient();
  });

  test('should return follow status as "active" if found', async () => {
    // Mock the behavior of the single() function
    supabaseMock.single.mockResolvedValue({
      data: { status: 'active' },
      error: null,
    });

    const result = await fetchFollowStatus('user1', 'user2');

    // Assert that the necessary Supabase methods were called with the correct arguments
    expect(supabaseMock.from).toHaveBeenCalledWith('connections');
    expect(supabaseMock.select).toHaveBeenCalledWith('status');
    expect(supabaseMock.eq).toHaveBeenCalledWith('user_id', 'user1');
    expect(supabaseMock.eq).toHaveBeenCalledWith('target_user_id', 'user2');
    expect(result.status).toBe('active');
  });

  test('should return follow status as "inactive" if no status is found', async () => {
    // Mock the behavior for when no data is found
    supabaseMock.single.mockResolvedValue({
      data: null,
      error: null,
    });

    const result = await fetchFollowStatus('user1', 'user2');
    expect(result.status).toBe('inactive');
  });

  test('should handle errors other than PGRST116 and throw', async () => {
    // Mock an error that isn't "PGRST116"
    supabaseMock.single.mockResolvedValue({
      data: null,
      error: { code: 'SOME_ERROR', message: 'Some error occurred' },
    });

    await expect(fetchFollowStatus('user1', 'user2')).rejects.toThrow(
      'Some error occurred'
    );
  });

  test('should return inactive status on PGRST116 error', async () => {
    // Mock the specific PGRST116 error
    supabaseMock.single.mockResolvedValue({
      data: null,
      error: { code: 'PGRST116', message: 'No data found' },
    });

    const result = await fetchFollowStatus('user1', 'user2');
    expect(result.status).toBe('inactive');
  });

  describe('updateFollowStatus', () => {
    // Test toggling from active to inactive
    test('should toggle follow status from "active" to "inactive"', async () => {
      supabaseMock.rpc.mockResolvedValue({
        data: { new_status: 'inactive' }, // Simulate toggling to 'inactive'
        error: null,
      });

      const result = await updateFollowStatus('user1', 'user2');

      expect(result.status).toBe('inactive');
      expect(result.success).toBe(true);
      expect(result.message).toBe('You have unfollowed this user.');
    });

    test('should handle errors when toggling follow status', async () => {
      supabaseMock.rpc.mockRejectedValue(new Error('RPC Error'));

      const result = await updateFollowStatus('user1', 'user2');

      // Verify the error handling
      expect(result.status).toBe('inactive');
      expect(result.success).toBe(false);
      expect(result.message).toBe('An unexpected error occurred.');
    });

    test('should handle errors when sending notification', async () => {
      // Mock the RPC call to succeed
      supabaseMock.rpc.mockResolvedValue({
        data: { new_status: 'active' },
        error: null,
      });

      // Mock the insert call to fail
      supabaseMock.insert.mockResolvedValue({
        error: new Error('Notification Error'),
      });

      const result = await updateFollowStatus('user1', 'user2');

      // Verify the error handling for the notification
      expect(result.status).toBe('inactive');
      expect(result.success).toBe(false);
      expect(result.message).toBe('An unexpected error occurred.');
    });
  });
});
