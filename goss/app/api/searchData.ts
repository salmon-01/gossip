import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface Profile {
  user_id: string;
  display_name: string;
  username: string;
  profile_img: string;
}

export   const searchData = async (query: string): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('display_name', `%${query}%`);

  if (error) {
    console.error('Error searching profiles:', error);
    throw error;
  }
  return data || [];
};