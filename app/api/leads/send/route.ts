import { sql } from "@/lib/postgres"
import { sendEmail } from "@/lib/mail"

export async function POST(req: Request){

  try {

    const {
      lead,
      contractors = [],
      message,
      contractorContactTime,
      customerContactTime
    } = await req.json()

    console.log("📤 SENDING LEAD:", lead.id)

    // 🔥 FLAGS
    const sendContractors = contractors.length > 0
    const sendCustomer = message && message.trim().length > 0

    // ✅ Resolve city
    let city = lead.city

    if (!city && lead.zip_code) {
      try {
        const res = await sql`
          SELECT place_name FROM zip_codes
          WHERE postal_code = ${lead.zip_code}
          LIMIT 1
        `
        city = res[0]?.place_name || "-"
      } catch (err) {
        console.error("CITY LOOKUP ERROR:", err)
        city = "-"
      }
    }

    // 🔵 SEND TO CONTRACTORS
    if (sendContractors) {

      for (const c of contractors){

        if (!c.email) continue

        try {

          await sendEmail(
            c.email,
            c.company_name,
            {
              type: "contractor",
              html: `
<div style="font-family: Arial, sans-serif; background:#f6f7f9; padding:20px;">
  
  <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:10px; padding:24px; border:1px solid #e5e7eb;">
    
    <h2 style="margin-top:0;">🔔 Nyt lead fra GodMatch</h2>
    <p style="color:#6b7280;">En kunde søger en håndværker</p>

    <hr style="margin:20px 0;" />

    <h3>👤 Kunde</h3>
    <p><strong>Navn:</strong> ${lead.name}</p>
    <p><strong>Telefon:</strong> ${lead.phone}</p>
    <p><strong>Email:</strong> ${lead.email || "-"}</p>
    <p><strong>Foretrukken kontakt:</strong> ${lead.preferred_contact || "Telefon"}</p>

    <h3 style="margin-top:20px;">📍 Lokation</h3>
    <p><strong>Adresse:</strong> ${lead.address || "-"}</p>
    <p><strong>Postnr:</strong> ${lead.zip_code || "-"}</p>
    <p><strong>By:</strong> ${city}</p>

    <h3 style="margin-top:20px;">🏠 Bolig</h3>
    <p><strong>Type:</strong> ${lead.property_type || "-"}</p>

    <h3 style="margin-top:20px;">🔧 Opgave</h3>
    <p><strong>Kategori:</strong> ${lead.category}</p>
    <p><strong>Type:</strong> ${lead.task_type || "-"}</p>

    <h3 style="margin-top:20px;">💰 Kunde info</h3>
    <p><strong>Budget:</strong> ${lead.budget || "-"}</p>
    <p><strong>Hvornår udføres opgaven:</strong> ${lead.urgency || "-"}</p>
    <p><strong>Serviceniveau:</strong> ${lead.service_level || "-"}</p>

    <h3 style="margin-top:20px;">📝 Beskrivelse</h3>
    <div style="background:#f9fafb; padding:12px; border-radius:6px;">
      ${lead.description || "-"}
    </div>

    <h3 style="margin-top:20px;">⏰ Kontakt</h3>
    <p><strong>Ønsket tidspunkt:</strong> ${contractorContactTime || lead.contact_time || "-"}</p>

    <div style="margin-top:24px; padding:16px; background:#eff6ff; border-radius:8px; text-align:center;">
      <strong>📞 Ring til kunden: ${lead.phone}</strong>
    </div>

    <p style="margin-top:20px; font-size:12px; color:#9ca3af;">
      Lead ID: ${lead.id} · GodMatch
    </p>

  </div>
</div>
`
            }
          )

          // ✅ STORE DISTRIBUTION
          await sql`
            INSERT INTO lead_distribution (
              lead_id,
              contractor_id,
              status,
              lead_price
            )
            VALUES (
              ${lead.id},
              ${c.id},
              'sent',
              ${c.price || 0}
            )
          `

          console.log("✅ Contractor sent:", c.company_name)

        } catch (err) {
          console.error("❌ CONTRACTOR ERROR:", c.email, err)
        }
      }
    }

    // 🟢 SEND TO CUSTOMER (ONLY MANUAL)
    if (sendCustomer && lead.email) {

      try {

        await sendEmail(
          lead.email,
          lead.name,
          {
            type: "customer",
            subject: "GodMatch – Opdatering på din opgave",
            html: `
<div style="font-family: Arial, sans-serif; background:#f6f7f9; padding:20px;">
  
  <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:10px; padding:24px; border:1px solid #e5e7eb;">
    
    <h2>Hej ${lead.name}</h2>

    <p>${message}</p>

    ${
      customerContactTime
        ? `<p><strong>Du bliver kontaktet:</strong> ${customerContactTime}</p>`
        : ""
    }

    <hr style="margin:20px 0;" />

    <h3>Din opgave</h3>

    <p><strong>Kategori:</strong> ${lead.category}</p>
    <p><strong>Type:</strong> ${lead.task_type || "-"}</p>

    <p><strong>Adresse:</strong> ${lead.address || "-"}</p>
    <p><strong>Postnr:</strong> ${lead.zip_code || "-"}</p>
    <p><strong>By:</strong> ${city}</p>

    <p><strong>Budget:</strong> ${lead.budget || "-"}</p>
    <p><strong>Tid:</strong> ${lead.urgency || "-"}</p>
    <p><strong>Serviceniveau:</strong> ${lead.service_level || "-"}</p>

    <p><strong>Beskrivelse:</strong></p>
    <div style="background:#f9fafb; padding:12px; border-radius:6px;">
      ${lead.description || "-"}
    </div>

    <br/>

    <p>Venlig hilsen<br/>GodMatch</p>

  </div>
</div>
`
          }
        )

        console.log("✅ Customer email sent")

      } catch (err) {
        console.error("❌ CUSTOMER ERROR:", err)
      }
    }

    // 🟡 UPDATE STATUS
    await sql`
      UPDATE leads
      SET status = 'sent'
      WHERE id = ${lead.id}
    `

    return Response.json({ success: true })

  } catch (err) {

    console.error("SEND ERROR:", err)

    return Response.json(
      { error: "send failed" },
      { status: 500 }
    )
  }
}
