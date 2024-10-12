"use client"
import React from 'react'
import Link from 'next/link'
import { fetchConversationProfile} from '../api/MessagesData'
import { useQuery } from '@tanstack/react-query'



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
    return <div>Loading profile...</div>; // Display loading state for profile data
  }
  
console.log(profileData)

  return (
<div className="p-3 rounded-md sticky top-0 flex items-center shadow bg-white z-20">
  <Link href="/chats" className="flex items-center text-lg font-bold text-gray-700 hover:text-gray-900 transition duration-200">

    <span className="text-3xl mr-2">{'\u2190'}</span>Back
  </Link>

  
  <div className="flex items-center ml-4"> 
    <img
      src={profileData?.profile_img}
      className="w-10 h-10 rounded-full mr-2" 
      alt="Profile"
    />
    <h2 className="text-lg font-bold text-gray-800">{profileData?.display_name}</h2>
  </div>
</div>


  )
}
