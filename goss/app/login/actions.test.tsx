import { expect, vi, describe, it, beforeEach } from 'vitest';
import { login } from './actions'; // Adjust this path if necessary
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
// Mock the dependencies
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}));
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));
// Mock environment variables
vi.mock('process', () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'mock-anon-key',
  },
}));
describe('login function', () => {
  let mockSignInWithPassword: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    vi.resetAllMocks();
    mockSignInWithPassword = vi.fn();
    (createServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      {
        auth: {
          signInWithPassword: mockSignInWithPassword,
        },
      }
    );
  });
  it('should redirect to /error if signInWithPassword returns an error', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'wrongpassword');
    mockSignInWithPassword.mockResolvedValue({
      error: new Error('Invalid credentials'),
    });
    await login(formData);
    expect(redirect).toHaveBeenCalledWith('/error');
  });
  it('should revalidate path and redirect to /home on successful login', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');
    mockSignInWithPassword.mockResolvedValue({ error: null });
    await login(formData);
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    expect(redirect).toHaveBeenCalledWith('/home');
  });
});
