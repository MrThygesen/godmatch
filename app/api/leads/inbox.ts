// /api/leads/inbox

import { sql } from "@/lib/postgres"

export async function GET(){

const leads = await sql`
  SELECT * FROM leads
  ORDER BY created_at DESC
`

return Response.json(leads)

}
