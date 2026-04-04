export async function sendEmail(to: string, name: string, data: any){

  const subject =
    data.subject ||
    (data.type === "contractor"
      ? "GodMatch – Nyt lead"
      : "GodMatch – Vi har modtaget din forespørgsel")

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!
    },
    body: JSON.stringify({
      sender: {
        email: "mortenthygesen7@gmail.com",
        name: "GodMatch"
      },
      to: [
        {
          email: to,
          name: name
        }
      ], 


 // ✅ ADD THIS
  bcc: [
    {
      email: "mr.morten.thygesen@gmail.com",
      name: "GodMatch"
    }
  ],


      subject,
      htmlContent: data.html || "<p>Ingen besked</p>"
    })
  })

  if (!res.ok) {
    const error = await res.text()
    console.error("BREVO ERROR:", error)
    throw new Error("Email failed")
  }
}
