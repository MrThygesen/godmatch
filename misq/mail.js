import Brevo from '@getbrevo/brevo'

export async function sendEmail(to, name, data){

const apiInstance = new Brevo.TransactionalEmailsApi()

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
)

await apiInstance.sendTransacEmail({
  sender: { email: "noreply@godmatch.dk", name: "GodMatch" },
  to: [{ email: to, name }],
  subject: "Vi har modtaget din opgave",
  htmlContent: `
    <h3>Hej ${name}</h3>
    <p>Tak for din forespørgsel.</p>
    <p>Vi kontakter dig indenfor 48 timer.</p>
  `
})

}
