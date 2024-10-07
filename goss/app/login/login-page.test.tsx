import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from './page'; // Adjust the import path to your actual component

// Define the mockPush function outside so it can be used in the mock
const mockPush = vi.fn();

// Mock useRouter from next/navigation and make sure mockPush is properly returned
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush, // Mock the push function
  }),
}));

test('handles demo login', async () => {
  // Reset the mock to ensure no previous calls interfere
  mockPush.mockClear();

  // Render the component
  render(<Page />);

  // Click the "Quick Demo Login" button
  const demoButton = screen.getByRole('button', { name: /quick demo login/i });
  fireEvent.click(demoButton);

  // Use waitFor to wait for the asynchronous router.push call
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/home');
  });
});
