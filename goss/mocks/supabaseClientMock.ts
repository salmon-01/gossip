import { vi } from 'vitest';

// Mocked Supabase client
const supabaseMock = {
  from: vi.fn().mockReturnThis(), // For chaining
  select: vi.fn().mockReturnThis(), // Mock select
  eq: vi.fn().mockReturnThis(), // Mock eq
  order: vi.fn().mockReturnThis(), // Mock order (for chaining)
  single: vi.fn(), // Mock single
  rpc: vi.fn(), // Mock rpc
  insert: vi.fn().mockReturnThis(), // Mock insert (for chaining)
  update: vi.fn().mockReturnThis(), // Mock update (for chaining)
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id' } }, // Mock user auth data
      error: null,
    }),
  },
};

// Function to create and return the mock
export const createSupabaseMock = () => supabaseMock;

// Function to mock the Supabase client globally in tests
export const mockSupabaseClient = () => {
  vi.mock('@/utils/supabase/client', () => {
    return {
      createClient: () => {
        return supabaseMock; // Return the mocked client
      },
    };
  });
  return supabaseMock;
};
