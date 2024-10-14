// import { renderHook, waitFor } from '@testing-library/react';
// import { vi } from 'vitest';
// import useNotifications from './useNotifications';
// import { createClient } from '../../utils/supabase/client';
// import toast from 'react-hot-toast';
// import { Notification } from '../types';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// vi.mock('../../utils/supabase/client', () => ({
//   createClient: vi.fn(),
// }));

// vi.mock('react-hot-toast', () => ({
//   default: {
//     toast: vi.fn(),
//   },
// }));

// const createTestQueryClient = () =>
//   new QueryClient({
//     defaultOptions: {
//       queries: {
//         retry: false,
//       },
//     },
//   });

// function createWrapper() {
//   const testQueryClient = createTestQueryClient();
//   return ({ children }: { children: React.ReactNode }) => {
//     return QueryClientProvider({ client: testQueryClient, children });
//   };
// }

// describe('useNotifications hook', () => {
//   let supabaseMock: any;

//   beforeEach(() => {
//     supabaseMock = {
//       from: vi.fn().mockReturnThis(),
//       select: vi.fn().mockReturnThis(),
//       eq: vi.fn().mockReturnThis(),
//       order: vi.fn().mockResolvedValue({ data: [], error: null }),
//       auth: {
//         getUser: vi.fn().mockResolvedValue({
//           data: { user: { id: 'test-user-id' } },
//           error: null,
//         }),
//       },
//       channel: vi.fn().mockReturnThis(),
//       on: vi.fn().mockReturnThis(),
//       subscribe: vi.fn().mockReturnThis(),
//       removeChannel: vi.fn(),
//     };

//     (createClient as vi.Mock).mockReturnValue(supabaseMock);
//   });

//   afterEach(() => {
//     vi.clearAllMocks();
//   });

//   test('should fetch user ID on mount', async () => {
//     const { result } = renderHook(() => useNotifications(), {
//       wrapper: createWrapper(),
//     });

//     await waitFor(() => {
//       expect(supabaseMock.auth.getUser).toHaveBeenCalled();
//       expect(result.current.userId).toBe('test-user-id');
//     });
//   });

//   test('should fetch notifications for the authenticated user', async () => {
//     const mockNotifications: Notification[] = [
//       // ... your mock notifications
//     ];

//     supabaseMock.order.mockResolvedValue({
//       data: mockNotifications,
//       error: null,
//     });

//     const { result } = renderHook(() => useNotifications(), {
//       wrapper: createWrapper(),
//     });

//     await waitFor(() => {
//       expect(result.current.notifications).toEqual(mockNotifications);
//       expect(result.current.isLoading).toBe(false);
//     });

//     expect(supabaseMock.auth.getUser).toHaveBeenCalled();
//   });

//   test('should handle loading state', async () => {
//     const { result } = renderHook(() => useNotifications(), {
//       wrapper: createWrapper(),
//     });

//     expect(result.current.isLoading).toBe(true);
//     expect(result.current.notifications).toBeNull();
//   });

//   test('should handle error state', async () => {
//     const error = new Error('Failed to fetch notifications');
//     supabaseMock.order.mockResolvedValue({ data: null, error });

//     const { result } = renderHook(() => useNotifications(), {
//       wrapper: createWrapper(),
//     });

//     await waitFor(() => {
//       expect(result.current.error).toBe(error);
//       expect(result.current.notifications).toBeNull();
//     });
//   });

//   test('should remove the real-time channel on cleanup', async () => {
//     const { unmount } = renderHook(() => useNotifications(), {
//       wrapper: createWrapper(),
//     });

//     unmount();

//     await waitFor(() => {
//       expect(supabaseMock.removeChannel).toHaveBeenCalled();
//     });
//   });
// });
