import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import CreatePost from './CreatePost';
import { useSessionContext } from '../context/SessionContext';


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
      username: 'testuser',
      profile_img: 'profile_image_url',
      badge: 'badge',
      bio: 'Just vibes',
    },
  };

  beforeEach(() => {
    // Mock the session context to return a valid session object
    vi.mocked(useSessionContext).mockReturnValue({
      data: mockSession,
    });
  });
  
  render(<CreatePost />)

  test('', () => {
    expect(screen.getByLabelText('Post')).toBeInTheDocument();
  });
  
});