'use client';

import React from 'react'
import Link from 'next/link'


export default function ProfileNav({ activeTab, setActiveTab }) {
  return (
    <nav className=' flex w-full justify-evenly mt-4'>
        <button onClick={() => setActiveTab('posts')} className={activeTab === 'posts' ? 'active' : ''}>
        Posts
      </button>
      <button onClick={() => setActiveTab('replies')} className={activeTab === 'replies' ? 'active' : ''}>
        Replies
      </button>
    </nav>
  )
}
