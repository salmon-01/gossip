"use client"
import React from 'react'
import Link from 'next/link'



export default function ProfileNav({username} ) {
 

  return (
    <nav className=' flex w-full justify-evenly mt-4 border-b '>
      <Link 
      href={`/${username}`}
      >
        Posts
      </Link>
      <Link 
      href={`/${username}/reactions`}
      >
        Reactions
      </Link>
      <Link 
      href={`/${username}/comments`}
      >
        Comments
      </Link>
    </nav>
  )
}
