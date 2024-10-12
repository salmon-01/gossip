"use client"
import React from 'react'
import Link from 'next/link'



export default function ChatHeader() {


  return (
    <div className="p-3  rounded-md sticky top-0 flex items-center justify-between shadow bg-white z-20">
      <Link href="/chats" className="flex items-center text-lg font-bold text-gray-700 hover:text-gray-900 transition duration-200">
        {/* Unicode for back arrow */}
        <span className="text-3xl mr-2 ">{'\u2190'}</span>Back

      </Link>
      <h2 className="text-lg font-bold mr-5 text-center flex-1">holdername</h2>
    </div>
  )
}
