import { createClient } from '@/utils/supabase/server';

export async function getProfileData(username: string) {
  const supabase = createClient();

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (profileError) {
    console.error('Error fetching profile data:', profileError);
    return null;
  }

  return {
    ...profileData,
  };
}


