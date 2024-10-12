'use client'
import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
import { useSessionContext } from '../context/SessionContext';

export default function ChatInput({ conversationId }) {
  const [message, setMessage] = useState("")

  const { data: session } = useSessionContext();
  const loggedInUserId = session?.profile.user_id

  async function handleSubmit(e) {
    e.preventDefault();

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
    }



  }


  return (
    <form onSubmit={handleSubmit} className="flex mb-10 items-center w-full">
      <input
        type="text"
        placeholder='Chat'
        className='flex-grow p-3 rounded-xl bg-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className='ml-2 p-3 rounded-xl bg-purple-500 text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
      >
        Send
      </button>
    </form>
  );
}
