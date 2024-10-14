import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import CreatePost from './CreatePost';
import { useSessionContext } from '../context/SessionContext';
import { Session } from '../types';

// Mock useRouter and usePathname from next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('../context/SessionContext', () => ({
  useSessionContext: vi.fn(),
}));

describe('CreatePost component', () => {
  const mockSession: Session = {
    profile: {
      user_id: 'ae12',
      username: 'MockyBoy',
      badge: 'badge',
      profile_img: '/dogface.jpg',
      bio: '',
      created_at: new Date(),
      updated_at: new Date(),
      display_name: 'MockyMan',
    },
    user: {
      id: 'ae12',
      aud: 'string',
      role: 'string',
      email: 'string@string.com',
      email_confirmed_at: new Date(),
      phone: 793647483,
    },
  };

  beforeEach(() => {
    // Mock the session context to return a valid session object
    vi.mocked(useSessionContext).mockReturnValue({
      data: mockSession,
    });
  });

  render(<CreatePost />);

  test('', () => {
    expect(screen.getByLabelText('Post')).toBeInTheDocument();
  });
});
