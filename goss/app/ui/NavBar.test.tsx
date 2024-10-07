import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import NavBar from './NavBar';
import { usePathname } from 'next/navigation';

// Mock useRouter and usePathname from next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('NavBar component', () => {
  const mockUsername = 'testuser';
  test('renders navigation links correctly', () => {
    render(<NavBar username={mockUsername}/>);

    // Check if the links are rendered
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile')).toBeInTheDocument();
  });

  test('applies active style to the correct link based on pathname', () => {
    // Mock the pathname to be "/search"
    vi.mocked(usePathname).mockReturnValue('/search');

    render(<NavBar username={mockUsername}/>);

    const searchIcon = screen.getByLabelText('Search');
    const homeIcon = screen.getByLabelText('Home');

    // Check that the "Search" link is active
    expect(searchIcon.firstChild).toHaveStyle({
      color: '#9333ea',
      strokeWidth: '2.5',
    });

    // Check that the "Home" link is inactive
    expect(homeIcon.firstChild).toHaveStyle({
      color: '#7b53bb',
      strokeWidth: '1',
    });

    test('renders profile link with correct username', () => {
      render(<NavBar username={mockUsername} />); // Pass the username prop
  
      // Check that the Profile link contains the username in its href
      const profileLink = screen.getByLabelText('Profile');
      expect(profileLink).toHaveAttribute('href', `/profile/${mockUsername}`);
    });
  });
});
