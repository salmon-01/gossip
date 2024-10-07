import { createClient } from '@/utils/supabase/server';

// Server-side function to fetch profile data based on the username
export async function getProfileData(username: string) {
  const supabase = createClient();

  // Fetch user profile from the 'profiles' table using username
  const { data, error } = await supabase
    .from('profiles')
    .select('*') // Select the necessary columns
    .eq('username', username) // Match against username
    .single(); // Fetch a single row

  if (error) {
    console.error("Error fetching profile data:", error);
    return null; // Handle error appropriately
  }

  return data;
}
