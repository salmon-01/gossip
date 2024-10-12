"use client"
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchUserConversations } from '@/app/api/MessagesData'
import { useSessionContext } from '@/app/context/SessionContext'


export default function ChatsPage() {

  const { data: session } = useSessionContext();
  const loggedInUserId = session?.profile.user_id 


    const {
    data: Conversations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userConversations', loggedInUserId],
    queryFn: () => fetchUserConversations(loggedInUserId),
      
  });

  console.log(Conversations)
  if (error) {
    return <div>Error loading messages: {error.message}</div>;
  }
  if (isLoading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div>
    {Conversations?.map((conversation) => {
      const otherParticipant = conversation.participant_1 === loggedInUserId
        ? conversation.participant_2_profile
        : conversation.participant_1_profile;

      return (
        <div key={conversation.id}>
          <span>{otherParticipant.display_name}</span>
          <span>@{otherParticipant.username}</span>
        </div>
      );
    })}
  </div>
  )
}
