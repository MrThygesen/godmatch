// app/api/leads/route.ts

import { sql } from "@/lib/postgres";
import { sendEmail } from "@/lib/mail";


// =========================
// 🧠 STEP 1 SCORING
// =========================
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

    console.log("📥 STEP 1:", body);

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

    console.log("✅ Lead created:", leadId, "Score:", score);

    // 📧 Kunde mail
    await sendEmail(
      body.email,
      body.name,
      {
        html: `
          <h3>Hej ${body.name}</h3>
          <p>Tak for din forespørgsel 🙌</p>
          <p>Vi matcher dig med relevante håndværkere.</p>
          <p>Du bliver kontaktet ${body.contact_time || "snarest muligt"}.</p>
        `
      }
    );

    // 🔥 ADMIN MAIL (ALT INFO)
    await sendEmail(
      "mr.morten.thygesen@gmail.com",
      "GodMatch",
      {
        subject: "🔔 Nyt lead",
        html: `
          <h2>Nyt lead (Score: ${score})</h2>

          <h3>👤 Kunde</h3>
          <p><strong>Navn:</strong> ${body.name}</p>
          <p><strong>Telefon:</strong> ${body.phone}</p>
          <p><strong>Email:</strong> ${body.email}</p>

          <h3>🔧 Opgave</h3>
          <p><strong>Kategori:</strong> ${body.category}</p>
          <p><strong>Type:</strong> ${body.task_type || "-"}</p>
          <p><strong>Opgave Status:</strong> ${body.service_level}</p>

          <h3>📝 Beskrivelse</h3>
          <p>${body.description}</p>

          <h3>⏰ Kontakt</h3>
          <p>${body.contact_time}</p>
        `
      }
    );

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
// 🔵 STEP 2 – UPDATE + FINAL SCORE
// =========================
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return Response.json({ error: "Missing id" }, { status: 400 });
    }

    let finalScore = 0;

    if (body.budget === "150k+") finalScore += 40;
    if (body.budget === "75-150k") finalScore += 25;

    if (body.urgency === "Hurtigst muligt") finalScore += 20;

    if (body.property_type === "Villa") finalScore += 10;

    await sql`
      UPDATE leads SET
        zip_code = ${body.zip_code || null},
        address = ${body.address || null},
        property_type = ${body.property_type || null},
        budget = ${body.budget || null},
        urgency = ${body.urgency || null},
        lead_score_final = ${finalScore}
      WHERE id = ${body.id}
    `;

    console.log("✅ Lead updated:", body.id, "Final score:", finalScore);

    return Response.json({ success: true });

  } catch (err: any) {
    console.error("PUT ERROR:", err);

    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
