"use client"
import React from 'react'
import ChatHeader from '@/app/ui/ChatHeader'
import ChatMessages from '@/app/ui/ChatMessages'
import ChatInput from '@/app/ui/ChatInput'
import { useSessionContext } from '@/app/context/SessionContext'

export default function Chat({params}) {
  const {conversationId} = params

  const { data: session } = useSessionContext();
  const loggedInUserId = session?.profile.user_id


  
  return (
    <>
<div className="flex flex-col h-[calc(100vh-64px)] lg:ml-3 w-full bg-gray-100 dark:bg-darkModeSecondaryBackground">
  <ChatHeader conversationId={conversationId} loggedInUserId={loggedInUserId} />
  
  <div className="flex-grow overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
    <ChatMessages conversationId={conversationId} loggedInUserId={loggedInUserId} />
  </div>
  
  <div className="mt-auto">
    <ChatInput conversationId={conversationId} loggedInUserId={loggedInUserId} />
  </div>
</div>


  </>
  )
}
