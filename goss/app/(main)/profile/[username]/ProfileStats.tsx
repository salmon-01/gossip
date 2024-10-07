import React from 'react'

export default function ProfileStats({user}) {
  return (
    <>
    <span className='mr-2'>{user.followersCount} followers</span>
    <span>{user.followingCount} following</span>
    </>
  )
}
