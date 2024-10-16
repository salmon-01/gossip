'use client'
import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
import { useQueryClient } from '@tanstack/react-query';
import { FaRegPaperPlane } from "react-icons/fa";
import { fetchConversationProfile } from '../api/MessagesData';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './LoadingSpinner';
import { ChatMessagesProps } from '../types';

export default function ChatInput({ conversationId, loggedInUserId}: ChatMessagesProps) {
  const [message, setMessage] = useState("")
  const queryClient = useQueryClient(); 

  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ['conversationProfile', loggedInUserId, conversationId],
    queryFn: () => fetchConversationProfile(loggedInUserId, conversationId),
    enabled: !!loggedInUserId && !!conversationId,
  });

  if (profileError) {
    return <div>Error loading profile: {profileError.message}</div>; // Display profile error
  }
  if (isLoadingProfile) {
    return <LoadingSpinner />; // Display loading state for profile data
  }




  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (message.trim() === "") {
      return; 
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([
        { content: message, conversation_id: conversationId, sender_id: loggedInUserId },
      ])
      .eq('conversation_id', conversationId)

    if (error) {
      console.error('Error inserting message:', error);
    } else {
      setMessage('');
      
      const { data:notification, error:notificationError } = await supabase
      .from('notifications')
      .insert([
        { type: "message", user_id:profileData?.user_id , sender_id: loggedInUserId },
      ])


    if (notificationError) {
      console.error('Error inserting notification:', notificationError);
    } 

      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          last_message: message,
          last_message_time: new Date().toISOString(), 
        })
        .eq('id', conversationId); 


      if (updateError) {
        console.error('Error updating conversation:', updateError);
      }

      queryClient.invalidateQueries({ queryKey: ['conversationMessages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['userConversations', loggedInUserId] });
     
    }



  }


  return (
    <form onSubmit={handleSubmit} className="flex  dark:bg-darkModePrimaryBackground p-2 items-center w-full ">
      <input
        type="text"
        placeholder='Write a message...'
        className='flex-grow p-3 rounded-xl bg-white dark:text-darkModeParaText dark:bg-darkModeSecondaryBackground lg:ml-3 md:ml-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-darkModePrimaryBtn'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className='ml-2 p-3 rounded-full bg-darkModeSecondaryBtn dark:bg-darkModePrimaryBtn text-white hover:bg-darkModePostBackground focus:outline-none focus:ring-0 focus:ring-purple-400'
      >
        <FaRegPaperPlane />

      </button>
    </form>
  );
}
