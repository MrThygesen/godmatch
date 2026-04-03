export default function FAQ() {
  const faqs = [
    {
      q: "Er det gratis at få tilbud?",
      a: "Ja, det er 100% gratis og uforpligtende at få kontakt og tilbud fra håndværkerfirmaerne]."
    },
    {
      q: "Hvor hurtigt får jeg svar?",
      a: "De fleste får svar eller kontakt indenfor 24 timer."
    },
    {
      q: "Er håndværkerne verificerede?",
      a: "Vi matcher dig med lokale og relevante håndværkere."
    },
 
     {
      q: "Bliver jeg kontaktet af GodMatch?",
      a: "Ja, Vi kontakter ofte vores brugere for at være sikre på opgaven er forstået."
    },
     {
      q: "Bliver jeg kontaktet af Håndværkerne?",
      a: "Ja, Håndværkerne skal typisk ha mere infmation inden de møder op på bopælen."
    },
     {
      q: "Får jeg besøg inden der afgives et tilbud?",
      a: "Ja, Håndværkerne skal typisk se din bopæl og opgave inden de kan gi et tilbud."
    },
    {
      q: "Skal jeg vælge et tilbud?",
      a: "Nej, du vælger helt selv om du vil acceptere et tilbud."
    }

  ]

  return (
    <section className="max-w-3xl mx-auto px-4 mt-20">
      
      <h1 className="text-4xl font-semibold mb-10">
        Ofte stillede spørgsmål
      </h1>

      <div className="flex flex-col gap-6">
        {faqs.map((faq, i) => (
          <div key={i} className="border rounded-xl p-6 bg-white shadow-sm">
            <h3 className="font-medium mb-2">{faq.q}</h3>
            <p className="text-gray-600">{faq.a}</p>
          </div>
        ))}
      </div>

    </section>
  )
}   
