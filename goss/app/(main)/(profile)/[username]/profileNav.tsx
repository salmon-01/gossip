"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation' 


export default function ProfileNav({username}: {username:string} ) {
  const pathname = usePathname(); 
 

  return (
    <nav className=' flex w-screen justify-start mt-4 pl-6 sticky bg-white top-0 py-2 z-10  '>
      <Link 
      href={`/${username}`}
      className={pathname === `/${username}` ? 'text-purple-600 font-bold text-xl' : 'text-gray-500'}
      >
        Posts
      </Link>
   
    </nav>
  )
}
