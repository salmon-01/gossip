import { createClient } from '@/utils/supabase/client';

interface FollowResponse {
  status: 'active' | 'inactive';
  success: boolean;
  message: string;
}

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
  targetUserID: string
): Promise<FollowResponse> => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.rpc('toggle_follow_status', {
      follower_id: userID,
      following_id: targetUserID,
    });

    if (error) throw error;

    return {
      status: data.new_status,
      success: true,
      message:
        data.new_status === 'active'
          ? 'You are now following this user.'
          : 'You have unfollowed this user.',
    };
  } catch (error) {
    console.error('Error toggling follow status:', error);
    return {
      status: 'inactive',
      success: false,
      message: 'An unexpected error occurred.',
    };
  }
};
