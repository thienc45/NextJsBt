import authApiRequest from '@/apirequest/auth'
import { HttpError } from '@/lib/http'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const res = await request.json()
  const force = res.force as boolean | undefined

  if (force) {
    return Response.json(
      {
        message: 'Buộc đăng xuất thành công'
      },
    {
        status: 200,
        headers: {
          'Set-Cookie': `sessionToken=; Path=/; HttpOnly; Max-Age=0`
        }
      }
    )
  }

  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')
  console.log(sessionToken + " route login-----------")

if (!sessionToken || !sessionToken.value) {
  console.log("Session token không tồn tại hoặc không hợp lệ");
  return Response.json(
    { message: 'Không nhận được session token' },
    { status: 401 }
  );
}


  try {
    const result = await authApiRequest.logoutFromNextServerToServer(
      sessionToken.value
    )
    return Response.json(result.payload, {
      status: 200,
      headers: {
        'Set-Cookie': `sessionToken=; Path=/; HttpOnly; Max-Age=0`
      }
    })
  } catch (error: any) {  // Sử dụng `any` để nhận tất cả các loại lỗi
    console.error("Lỗi xảy ra:", error)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)
    
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json(
        {
          message: 'Lỗi không xác định',
          errorMessage: error.message, 
          errorStack: error.stack        
        },
        {
          status: 500
        }
      )
    }
  }
}
