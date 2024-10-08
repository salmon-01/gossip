// src/components/NavBarWrapper.tsx (Server Component)

import { createClient } from '@/utils/supabase/server';
import NavBar from './NavBar';

export default async function NavBarWrapper() {
  const supabase = createClient();

  // Fetch the user from the session
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("Error fetching user:", userError);
    return <NavBar username={null} />;
  }

  // Fetch user data from the server-side
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('user_id', user?.id) // Match against user?.id
    .single();

  const username = data?.username || null;

  return <NavBar username={username} />;
}
