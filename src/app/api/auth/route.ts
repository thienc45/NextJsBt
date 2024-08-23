export const dynamic = "force-static";

export async function POST(request: Request) {
  const res = await request.json();
  const sessionToken = res.sessionToken as string;
  console.log(res);

  if (!sessionToken) {
    return Response.json(
      {
        res,
        message: "Khong nhan duoc session token",
      },
      {
        status: 400,
      }
    );
  }
  return Response.json(res.payload, {
    status: 200,
    headers: { "Set-Cookie": `sessionToken=${sessionToken}; Path=/;HttpOnly` },
  });
}
