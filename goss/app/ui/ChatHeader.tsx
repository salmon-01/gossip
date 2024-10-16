"use client"
import React from 'react'
import Link from 'next/link'
import { fetchConversationProfile } from '../api/MessagesData'
import { useQuery } from '@tanstack/react-query'
import Loading from '../(main)/loading'
import { ChatMessagesProps } from '../types'


export default function ChatHeader({ conversationId, loggedInUserId }: ChatMessagesProps) {

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
    return <Loading />; // Display loading state for profile data
  }



  return (
    <div className="p-3  sticky top-0 flex items-center shadow dark:shadow-xl bg-white dark:bg-darkModePrimaryBackground z-20">
      <Link href="/chats" className="flex items-center text-lg font-bold text-gray-700 hover:text-gray-900 transition duration-200">

        <span className="text-3xl mb-1 mr-2 dark:text-darkModeHeader dark:hover:text-darkhoverBackground">{'\u2190'}</span>
      </Link>


      <div className="flex items-center ml-4">
        <Link href={`/${profileData?.username}`}>
          <img
            src={profileData?.profile_img}
            className="w-10 h-10 rounded-full mr-2"
            alt="Profile"
          />
        </Link>
        <div>
          <h2 className="text-lg font-bold text-black dark:text-darkModeParaText">{profileData?.display_name}</h2>
          <p className="text-sm text-gray-500 dark:text-darkModeParaText">@{profileData?.username}</p>
        </div>
      </div>

    </div>


  )
}
