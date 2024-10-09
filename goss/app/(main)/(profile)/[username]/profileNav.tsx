'use client';

import React from 'react'
import Link from 'next/link'
import { useSessionContext } from '@/app/context/SessionContext';


export default function ProfileNav() {

  const {data:session} = useSessionContext();
  const username = session?.profile.username
  console.log(username)
  return (
    <nav className=' flex w-full justify-evenly mt-4 border-b '>
      <Link 
      href={`${username}/posts`}
      >
        Posts
      </Link>
      <Link 
      href={`${username}/reactions`}
      >
        Reactions
      </Link>
      <Link 
      href={`${username}/comments`}
      >
        Comments
      </Link>
    </nav>
  )
}
