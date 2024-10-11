import { createClient } from '@/utils/supabase/client';

type Follower = {
  target_user_id: string;
  created_at: string;
  status: string;
  profiles: {
    username: string;
    display_name: string | null;
    profile_img: string | null;
  } | null;
};

export const fetchFollowers = async (username: string): Promise<Follower[]> => {
  const supabase = createClient();

  try {
    // First, get the user ID from the username
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('username', username)
      .single();

    if (userError) throw new Error(`User not found: ${userError.message}`);
    if (!userData) throw new Error('User not found');

    const userId = userData.user_id;
    console.log(userId);

    // Then, fetch followers using the user ID
    const { data: followersData, error: followersError } = await supabase
      .from('connections')
      .select(
        `
        target_user_id,
        created_at,
        status
        profiles:target_user_id (
          username,
          display_name,
          profile_img
        )
      `
      )
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (followersError) throw followersError;
    console.log(followersData);

    return followersData as Follower[];
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};
