import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  NotificationsProvider,
  useGlobalNotifications,
} from './NotificationsContext';
import useNotifications from '../hooks/useNotifications';

// Mock the useNotifications hook
vi.mock('../hooks/useNotifications');

// Test component to use the context
const TestComponent = () => {
  const { notifications } = useGlobalNotifications();
  return <div>{notifications ? 'Has Notifications' : 'No Notifications'}</div>;
};

describe.only('NotificationsContext', () => {
  it('should provide notifications data to children', () => {
    // Mocking the return value of useNotifications hook
    const mockUseNotifications = {
      notifications: ['Notification 1', 'Notification 2'],
      addNotification: vi.fn(),
      removeNotification: vi.fn(),
    };

    (useNotifications as vi.Mock).mockReturnValue(mockUseNotifications);

    // Render the provider with the TestComponent as a child
    render(
      <NotificationsProvider>
        <TestComponent />
      </NotificationsProvider>
    );

    // Expect the TestComponent to render content based on the mock notifications
    expect(screen.getByText('Has Notifications')).toBeInTheDocument();
  });

  it('should throw an error if useGlobalNotifications is used outside of NotificationsProvider', () => {
    // Spy on the error to avoid polluting the test output
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // This should throw the error because it’s not wrapped in a NotificationsProvider
    const TestErrorComponent = () => {
      expect(() => useGlobalNotifications()).toThrowError(
        'useGlobalNotifications must be used within a NotificationsProvider'
      );
      return null;
    };

    render(<TestErrorComponent />);

    // Clean up the console error spy
    consoleErrorSpy.mockRestore();
  });
});
