import React from 'react'
import ChatHeader from '@/app/ui/ChatHeader'
import ChatMessages from '@/app/ui/ChatMessages'
import ChatInput from '@/app/ui/ChatInput'


export default function Chat({params}) {
  const {conversationId} = params


  
  return (
    <>
    <div className="flex flex-col h-[97vh] bg-white">
      <ChatHeader />
      <div className="flex-grow overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
        <ChatMessages conversationId={conversationId}/>
      </div>
      <div className="mt-auto">
        <ChatInput conversationId={conversationId} />
      </div>
    </div>

  </>
  )
}
