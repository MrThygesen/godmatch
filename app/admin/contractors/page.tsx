//admin/contractors/page.tsx

import { isAuthenticated } from "@/lib/auth"
import ContractorsClient from "./ContractorsClient"
import LoginClient from "../LoginClient"

export default async function Page() {

  const auth = await isAuthenticated()

  if (!auth) {
    return <LoginClient />
  }

  return <ContractorsClient />
}
