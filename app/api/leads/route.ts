import { sql } from "@/lib/postgres";
import { sendEmail } from "@/lib/mail";

function calculateStep1Score(body: any) {
  let score = 0;

  if (body.service_level === "Klar") score += 50;
  if (body.service_level === "Rådgivning") score += 30;
  if (body.service_level === "Undersøger") score += 10;

  if (body.description?.length > 100) score += 20;
  if (body.email) score += 10;
  if (body.contact_time) score += 10;

  return score;
}

// =========================
// 🟢 STEP 1 – CREATE LEAD
// =========================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const score = calculateStep1Score(body);

    const result = await sql`
      INSERT INTO leads (
        category,
        task_type,
        description,
        name,
        phone,
        email,
        contact_time,
        service_level,
        lead_score_step1
      )
      VALUES (
        ${body.category},
        ${body.task_type || null},
        ${body.description || null},
        ${body.name},
        ${body.phone},
        ${body.email},
        ${body.contact_time || null},
        ${body.service_level || null},
        ${score}
      )
      RETURNING id
    `;

    const leadId = result[0]?.id;

    if (!leadId) {
      throw new Error("Lead not created");
    }

    // ✅ MAIL TIL KUNDE
    await sendEmail(body.email, body.name, {
      html: `
        <h3>Hej ${body.name}</h3>
        <p>Tak for din forespørgsel 🙌</p>
        <p>Vi matcher dig med relevante håndværkere.</p>
        <p>Du bliver kontaktet ${body.contact_time || "snarest muligt"}.</p>
      `,
    });

    // ✅ MAIL TIL ADMIN
    await sendEmail("hello@godmatch.dk", "GodMatch", {
      subject: "🔔 Nyt lead",
      html: `
        <h2>Nyt lead (Score: ${score})</h2>

        <p><strong>Navn:</strong> ${body.name}</p>
        <p><strong>Telefon:</strong> ${body.phone}</p>
        <p><strong>Email:</strong> ${body.email}</p>

        <p><strong>Kategori:</strong> ${body.category}</p>
        <p><strong>Type:</strong> ${body.task_type || "-"}</p>

        <p><strong>Beskrivelse:</strong></p>
        <p>${body.description}</p>

        <p><strong>Kontakt:</strong> ${body.contact_time}</p>
      `,
    });

    return Response.json({
      success: true,
      id: leadId,
      score,
    });

  } catch (err: any) {
    console.error("POST ERROR:", err);

    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// =========================
// 🔵 STEP 2 – UPDATE LEAD
// =========================
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return Response.json({ error: "Missing id" }, { status: 400 });
    }

    await sql`
      UPDATE leads SET
        zip_code = ${body.zip_code || null},
        address = ${body.address || null},
        property_type = ${body.property_type || null},
        budget = ${body.budget || null},
        urgency = ${body.urgency || null}
      WHERE id = ${body.id}
    `;

    return Response.json({ success: true });

  } catch (err: any) {
    console.error("PUT ERROR:", err);

    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}