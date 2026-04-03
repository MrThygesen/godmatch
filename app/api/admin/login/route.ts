import { login } from "@/lib/auth"

export async function POST(req: Request) {

  const { password } = await req.json()

  const success = await login(password)

  if (!success) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  return Response.json({ success: true })
}
