import { createClient } from '@/utils/supabase/server';

// Server-side function to fetch profile data based on the username
export async function getProfileData(username: string) {
  const supabase = createClient();

  // Fetch user profile from the 'profiles' table using username
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (profileError) {
    console.error("Error fetching profile data:", profileError);
    return null;
  }

  // Fetch the user metadata (displayname) from the Supabase Auth system
  // const { data: userData, error: userError } = await supabase.auth.getUser();

  // if (userError) {
  //   console.error("Error fetching user metadata:", userError);
  //   return null; // Handle error appropriately
  // }
  //console.log(userData)

  return {
    ...profileData,
    //displayname: userData?.user?.user_metadata?.display_name || null, // Add displayname from the user metadata
  };
}

