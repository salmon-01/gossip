import { useQuery } from '@tanstack/react-query';
import { createClient } from '../../utils/supabase/client';

const supabase = createClient();

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      if (!session) return null;

      // Fetch additional user data if needed
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        ...session,
        profile,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    // cacheTime: 1000 * 60 * 30, // 30 minutes
  });
}
