import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { usePathname } from 'next/navigation';
import CreatePost from './CreatePost';
import { mockUsers } from '@/mocks/mockUsers';

// Mock useRouter and usePathname from next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('CreatePost component', () => {
  render(<CreatePost user={mockUsers[1]} />)

  test('renders navigation links correctly', () => {
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile')).toBeInTheDocument();
    
  });

  
});