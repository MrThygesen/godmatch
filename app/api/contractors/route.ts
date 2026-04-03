import { sql } from "@/lib/postgres"

export async function POST(req: Request){

const body = await req.json()

const {
  company_name,
  contact_name,
  phone,
  email,
  category,
  zip_codes
} = body

await sql`
  INSERT INTO contractors (
    company_name,
    contact_name,
    phone,
    email,
    category,
    zip_codes,
    active
  )
  VALUES (
    ${company_name},
    ${contact_name},
    ${phone},
    ${email},
    ${category},
    ${zip_codes},
    true
  )
`

return Response.json({ success:true })

}
