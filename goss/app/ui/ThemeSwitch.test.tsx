// ThemeSwitch.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import ThemeSwitch from './ThemeSwitch';
import { useTheme } from 'next-themes';

// Mock the useTheme hook from next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeSwitch Component', () => {
  const setThemeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders sun icon when theme is dark', () => {
    // @ts-ignore
    (useTheme as vi.Mock).mockReturnValue({
      resolvedTheme: 'dark',
      setTheme: setThemeMock,
    });

    render(<ThemeSwitch />);

    // Check if the sun icon is rendered
    const sunIcon = screen.getByTestId('sun-icon');
    expect(sunIcon).toBeInTheDocument();
  });

  test('renders moon icon when theme is light', () => {
    // @ts-ignore
    (useTheme as vi.Mock).mockReturnValue({
      resolvedTheme: 'light',
      setTheme: setThemeMock,
    });

    render(<ThemeSwitch />);

    // Check if the moon icon is rendered
    const moonIcon = screen.getByTestId('moon-icon');
    expect(moonIcon).toBeInTheDocument();
  });

  test('clicking sun icon switches theme to light', () => {
    // @ts-ignore
    (useTheme as vi.Mock).mockReturnValue({
      resolvedTheme: 'dark',
      setTheme: setThemeMock,
    });

    render(<ThemeSwitch />);

    const sunIcon = screen.getByTestId('sun-icon');
    fireEvent.click(sunIcon);

    expect(setThemeMock).toHaveBeenCalledWith('light');
  });

  test('clicking moon icon switches theme to dark', () => {
    // @ts-ignore
    (useTheme as vi.Mock).mockReturnValue({
      resolvedTheme: 'light',
      setTheme: setThemeMock,
    });

    render(<ThemeSwitch />);

    const moonIcon = screen.getByTestId('moon-icon');
    fireEvent.click(moonIcon);

    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });
});
