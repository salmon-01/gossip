"use client"
import React from 'react'
import Link from 'next/link'
import { fetchConversationProfile} from '../api/MessagesData'
import { useQuery } from '@tanstack/react-query'
import Loading from '../(main)/loading'



export default function ChatHeader({conversationId, loggedInUserId}) {

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
    return <Loading/>; // Display loading state for profile data
  }
  
console.log(profileData)

  return (
<div className="p-3 rounded-md sticky top-0 flex items-center shadow bg-white z-20">
  <Link href="/chats" className="flex items-center text-lg font-bold text-gray-700 hover:text-gray-900 transition duration-200">

    <span className="text-3xl mb-1 mr-2">{'\u2190'}</span>
  </Link>

  
  <div className="flex items-center ml-4"> 
  <img
    src={profileData?.profile_img}
    className="w-10 h-10 rounded-full mr-2" 
    alt="Profile"
  />
  <div>
    <h2 className="text-lg font-bold text-black">{profileData?.display_name}</h2>
    <p className="text-sm text-gray-500">@{profileData?.username}</p>
  </div>
</div>

</div>


  )
}
