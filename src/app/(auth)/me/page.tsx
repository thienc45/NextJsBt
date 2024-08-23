import envConfig from '@/config'
import { cookies } from 'next/headers'
import React from 'react'
import Profile from './profile'
import accountApiRequest from '@/apirequest/account'

export default async function MeProfife() {

  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')

  const result = await accountApiRequest.me(sessionToken?.value ?? '')

  console.log(result)
  return (
    <div>
      <h1>Profile</h1>
      <Profile />
      {result.payload.data.name}
    </div>
  )
}
