//api/contractors/list
import { sql } from "@/lib/postgres"

export async function GET(req: Request){

  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")

  const contractors = await sql`
    SELECT * FROM contractors
    WHERE category = ${category}
    AND active = true
    LIMIT 10
  `

  return Response.json(contractors)
}
