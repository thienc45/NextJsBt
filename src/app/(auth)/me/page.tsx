
import accountApiRequest from '@/apirequest/account'
import { cookies } from 'next/headers'
import Profile from './profile'
import ProfileForm from './profile-form'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Hồ sơ người dùng'
}
export default async function MeProfife() {

  

  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')

  const result = await accountApiRequest.me(sessionToken?.value ?? '')

  console.log(result)
  return (
    <div>
      <h1>Profile</h1>
      <Profile />  
      <ProfileForm  profile={result.payload.data} />
    </div>
  )
}
