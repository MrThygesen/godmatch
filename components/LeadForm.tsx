"use client";

import { useState } from "react";

type LeadFormProps = {
  category: string;
  tasks: string[];
};

type FormDataShape = {
  [key: string]: FormDataEntryValue;
};

export default function LeadForm({ category, tasks }: LeadFormProps) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const formElement = e.currentTarget;

    setLoading(true);
    setStatus("");

    const form = new FormData(formElement);
    const data = Object.fromEntries(form) as FormDataShape;
    data.category = category;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus("✅ Håndværkere kontakter dig hurtigt.");
        formElement.reset();
      } else {
        setStatus("❌ " + (result.error || "Noget gik galt."));
      }
    } catch (err) {
      setStatus("❌ Noget gik galt – prøv igen.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-3 rounded-xl transition placeholder:text-gray-400";

  const labelClass = "text-sm font-medium text-gray-700";

  return (
    <div className="relative bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      {/* subtle glow */}
      <div className="absolute -inset-2 bg-blue-50 blur-xl opacity-20 pointer-events-none"></div>

      <div className="relative">
        {/* HEADER */}
        <div className="mb-5">
          <h3 className="text-xl font-semibold tracking-tight">
        Vi hjælper dig med at finde de rette specialister
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Kun 2-3 specialister kontaktes · Gratis og uforpligtende
          </p>

          {/* trust signals 
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
           <span>⭐ 4.8 Trustpilot</span>
            <span>✔ 500+ opgaver matchet</span>
          </div>*/}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-6">

          {/* SECTION: TASK */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-4">
            <p className="text-sm font-semibold">Opgave</p>

            {tasks.length > 0 && (
              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  Hvad drejer opgaven sig om? <span className="text-red-500">*</span>
                </label>
                <select name="task_type" required className={inputClass}>
                  <option value="">Vælg</option>
                  {tasks.map((task) => (
                    <option key={task} value={task}>
                      {task}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className={labelClass}>
                Beskriv opgaven <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                className={`${inputClass} min-h-[120px]`}
                placeholder="Kort beskrivelse af opgaven..."
              />
            </div>
          </div>


<select name="service_level" className={inputClass} required>
  <option value="">Hvor langt er du med projektet?</option>
  <option value="ready">Klar til at gå i gang</option>
  <option value="needs_advice">Har brug for rådgivning</option>
  <option value="researching">Undersøger muligheder</option>
</select>


          {/* SECTION: CONTACT */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-4">
            <p className="text-sm font-semibold">Kontakt</p>

            <div className="flex flex-col gap-1">
              <label className={labelClass}>
                Navn <span className="text-red-500">*</span>
              </label>
              <input name="name" required className={inputClass} />
            </div>

            <div className="flex flex-col gap-1">
              <label className={labelClass}>
                Telefon <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                required
                className={inputClass}
                placeholder="fx 20 30 40 50"
                autoComplete="tel"
              />
            </div>


            <div className="flex flex-col gap-1">
              <label className={labelClass}>Email</label>
              <input name="email" className={inputClass} autoComplete="email" />
            </div>
          </div>


<div className="flex flex-col gap-1">
  <label className={labelClass}>
    Hvornår må vi kontakte dig? <span className="text-red-500">*</span>
  </label>

  <select
    name="contact_time"
    required
    className={inputClass}
  >
    <option value="">Vælg tidspunkt</option>
<option value="09-12">Formiddag (09–12)</option>
<option value="12-15">Middag (12–15)</option>
<option value="15-18">Eftermiddag (15–18)</option>  </select>
</div>



          {/* SECTION: DETALJER */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-4">
            <p className="text-sm font-semibold">Detaljer</p>

            <input name="address" placeholder="Adresse" className={inputClass} required />
            <input name="zip_code" placeholder="Postnummer" className={inputClass} required />

            <select name="property_type" className={inputClass} required>
              <option value="">Boligtype</option>
              <option>Villa</option>
              <option>Lejlighed</option>
              <option>Rækkehus</option>
              <option>Andet</option>
            </select>

            <select name="budget" className={inputClass} required>
              <option value="">Budget</option>
              <option value="0-25k">0 – 25.000 kr</option>
              <option value="25-75k">25.000 – 75.000 kr</option>
              <option value="75-150k">75.000 – 150.000 kr</option>
              <option value="150k-250K">150.000 – 250.000 kr</option>
              <option value="250k+">250.000+ kr</option>

            </select>

            <select name="urgency" className={inputClass} required>
              <option value="">Hvornår?</option>
              <option value="Hurtigst muligt">Hurtigst muligt</option>
              <option value="1-3 måneder">1–3 måneder</option>
              <option value="4-12 måneder">4-12 måneder</option>                           
            </select>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2">
            <button
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition text-lg disabled:opacity-50"
            >
              {loading ? "Sender..." : "Bliv kontaktet af håndværkere"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Gratis · Ingen spam · Svar samme dag
            </p>
          </div>

          {/* STATUS */}
          <p className="text-sm text-center text-gray-600">{status}</p>
        </form>
      </div>
    </div>
  );
}

