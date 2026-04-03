import { logout } from "@/lib/auth"

export async function POST() {
  logout()
  return Response.json({ success: true })
}
