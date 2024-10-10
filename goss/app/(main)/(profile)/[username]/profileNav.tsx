"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation' 


export default function ProfileNav({username} ) {
  const pathname = usePathname(); 
 

  return (
    <nav className=' flex w-full justify-evenly mt-4 border-b sticky bg-gray-100 top-0 py-2 z-10'>
      <Link 
      href={`/${username}`}
      className={pathname === `/${username}` ? 'text-purple-600 font-bold' : 'text-gray-500'}
      >
        Posts
      </Link>
      <Link 
      href={`/${username}/reactions`}
      className={pathname === `/${username}/reactions` ? 'text-purple-600 font-bold' : 'text-gray-500'}
      >
        Reactions
      </Link>
      <Link 
      href={`/${username}/comments`}
      className={pathname ===`/${username}/comments`? 'text-purple-600 font-bold' : 'text-gray-500' }
      >
        Comments
      </Link>
    </nav>
  )
}
