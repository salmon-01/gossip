"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation' 


export default function ProfileNav({username} ) {
  const pathname = usePathname(); 
 

  return (
    <nav className=' flex w-full justify-start mt-4 ml-6 border-b sticky bg-gray-100 top-0 py-2 z-10 '>
      <Link 
      href={`/${username}`}
      className={pathname === `/${username}` ? 'text-purple-600 font-bold text-xl' : 'text-gray-500'}
      >
        Posts
      </Link>
   
    </nav>
  )
}
