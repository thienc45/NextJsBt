import React from 'react'
import { ModeToggle } from './ui/mode-toggle'
import Link from 'next/link'
 
export default function Header() {
  return (
    <div>
        <Link href="/register">Register</Link>
        <Link href="/login">Login</Link>
      <ModeToggle />
    </div>
  )
}
