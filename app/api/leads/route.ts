//api/leads/route.tsx 
import { sql } from "@/lib/postgres";
import { sendEmail } from "@/lib/mail";

// 🔷 MAIN HANDLER
export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("📥 NEW LEAD:", body);

    // ✅ 1. INSERT INTO DATABASE (MUST SUCCEED)
    const result = await sql`
  INSERT INTO leads (
    category,
    task_type,
    zip_code,
    city,
    address,
    description,
    name,
    phone,
    email,
    property_type,
    contact_time,
    budget,
    urgency,
    service_level
  )
  VALUES (
    ${body.category},
    ${body.task_type},
    ${body.zip_code},
    ${body.city || null},
    ${body.address || null},
    ${body.description || null},
    ${body.name},
    ${body.phone},
    ${body.email || null},
    ${body.property_type || null},
    ${body.contact_time || null},
    ${body.budget || null},
    ${body.urgency || null},
    ${body.service_level || null}
  )
  RETURNING id
`;

    const leadId = result[0]?.id;

    if (!leadId) {
      throw new Error("Lead was not inserted");
    }

    console.log("✅ Lead stored:", leadId);

    // ✅ 2. SEND EMAIL (FAIL-SAFE — never break request)
    if (body.email) {
      sendEmail(
        body.email,
        body.name,
        {
          html: `
            <h3>Hej ${body.name}</h3>

            <p>Tak for din forespørgsel 🙌</p>

            <p>Vi matcher dig med op til 3 håndværkere.</p>

            <p>Du bliver kontaktet ${body.contact_time || "snarest muligt"}.</p>

            <br/>

            <p>Venlig hilsen<br/>Dit Team</p>
          `
        }
      ).catch((err) => {
        console.error("📧 EMAIL ERROR:", err);
      });
    }

    // ✅ 3. SUCCESS RESPONSE
    return Response.json({
      success: true,
      leadId,
    });

  } catch (err: any) {
    console.error("🚨 API ERROR:", err);

    return Response.json(
      {
        error: err.message || "Failed to create lead",
      },
      { status: 500 }
    );
  }
}
