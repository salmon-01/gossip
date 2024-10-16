"use client"
import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchUserConversations } from '@/app/api/MessagesData'
import { useSessionContext } from '@/app/context/SessionContext'
import Link from 'next/link'
import Loading from '../loading'
import { formatDate } from './time'
import { BsEnvelopePlus } from "react-icons/bs";




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

  if (Conversations?.length === 0) {
    return (
      <div>
        <div className='flex justify-between items-center px-4 py-6 sticky top-0'>
          <h2 className='font-bold text-2xl'>Messages</h2>
          <Link href="chats/compose" className='text-xl'><BsEnvelopePlus /></Link>
        </div>
        <p className="text-4xl font-bold text-black block ml-10">
          Welcome to your<br />inbox!
        </p>
        <Link href="chats/compose">
          <button className='bg-purple-600 text-white py-2 px-5 mt-5 rounded-full mx-auto block hover:bg-purple-700'>
            Write a message
          </button>
        </Link>
      </div>
    );
  }

  if (error) {
    return <div>Error loading messages: {error.message}</div>;
  }
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className='flex justify-between items-center px-4 py-6 sticky top-0'>
        <h2 className='font-bold text-2xl dark:text-darkModeHeader mx-auto'>Messages</h2>
        <Link href="chats/compose" className='text-xl dark:text-darkModeHeader'><BsEnvelopePlus /></Link>
      </div>

      {Conversations?.map((conversation) => {
        const otherParticipant = conversation.participant_1 === loggedInUserId
          ? conversation.participant_2_profile
          : conversation.participant_1_profile;

        return (
          <div key={conversation.id} className="flex items-center relative p-2 mx-auto  bg-white rounded-md w-11/12 mb-3 lg:w-9/12 md:w-9/12 border-gray-200 hover:bg-darkModeParaText dark:bg-darkModeSecondaryBackground dark:hover:bg-blue-900 transition duration-200">
            <Link href={`/chats/${conversation.id}`}>
              <div className="flex items-center w-full cursor-pointer ">
                <img
                  src={otherParticipant.profile_img}
                  alt={otherParticipant.display_name}
                  className="w-14 h-14 rounded-full mr-4"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center w-[60lvw] max-w-[60lvw]  lg:max-w-[40lvw]">
                    <span className="font-semibold text-customPurple dark:text-darkModeParaText">
                      {otherParticipant.display_name}
                    </span>
                    <span className="text-gray-600 text-sm dark:text-darkModeParaText absolute top-4 right-4 ">
                      {formatDate(new Date(conversation.last_message_time).setHours(new Date(conversation.last_message_time).getHours() + 1))}
                    </span>

                  </div>
                  <p className="text-customBlueGray text-sm mt-1 max-w-[60lvw] truncate dark:text-darkModeParaText lg:max-w-[38lvw]">
                    {conversation.last_message}
                  </p>
                </div>

              </div>
            </Link>
          </div>

        );
      })}
    </div>
  )
}



