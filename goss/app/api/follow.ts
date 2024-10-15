import { createClient } from '@/utils/supabase/client';

interface FollowResponse {
  status: 'active' | 'inactive';
  success: boolean;
  message: string;
}

// Function to fetch the user IDs the current user is following
export const fetchFollowing = async (userId: string): Promise<Following[]> => {
  const supabase = createClient();

  try {
    // Fetch the user IDs that this user is following
    const { data: followingData, error: followingError } = await supabase
      .from('connections')
      .select(
        `
        target_user_id,
        created_at,
        status,
        profiles:target_user_id (
          username,
          display_name,
          profile_img
        )
      `
      ) // Select `target_user_id` and profile info
      .eq('user_id', userId) // Filter by the current user's ID (who they are following)
      .eq('status', 'active') // Only get active connections
      .order('created_at', { ascending: false });

    if (followingError) throw followingError;

    // Transform the data to flatten the structure
    const transformedData = followingData.map((item: any) => ({
      target_user_id: item.target_user_id,
      created_at: item.created_at,
      status: item.status,
      username: item.profiles.username,
      display_name: item.profiles.display_name,
      profile_img: item.profiles.profile_img,
    }));

    return transformedData as Following[];
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Function to fetch the user IDs of the people following the current user
export const fetchFollowers = async (userId: string): Promise<Follower[]> => {
  const supabase = createClient();

  try {
    // Fetch the user IDs that are following the current user
    const { data: followersData, error: followersError } = await supabase
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
      ) // Select `user_id` (the follower) and profile info
      .eq('target_user_id', userId) // Filter by the current user's ID (who they are being followed by)
      .eq('status', 'active') // Only get active connections
      .order('created_at', { ascending: false });

    if (followersError) throw followersError;

    // Transform the data to flatten the structure
    const transformedData = followersData.map((item: any) => ({
      user_id: item.user_id, // The ID of the follower
      created_at: item.created_at,
      status: item.status,
      username: item.profiles.username,
      display_name: item.profiles.display_name,
      profile_img: item.profiles.profile_img,
    }));

    return transformedData as Follower[];
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Function to fetch the user IDs of the people following the current user
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

    // Fetch the people following the user (followers)
    const { data: followersData, error: followersError } = await supabase
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
      .eq('target_user_id', userId) // Filter by the current user's ID as the target
      .eq('status', 'active') // Only get active followers
      .order('created_at', { ascending: false });

    if (followersError) throw followersError;

    // Transform the data to flatten the structure
    const transformedData = followersData.map((item: any) => ({
      user_id: item.user_id, // The ID of the follower
      created_at: item.created_at,
      status: item.status,
      username: item.profiles?.username ?? '', // Handle cases where profiles might be null
      display_name: item.profiles?.display_name ?? null,
      profile_img: item.profiles?.profile_img ?? null,
    }));

    return transformedData as Follower[];
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Function to fetch the user IDs of the people the current user is following
export const fetchFollowingUsername = async (
  username: string
): Promise<Following[]> => {
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

    // Fetch the people the user is following
    const { data: followingData, error: followingError } = await supabase
      .from('connections')
      .select(
        `
        target_user_id,
        created_at,
        status,
        profiles:target_user_id (
          username,
          display_name,
          profile_img
        )
      `
      )
      .eq('user_id', userId) // Filter by the current user's ID as the person who is following others
      .eq('status', 'active') // Only get active followings
      .order('created_at', { ascending: false });

    if (followingError) throw followingError;

    // Transform the data to flatten the structure
    const transformedData = followingData.map((item: any) => ({
      target_user_id: item.target_user_id, // The ID of the person the current user is following
      created_at: item.created_at,
      status: item.status,
      username: item.profiles?.username ?? '', // Handle cases where profiles might be null
      display_name: item.profiles?.display_name ?? null,
      profile_img: item.profiles?.profile_img ?? null,
    }));

    return transformedData as Following[];
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

export const fetchFollowStatus = async (
  userId: string,
  targetUserId: string
) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('connections')
    .select('status')
    .eq('user_id', userId)
    .eq('target_user_id', targetUserId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching follow status:', error);
    throw error;
  }

  return { status: data?.status || 'inactive' };
};

export const updateFollowStatus = async (
  userID: string,
  targetUserID: string,
  targetUserName: string
): Promise<FollowResponse> => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.rpc('toggle_follow_status', {
      follower_id: userID,
      following_id: targetUserID,
    });

    if (error) throw error;

    const newStatus = data.new_status;
    const isFollowing = newStatus === 'active';

    // If the new status is following, send a notification
    if (isFollowing) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([{ user_id: targetUserID, sender_id: userID, type: 'follow' }])
        .select();

      if (notificationError) throw notificationError;
    }
    return {
      status: data.new_status,
      success: true,
      message:
        data.new_status === 'active'
          ? `You are now following ${targetUserName}.`
          : `You have unfollowed ${targetUserName}.`,
    };
  } catch (error) {
    console.error(
      'Error toggling follow status or adding notification:',
      error
    );
    return {
      status: 'inactive',
      success: false,
      message: 'An unexpected error occurred.',
    };
  }
};
