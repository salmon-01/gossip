import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import NavBar from './NavBar';
import { usePathname } from 'next/navigation';

// Mock useRouter and usePathname from next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('NavBar component', () => {
  test('renders navigation links correctly', () => {
    render(<NavBar />);

    // Check if the links are rendered
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile')).toBeInTheDocument();
  });

  test('applies active style to the correct link based on pathname', () => {
    // Mock the pathname to be "/search"
    vi.mocked(usePathname).mockReturnValue('/search');

    render(<NavBar />);

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
  });
});
