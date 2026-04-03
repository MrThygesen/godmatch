import { sql } from "@/lib/postgres"

export async function GET(){

  try {

    const data = await sql`
      SELECT 
        l.*,
        d.contractor_id,
        d.lead_price,
        d.sent_at,
        c.company_name
      FROM leads l
      LEFT JOIN lead_distribution d ON l.id = d.lead_id
      LEFT JOIN contractors c ON c.id = d.contractor_id
      WHERE l.status = 'sent'
      ORDER BY l.created_at DESC
    `

    return Response.json(data)

  } catch (err) {

    console.error("SENT ERROR:", err)

    return Response.json(
      { error: "failed to fetch sent leads" },
      { status: 500 }
    )
  }
}
