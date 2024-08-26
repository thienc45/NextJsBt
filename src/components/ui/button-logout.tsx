'use client'


import authApiRequest from '@/apirequest/auth'
import { useAppContext } from '@/app/(auth)/Approvider'
import { Button } from '@/components/ui/button'
import { handleErrorApi } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'

export default function ButtonLogout() {

  const {user} = useAppContext()

  const router = useRouter()
  const pathname = usePathname()
  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer()
      router.push('/login')
    } catch (error) {
      handleErrorApi({
        error
      })
      // authApiRequest.logoutFromNextClientToNextServer(true).then((res) => {
      //   router.push(`/login?redirectFrom=${pathname}`)
      // })
    } finally {
      router.refresh()
    }
  }
  return (
    <div className="">

    <Button size={'sm'} onClick={handleLogout}>
      Đăng xuất
    </Button>
    </div>
  )
}
