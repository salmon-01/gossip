import React from 'react'
import Link from 'next/link'

export default function page() {
  return (
    <>
    <Link href="/chats">{'\u2190'}</Link>
    <h2>New message</h2>
    <form>page</form>
    </>
  )
}
