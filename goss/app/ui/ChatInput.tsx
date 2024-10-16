'use client'
import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
import { useQueryClient } from '@tanstack/react-query';
import { FaRegPaperPlane } from "react-icons/fa";

export default function ChatInput({ conversationId, loggedInUserId}) {
  const [message, setMessage] = useState("")
  const queryClient = useQueryClient(); 



  async function handleSubmit(e) {
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
      // Clear the input field after sending the message

      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          last_message: message,
          last_message_time: new Date().toISOString(), // Use ISO string for the timestamp
        })
        .eq('id', conversationId); // Ensure you are using the correct field to match


      if (updateError) {
        console.error('Error updating conversation:', updateError);
      }

      queryClient.invalidateQueries({ queryKey: ['conversationMessages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['userConversations', loggedInUserId] });
     
    }



  }


  return (
    <form onSubmit={handleSubmit} className="flex bg-white dark:bg-darkModePrimaryBackground p-2 items-center w-full ">
      <input
        type="text"
        placeholder='Write a message...'
        className='flex-grow p-3 rounded-xl bg-purple-50 dark:text-darkModeParaText dark:bg-darkModeSecondaryBackground lg:ml-3 md:ml-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-darkModePrimaryBtn'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className='ml-2 p-3 rounded-full bg-purple-700 dark:bg-darkModePrimaryBtn text-white hover:bg-purple-900 focus:outline-none focus:ring-0 focus:ring-purple-400'
      >
        <FaRegPaperPlane />

      </button>
    </form>
  );
}
