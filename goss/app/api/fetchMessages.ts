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
