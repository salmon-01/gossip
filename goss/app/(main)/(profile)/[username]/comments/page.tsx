import React from 'react'

export default function ProfileComments({params}) {
  const {username} = params
  return (
    <div>{username}</div>
  )
}
