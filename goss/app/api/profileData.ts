import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
export async function fetchpostData(user_id) {

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return posts;
}

export async function fetchProfileData(username) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)

    .single();

  if (error) throw error;
  return data;
}