import React from 'react'
import ProfileNav from './profileNav'

export default function ProfileLayout({ children }) {
  return (
    <>
    <main>{children}</main>
    <ProfileNav/>
    </>
    
  )
}
