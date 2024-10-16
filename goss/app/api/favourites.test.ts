import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFavourite, fetchFavourites, deleteFavourite } from './favourites';
import { createClient } from '@/utils/supabase/client';

vi.mock('@/utils/supabase/client');

const supabaseClientMock = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
};

createClient.mockReturnValue(supabaseClientMock);

describe('favourites API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createFavourite', () => {
    it('should create a new favourite if it does not exist', async () => {
      supabaseClientMock.select.mockResolvedValueOnce({ data: [], error: null });
      supabaseClientMock.insert.mockResolvedValueOnce({ error: null });

      await createFavourite('user1', 'post1');

      expect(supabaseClientMock.from).toHaveBeenCalledWith('favourites');
      expect(supabaseClientMock.select).toHaveBeenCalled();
      expect(supabaseClientMock.eq).toHaveBeenCalledWith('user_id', 'user1');
      expect(supabaseClientMock.eq).toHaveBeenCalledWith('post_id', 'post1');
      expect(supabaseClientMock.insert).toHaveBeenCalledWith([{ user_id: 'user1', post_id: 'post1' }]);
    });

    it('should not create a favourite if it already exists', async () => {
      supabaseClientMock.select.mockResolvedValueOnce({ data: [{ id: 'fav1' }], error: null });

      await createFavourite('user1', 'post1');

      expect(supabaseClientMock.insert).not.toHaveBeenCalled();
    });

    it('should throw an error if there is an error checking for existing favourite', async () => {
      supabaseClientMock.select.mockResolvedValueOnce({ data: null, error: new Error('Select error') });

      await expect(createFavourite('user1', 'post1')).rejects.toThrow('Select error');
    });

    it('should throw an error if there is an error inserting the favourite', async () => {
      supabaseClientMock.select.mockResolvedValueOnce({ data: [], error: null });
      supabaseClientMock.insert.mockResolvedValueOnce({ error: new Error('Insert error') });

      await expect(createFavourite('user1', 'post1')).rejects.toThrow('Insert error');
    });
  });

  describe('fetchFavourites', () => {
    it('should fetch favourites for a user', async () => {
      const mockData = [{ id: 'fav1', user_id: 'user1', post_id: 'post1' }];
      supabaseClientMock.select.mockResolvedValueOnce({ data: mockData, error: null });

      const data = await fetchFavourites('user1');

      expect(supabaseClientMock.from).toHaveBeenCalledWith('favourites');
      expect(supabaseClientMock.select).toHaveBeenCalled();
      expect(supabaseClientMock.eq).toHaveBeenCalledWith('user_id', 'user1');
      expect(data).toEqual(mockData);
    });

    it('should throw an error if there is an error fetching favourites', async () => {
      supabaseClientMock.select.mockResolvedValueOnce({ data: null, error: new Error('Fetch error') });

      await expect(fetchFavourites('user1')).rejects.toThrow('Fetch error');
    });
  });

  describe('deleteFavourite', () => {
    it('should delete a favourite', async () => {
      const mockData = { id: 'fav1' };
      supabaseClientMock.delete.mockResolvedValueOnce({ data: mockData, error: null });

      const data = await deleteFavourite('user1', 'post1');

      expect(supabaseClientMock.from).toHaveBeenCalledWith('favourites');
      expect(supabaseClientMock.delete).toHaveBeenCalled();
      expect(supabaseClientMock.eq).toHaveBeenCalledWith('user_id', 'user1');
      expect(supabaseClientMock.eq).toHaveBeenCalledWith('post_id', 'post1');
      expect(data).toEqual(mockData);
    });

    it('should throw an error if there is an error deleting the favourite', async () => {
      supabaseClientMock.delete.mockResolvedValueOnce({ data: null, error: new Error('Delete error') });

      await expect(deleteFavourite('user1', 'post1')).rejects.toThrow('Delete error');
    });
  });
});