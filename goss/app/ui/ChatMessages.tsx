"use client"
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMessages } from '../api/MessagesData';
import Loading from '../(main)/loading';
import { useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { groupMessagesByDate } from '../(main)/chats/time';
import { formatMessageTime } from '../(main)/chats/time';
import { ChatMessagesProps } from '../types';

const supabase = createClient();

export default function ChatMessages({ conversationId, loggedInUserId }: ChatMessagesProps) {
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);


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
  const groupedMessages = groupMessagesByDate(messages);



  return (
    <div className="flex flex-col space-y-3 p-4 overflow-auto h-full">
      {Object.keys(groupedMessages).map((dateKey) => (
        <div key={dateKey} className="space-y-2">
          {/* Banner for the date */}
          <div className="text-center text-gray-700 mx-auto rounded-xl text-xs bg-white w-fit py-1 px-3 shadow-md">
            {dateKey}
          </div>
          {/* Render the messages for this date */}
          {groupedMessages[dateKey].map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === loggedInUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs min-w-20 lg:min-w-28 ${message.sender_id === loggedInUserId
                  ? 'bg-darkModePostBackground dark:bg-darkChatBackground dark:text-darkModeParaText lg:mr-4 text-white shadow-md'
                  : 'bg-white dark:bg-darkModePrimaryBtn dark:text-darkModeParaText lg:ml-4 shadow-md text-black'
                  }`}
              >
                <div>{message.content}</div>
                <div className="text-xs mt-1 text-right">
                  {formatMessageTime(message.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      {/* Scroll to the bottom of the chat */}
      <div ref={messagesEndRef} />
    </div>


  );
}







