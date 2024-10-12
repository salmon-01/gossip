"use client"
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchUserConversations } from '@/app/api/MessagesData'
import { useSessionContext } from '@/app/context/SessionContext'
import Link from 'next/link'


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
      <h2 className='text-center p-2 font-bold text-2xl sticky top-0'>Messages</h2>
      {Conversations?.map((conversation) => {
        const otherParticipant = conversation.participant_1 === loggedInUserId
          ? conversation.participant_2_profile
          : conversation.participant_1_profile;

        return (
          <div key={conversation.id} className="flex items-center p-4 border-b mb-3  border-gray-200 hover:bg-gray-200 transition duration-200">
            <Link href={`/chats/${conversation.id}`}>
              <div className="flex items-center w-[90lvw] cursor-pointer ">
                <img
                  src={otherParticipant.profile_img}
                  alt={otherParticipant.display_name}
                  className="w-14 h-14 rounded-full mr-4"
                />

                <div className="flex-1">
                  <div className="flex justify-between items-center ">
                  
                    <span className="font-semibold text-gray-800  ">{otherParticipant.display_name}</span>
                    
                    <span className="text-gray-400 text-sm ">{new Date(conversation.last_message_time).toDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{conversation.last_message}</p>
                </div>
              </div>
            </Link>
          </div>

        );
      })}
    </div>
  )
}
