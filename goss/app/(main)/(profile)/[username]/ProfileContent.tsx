 'use client';
import React, { useState } from 'react'
import VoiceNoteList from './VoiceNoteList'
import VoiceReplyList from './VoiceReplyList'
import ProfileNav from './profileNav'



export default function ProfileContent({ voiceNotes, user }) {
  const [activeTab, setActiveTab] = useState('posts')

  return (
    <>
     <ProfileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab ==="posts" && <VoiceNoteList voiceNotes={voiceNotes} user={user} />}
      {activeTab ==="replies" && <VoiceReplyList />}
      
    </>
  )
}
