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

export const fetchFollowersUsername = async (
  username: string
): Promise<Follower[]> => {
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

// export const fetchFollowing = async (
//   username: string
// ): Promise<Following[]> => {
//   const supabase = createClient();

//   try {
//     // First, get the user ID from the username
//     const { data: userData, error: userError } = await supabase
//       .from('profiles')
//       .select('user_id')
//       .eq('username', username)
//       .single();

//     if (userError) throw new Error(`User not found: ${userError.message}`);
//     if (!userData) throw new Error('User not found');

//     const userId = userData.user_id;
//     console.log(userId);

//     // Fetch users the person is following
//     const { data: followingData, error: followingError } = await supabase
//       .from('connections')
//       .select(
//         `
//         user_id,
//         created_at,
//         status,
//         profiles:user_id (
//           username,
//           display_name,
//           profile_img
//         )
//       `
//       )
//       .eq('target_user_id', userId) // Here we filter by target_user_id to get people this user is following
//       .eq('status', 'active')
//       .order('created_at', { ascending: false });

//     if (followingError) throw followingError;
//     console.log(followingData);

//     return followingData as Following[];
//   } catch (error) {
//     console.error('Error fetching following:', error);
//     throw error; // Re-throw the error to be handled by the calling function
//   }
// };

export const fetchFollowingById = async (
  userId: string
): Promise<Following[]> => {
  const supabase = createClient();

  try {
    const { data: followingData, error: followingError } = await supabase
      .from('connections')
      .select(
        `
        user_id,
        created_at,
        status,
        profiles:user_id (
          username,
          display_name,
          profile_img
        )
      `
      )
      .eq('target_user_id', userId) // Here we filter by target_user_id to get people this user is following
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (followingError) throw followingError;
    console.log(followingData);

    return followingData as Following[];
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};
