import { sendEmail } from "@/lib/mail"

export async function POST(req: Request) {
  try {
    const data = await req.json()

    const name = String(data.name || "")
    const email = String(data.email || "")
    const message = String(data.message || "")

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing fields" }),
        { status: 400 }
      )
    }

    console.log("📩 CONTACT REQUEST:", { name, email })

    // 🔥 NON-BLOCKING EMAIL
    sendEmail(
      "mr.morten.thygesen@gmail.com",
      "Morten",
      {
        subject: "Ny kontaktbesked – GodMatch",
        html: `
          <h3>Ny kontaktbesked</h3>
          <p><b>Navn:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Besked:</b></p>
          <p>${message}</p>
        `,
        replyTo: {
          email,
          name
        }
      }
    ).catch((err) => {
      console.error("📧 EMAIL ERROR:", err)
    })

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    )

  } catch (err) {
    console.error("🚨 API ERROR:", err)

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    )
  }
}
