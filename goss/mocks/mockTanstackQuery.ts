import { vi } from 'vitest';

export const createMockQueryResult = (
  data: any,
  isLoading = false,
  error: any = null
) => ({
  data,
  isLoading,
  error,
  isError: !!error,
  isSuccess: !isLoading && !error,
  refetch: vi.fn(),
  isFetching: false,
  status: isLoading ? 'loading' : error ? 'error' : 'success',
});

export const createMockQueryClient = () => ({
  setQueryData: vi.fn(),
  invalidateQueries: vi.fn(),
  refetchQueries: vi.fn(),
});

export const mockUseQuery = vi.fn();
export const mockUseQueryClient = vi.fn();

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: mockUseQuery,
    useQueryClient: mockUseQueryClient,
  };
});
