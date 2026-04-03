import { isAuthenticated } from "@/lib/auth"
import AdminClient from "./AdminClient"
import LoginClient from "./LoginClient"

export default async function Page() {

  const auth = await isAuthenticated()

  if (!auth) {
    return <LoginClient /> // ✅ NOW VALID
  }

  return <AdminClient />
}
