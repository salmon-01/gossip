"use client"
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMessages } from '../api/MessagesData';
import Loading from '../(main)/loading';
import { useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export default function ChatMessages({ conversationId, loggedInUserId }) {
  const queryClient = useQueryClient();
  const messagesEndRef =  useRef<HTMLDivElement | null>(null); 


  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ['conversationMessages', conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId,
  });

  useEffect(() => {
    const messageSubscription = supabase
      .channel('realtime:messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        console.log('New message received: ', payload.new);
        queryClient.invalidateQueries({ queryKey: ['conversationMessages', conversationId] });
      })
      .subscribe();


    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [conversationId, queryClient]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messagesData]);


  if (messagesError) {
    return <div>Error loading messages: {messagesError.message}</div>;
  }
  if (isLoadingMessages) {
    return <Loading />;
  }


  const messages = Array.isArray(messagesData) ? messagesData : [];


  return (
    <div className='flex flex-col space-y-3 p-4 overflow-auto h-full  '>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-3 rounded-lg max-w-xs ${message.sender_id === loggedInUserId
              ? "bg-purple-700 text-white self-end shadow-md"
              : "bg-purple-100 shadow-md text-black self-start"
            }`}
        >
          <div>{message.content}</div>
          <div className='text-xs mt-3 text-right'>
            {new Date(message.created_at).toLocaleString('en-GB', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>

  );
}

