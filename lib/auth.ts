import { cookies } from "next/headers"

// 🔐 LOGIN
export async function login(password: string) {

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

  console.log("INPUT:", password)
  console.log("ENV:", ADMIN_PASSWORD)

  if (String(password) === ADMIN_PASSWORD) {

    const cookieStore = await cookies()

    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })

    return true
  }

  return false
}

// 🔓 LOGOUT
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
}

// ✅ AUTH CHECK
export async function isAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get("admin_session")?.value === "true"
}
