import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export async function fetchMessages(conversationId:string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .not('content', 'is', null)  
    .neq('content', '');  

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


export async function fetchUserConversations(loggedInUserId:string) {
  if (!loggedInUserId) {
    throw new Error("Logged in user ID is missing"); // Early return if loggedInUserId is undefined
  }
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participant_1_profile: profiles!participant_1_fkey (*),
      participant_2_profile: profiles!participant_2_fkey (*)
    `)
    .or(`participant_1.eq.${loggedInUserId},participant_2.eq.${loggedInUserId}`)
    .order('last_message_time', { ascending: false })
    .not('last_message', 'is', null)  
    .neq('last_message', ''); 
 

   

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createConversation(loggedInUserId:string, otherUserId:string) {

  const { data: existingConversation, error: checkError } = await supabase
    .from('conversations')
    .select('*')
    .or(`participant_1.eq.${loggedInUserId},participant_2.eq.${loggedInUserId}`)
    .or(`participant_1.eq.${otherUserId},participant_2.eq.${otherUserId}`)
    .limit(1);

  if (checkError) {
    throw new Error(checkError.message);
  }

  
  if (existingConversation && existingConversation.length > 0) {
    return existingConversation[0]; // Return the existing conversation
  }

  
  const { data: newConversationData, error: conversationError } = await supabase
    .from('conversations')
    .insert([{ participant_1: loggedInUserId, participant_2: otherUserId }])
    .select();

  if (conversationError) {
    throw new Error(conversationError.message);
  }

  if (!newConversationData || newConversationData.length === 0) {
    throw new Error("Failed to create conversation: No data returned.");
  }

  const conversationId = newConversationData[0].id;

  
  const initialMessage = ""; 
  const { error: messageError } = await supabase
    .from('messages')
    .insert([{ conversation_id: conversationId, sender_id: loggedInUserId, content: initialMessage }]);

  if (messageError) {
    throw new Error(messageError.message);
  }

  // Return the newly created conversation
  return newConversationData[0];
}


export async function fetchConversationProfile(loggedInUserId:string, conversationId:string) {
  if (!loggedInUserId) {
    throw new Error("Logged in user ID is missing"); // Early return if loggedInUserId is undefined
  }

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participant_1_profile: profiles!participant_1_fkey (*),
      participant_2_profile: profiles!participant_2_fkey (*)
    `)
    .eq('id', conversationId) 
    .single(); 

  if (error) {
    throw new Error(error.message);
  }

  // Determine which profile belongs to the other participant
  const otherParticipantProfile = data.participant_1 === loggedInUserId 
    ? data.participant_2_profile 
    : data.participant_1_profile;

  return otherParticipantProfile; 
}
