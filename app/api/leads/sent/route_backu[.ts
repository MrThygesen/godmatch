import { sql } from "@/lib/postgres"

export async function GET(){

  try {

    const leads = await sql`
      SELECT * FROM leads
      WHERE status = 'sent'
      ORDER BY created_at DESC
    `

    return Response.json(leads)

  } catch (err) {

    console.error("SENT ERROR:", err)

    return Response.json(
      { error: "failed to fetch sent leads" },
      { status: 500 }
    )
  }
}
