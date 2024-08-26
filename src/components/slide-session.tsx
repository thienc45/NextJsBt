'use client'


import { useEffect } from 'react'
import { differenceInHours } from 'date-fns'
import authApiRequest from '@/apirequest/auth'

export default function SlideSession() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date()
      const sessionTokenExpiresAt = localStorage.getItem(
        'sessionTokenExpiresAt'
      )
      const expiresAt = sessionTokenExpiresAt
        ? new Date(sessionTokenExpiresAt)
        : new Date()
      if (differenceInHours(expiresAt, now) < 1) {
        const res =
          await authApiRequest.slideSessionFromNextClientToNextServer()
        localStorage.setItem(
          'sessionTokenExpiresAt',
          res.payload.data.expiresAt
        )
      }
    }, 1000 * 60 * 30)
    return () => clearInterval(interval)
  }, [])
  return null
}
