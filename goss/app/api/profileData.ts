import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
export const fetchpostData = async (userId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      reactions (
        reaction,
        user_id
      ),
      profiles:profiles (
        user_id,
        display_name,
        profile_img,
        username
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
};

export async function fetchProfileData(username:string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)

    .single();

  if (error) throw error;
  return data;
}