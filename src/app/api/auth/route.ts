// export const dynamic = "force-static";

import { decodeJWT } from "@/lib/utils";

// export async function POST(request: Request) {
//   const res = await request.json();
//   const sessionToken = res.sessionToken as string;

//   if (!sessionToken) {
//     console.log(res);
//     return Response.json(
//       {
//         res,
//         message: "KO nhan duoc session token",
//       },
//       {
//         status: 400,
//       }
//     );
//   }
//   return Response.json(res, {
//     status: 200,
//     headers: { "Set-Cookie": `sessionToken=${sessionToken}; Path=/;HttpOnly` },
//   });
// }

type PayloadJWT = {
  iat: number;     
  exp: number;      
  tokenType: string; 
  userId: number;   
};


export async function POST(request: Request) {
  const body = await request.json()
  console.log(body.expiresAt+"------------")
  const sessionToken = body.sessionToken as string
  const expiresAt = body.expiresAt as string
  
  if (!sessionToken) {
    return Response.json(
      { message: 'Không nhận được session token' },
      {
        status: 400
      }
    )
  }

  const payload = decodeJWT<PayloadJWT>(sessionToken)
  // const expiresDate = new Date(payload.exp*1000).toUTCString()
  const expiresDate = new Date(expiresAt).toUTCString()
  return Response.json(body, {
    status: 200,
    headers: {
      'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure`
    }
  })
}
