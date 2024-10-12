import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export async function fetchMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)


  if (error) {
    throw new Error(error.message);
  }

  return data;

}

export async function fetchUserConversations(loggedInUserId) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participant_1_profile: profiles!participant_1_fkey (*),
      participant_2_profile: profiles!participant_2_fkey (*)
    `)
    .or(`participant_1.eq.${loggedInUserId},participant_2.eq.${loggedInUserId}`);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

