import { sql } from "@/lib/postgres"

export async function GET(){

  const stats = await sql`
    SELECT 
      c.id,
      c.company_name,
      COUNT(ld.id) as total_leads
    FROM contractors c
    LEFT JOIN lead_distribution ld
      ON c.id = ld.contractor_id
    GROUP BY c.id
    ORDER BY total_leads DESC
  `

  return Response.json(stats)
}
