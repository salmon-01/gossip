// mocks/supabaseClientMock.ts
import { vi } from 'vitest';

// Mocked Supabase client
const supabaseMock = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn(),
  rpc: vi.fn(),
  insert: vi.fn().mockReturnThis(),
  selectInsert: vi.fn().mockReturnThis(),
};

// Function to create and return the mock
export const createSupabaseMock = () => supabaseMock;

// Mock the `createClient` function and return the mock
export const mockSupabaseClient = () => {
  vi.mock('@/utils/supabase/client', () => ({
    createClient: () => supabaseMock, // Return the mocked client
  }));
  return supabaseMock; // Also return the mock for direct access in tests
};
