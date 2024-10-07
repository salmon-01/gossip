import React from 'react'



export default function ProfileHeader({user}) {
  return (
    <>
    <img src={user.profileImage} className='rounded-full w-16 h-16 bg-black'/>
    <div className='font-bold'>{user.displayName}</div>
    <p className='text-sm'>@{user.username}</p>
    
    </>
  )
}
