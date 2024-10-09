import { createClient } from '@/utils/supabase/client';
import toast from 'react-hot-toast';

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
    throw error;
  }

  console.log(data?.status);

  return { status: data?.status || 'inactive' };
};

export const updateFollowStatus = async (
  userID: string,
  targetUserID: string
): Promise<FollowResponse> => {
  const supabase = createClient();

  try {
    // Query the table to see if a connection already exists
    const { data: connection, error: selectError } = await supabase
      .from('connections')
      .select('status')
      .eq('user_id', userID)
      .eq('target_user_id', targetUserID)
      .single();

    // If no row exists, insert a new one with status 'active'
    if (selectError && selectError.code === 'PGRST116') {
      const { error: insertError } = await supabase
        .from('connections')
        .insert([
          { user_id: userID, target_user_id: targetUserID, status: 'active' },
        ]);

      if (insertError) throw new Error(insertError.message);

      return {
        status: 'active',
        success: true,
        message: 'You are now following this user.',
      };
    }

    if (selectError) {
      throw new Error(selectError.message); // Handle other unexpected errors
    }

    // Toggle existing status
    let newStatus: 'active' | 'inactive';
    console.log(connection.status);
    if (connection?.status === 'active') {
      newStatus = 'inactive';
    } else if (connection?.status === 'inactive') {
      newStatus = 'active';
    } else {
      throw new Error('Unexpected status value.');
    }
    console.log(newStatus);
    // Update the connection status in the database
    const { error: updateError } = await supabase
      .from('connections')
      .update({ status: newStatus })
      .eq('user_id', userID)
      .eq('target_user_id', targetUserID);

    if (updateError) throw new Error(updateError.message);

    return {
      status: newStatus,
      success: true,
      message:
        newStatus === 'active'
          ? 'You are now following this user.'
          : 'You have unfollowed this user.',
    };
  } catch (error) {
    console.error('Error toggling follow status:', error);
    return {
      status: 'inactive', // Default to inactive on error
      success: false,
      message: 'An unexpected error occurred.',
    };
  }
};
