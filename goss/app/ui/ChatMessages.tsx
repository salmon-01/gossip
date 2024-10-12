"use client"
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMessages } from '../api/MessagesData';
import { useSessionContext } from '../context/SessionContext';


export default function ChatMessages({conversationId}) {
  const { data: session } = useSessionContext();
  const loggedInUserId = session?.profile?.user_id 

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ['conversationMessages', conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId, // 
  });

  
  if (messagesError) {
    return <div>Error loading messages: {messagesError.message}</div>;
  }
  if (isLoadingMessages) {
    return <div>Loading messages...</div>;
  }


  const messages = Array.isArray(messagesData) ? messagesData : [];


  return (
    <div className='flex flex-col space-y-2 p-4 overflow-auto h-full'>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-3 rounded-lg max-w-xs ${message.sender_id === loggedInUserId ? "bg-purple-400 text-white self-end" : "bg-gray-200 text-black self-start"}`}
        >
          <div>{message.content}</div>
          <div className='text-xs text-gray-500 mt-1'>{new Date(message.created_at).toLocaleString()} </div>
        </div>
      ))}
    </div>
  );
}
