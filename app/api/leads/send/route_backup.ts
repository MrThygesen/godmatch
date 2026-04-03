import { sql } from "@/lib/postgres"
import { sendEmail } from "@/lib/mail"

export async function POST(req: Request){

  try {

    const { lead, contractors, message, contactTime } = await req.json()

    console.log("📤 SENDING LEAD:", lead.id)

    // 🔵 SEND TO CONTRACTORS
    for (const c of contractors){

      if (!c.email) {
        console.error("❌ Missing contractor email:", c)
        continue
      }

      try {

        await sendEmail(
          c.email,
          c.company_name,
          {
            html: `
              <div style="font-family: Arial, sans-serif; background:#f6f7f9; padding:20px;">
                
                <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:10px; padding:24px; border:1px solid #e5e7eb;">
                  
                  <h2 style="margin-top:0; color:#111827;">🔔 Nyt lead fra GodMatch</h2>
                  <p style="color:#6b7280;">Du har modtaget en ny kundehenvendelse</p>

                  <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;" />

                  <!-- Kunde -->
                  <h3 style="margin-bottom:8px;">👤 Kunde</h3>
                  <p><strong>Navn:</strong> ${lead.name}</p>
                  <p><strong>Telefon:</strong> ${lead.phone}</p>
                  <p><strong>Email:</strong> ${lead.email || "-"}</p>

                  <!-- Lokation -->
                  <h3 style="margin-top:20px; margin-bottom:8px;">📍 Lokation</h3>
                  <p><strong>Postnummer:</strong> ${lead.zip_code || "-"}</p>
                  <p><strong>By:</strong> ${lead.city || "-"}</p>

                  <!-- Bolig -->
                  <h3 style="margin-top:20px; margin-bottom:8px;">🏠 Bolig</h3>
                  <p><strong>Type:</strong> ${lead.property_type || "-"}</p>

                  <!-- Opgave -->
                  <h3 style="margin-top:20px; margin-bottom:8px;">🔧 Opgave</h3>
                  <p><strong>Budget:</strong> ${lead.budget || "-"}</p>
                  <p><strong>Urgency:</strong> ${lead.urgency || "-"}</p>
                   <p><strong>Serviceniveau:</strong> ${lead.service_level || "-"}</p>
                  <p><strong>Kategori:</strong> ${lead.category}</p>
                  <p><strong>Type:</strong> ${lead.task_type || "-"}</p>

                  <p style="margin-top:10px;"><strong>Beskrivelse:</strong></p>
                  <div style="background:#f9fafb; padding:12px; border-radius:6px; border:1px solid #e5e7eb;">
                    ${lead.description || "-"}
                  </div>

                  <!-- Kontakt -->
                  <h3 style="margin-top:20px; margin-bottom:8px;">⏰ Kontakt</h3>
                  <p><strong>Ønsket tidspunkt:</strong> ${lead.contact_time || "-"}</p>

                  <!-- CTA -->
                  <div style="margin-top:24px; padding:16px; background:#eff6ff; border-radius:8px; text-align:center;">
                    <p style="margin:0; font-weight:bold; color:#1d4ed8;">
                      📞 Kontakt kunden hurtigst muligt: ${lead.phone}
                    </p>
                  </div>

                  <p style="margin-top:24px; font-size:12px; color:#9ca3af;">
                    Dette lead er sendt via GodMatch
                  </p>

                </div>
              </div>
            `
          }
        )

        console.log("✅ Sent to contractor:", c.email)

      } catch (err) {
        console.error("❌ CONTRACTOR EMAIL ERROR:", c.email, err)
      }

    }

    // 🟢 MANUAL EMAIL TO CUSTOMER (ONLY IF MESSAGE EXISTS)
    if (lead.email && message) {

      try {

        await sendEmail(
          lead.email,
          lead.name,
          {
            html: `
              <div style="font-family: Arial, sans-serif; background:#f6f7f9; padding:20px;">
                
                <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:10px; padding:24px; border:1px solid #e5e7eb;">
                  
                  <h2 style="margin-top:0;">Hej ${lead.name}</h2>

                  <p>${message}</p>

                  ${
                    contactTime
                      ? `<p><strong>Du bliver kontaktet:</strong> ${contactTime}</p>`
                      : ""
                  }

                  <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;" />

                  <h3>Din opgave</h3>

                  <p><strong>Type:</strong> ${lead.task_type || "-"}</p>
                  <p><strong>Kategori:</strong> ${lead.category}</p>

                  <p><strong>Budget:</strong> ${lead.budget || "-"}</p>
                  <p><strong>Hvornår:</strong> ${lead.urgency || "-"}</p>
                  <p><strong>Serviceniveau:</strong> ${lead.service_level || "-"}</p>

                  <p><strong>Postnummer:</strong> ${lead.zip_code || "-"}</p>
                  <p><strong>By:</strong> ${lead.city || "-"}</p>

                  <p><strong>Beskrivelse:</strong></p>
                  <div style="background:#f9fafb; padding:12px; border-radius:6px; border:1px solid #e5e7eb;">
                    ${lead.description || "-"}
                  </div>

                  <br/>

                  <p>Venlig hilsen<br/>GodMatch</p>

                </div>
              </div>
            `
          }
        )

        console.log("✅ Sent manual email to customer:", lead.email)

      } catch (err) {
        console.error("❌ CUSTOMER EMAIL ERROR:", err)
      }
    }

    // 🟡 UPDATE STATUS
    try {
      await sql`
        UPDATE leads
        SET status = 'sent'
        WHERE id = ${lead.id}
      `
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err)
    }

    return Response.json({ success: true })

  } catch (err) {

    console.error("SEND ERROR:", err)

    return Response.json(
      { error: "send failed" },
      { status: 500 }
    )
  }

}
