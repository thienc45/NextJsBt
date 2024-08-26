'use client'


import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

import authApiRequest from '@/apirequest/auth';


function LogoutLogic() {
  const router = useRouter()
  const pathname = usePathname()
  // const { setUser } = useAppContext()

  const searchParams = useSearchParams()
  const sessionToken = searchParams.get('sessionToken')
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    if (sessionToken === localStorage.getItem('sessionToken')) {
      authApiRequest
        .logoutFromNextClientToNextServer(true, signal)
        .then((res) => {
          // setUser(null)
          router.push(`/login?redirectFrom=${pathname}`)
        })
    }
    return () => {
      controller.abort()
    }
  }, [sessionToken, router, pathname])
  // setUser
  return <div>page</div>

}

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutLogic />
    </Suspense>
  )
}
