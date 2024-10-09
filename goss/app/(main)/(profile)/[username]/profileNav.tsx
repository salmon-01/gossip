'use client';

import React from 'react'
import Link from 'next/link'


export default function ProfileNav({ activeTab, setActiveTab }) {
  return (
    <nav className=' flex w-full justify-evenly mt-4 border-b '>
      <button
        onClick={() => setActiveTab('posts')}
        className={activeTab === 'posts' ? 'border-b-4 border-purple-700 ' : ''}>
        Posts
      </button>
      <button
        onClick={() => setActiveTab('reactions')}
        className={activeTab === 'reactions' ? 'border-b-4 border-purple-700' : ''}>
        Reactions
      </button>
      <button
        onClick={() => setActiveTab('comments')}
        className={activeTab === 'comments' ? 'border-b-4 border-purple-700' : ''}>
        Comments
      </button>
    </nav>
  )
}
