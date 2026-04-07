//components/LeadForm.tsx
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
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);

  const inputClass =
    "border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-3 rounded-xl transition placeholder:text-gray-400";

  const labelClass = "text-sm font-medium text-gray-700";

  async function handleStep1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form) as FormDataShape;
    data.category = category;

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, step: 1 }),
      });

      const result = await res.json();

      if (res.ok) {
        setLeadId(result.id); // vigtigt!
        setStep(2);
      } else {
        setStatus("❌ " + (result.error || "Noget gik galt."));
      }
    } catch {
      setStatus("❌ Noget gik galt.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStep2(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form) as FormDataShape;

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/leads", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: leadId,
          ...data,
          step: 2,
        }),
      });

      if (res.ok) {
        setStatus("✅ Perfekt! Du bliver kontaktet snart.");
        setStep(3);
      } else {
        setStatus("❌ Noget gik galt.");
      }
    } catch {
      setStatus("❌ Noget gik galt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-md">

      {/* PROGRESS */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-1">
          Step {step} af 2
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full">
          <div
            className={`h-2 rounded-full bg-blue-600 transition-all ${
              step === 1 ? "w-1/2" : "w-full"
            }`}
          />
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <form onSubmit={handleStep1} className="flex flex-col gap-6">

          <div className="bg-white p-4 rounded-xl border flex flex-col gap-4">
            <p className="text-sm font-semibold">Opgave</p>

            <select name="task_type" required className={inputClass}>
              <option value="">Vælg opgave</option>
              {tasks.map((task) => (
                <option key={task}>{task}</option>
              ))}
            </select>

            <textarea
              name="description"
              required
              className={`${inputClass} min-h-[100px]`}
              placeholder="Kort beskrivelse..."
            />

            <select name="service_level" required className={inputClass}>
              <option value="">Hvor langt er du?</option>
              <option value="Klar">Klar til arbejdsopgaven</option>
              <option value="Rådgivning">Har brug for konkret rådgivning</option>
              <option value="Undersøger">Undersøger mulighederne</option>
            </select>
          </div>

<div className="bg-white p-4 rounded-xl border flex flex-col gap-4">
  <p className="text-sm font-semibold">Kontakt</p>

  <input 
    name="name" 
    required 
    placeholder="Navn" 
    className={inputClass} 
  />

  <input
    name="phone"
    required
    placeholder="Telefon"
    className={inputClass}
  />

  {/* 🔥 EMAIL TILFØJET */}
 <input
  name="email"
  type="email"
  required
  placeholder="Email"
  className={inputClass}
/>

  <select name="contact_time" required className={inputClass}>
    <option value="">Hvornår må vi ringe?</option>
    <option value="09-12">Formiddag</option>
    <option value="12-15">Middag</option>
    <option value="15-18">Eftermiddag</option>
  </select>
</div>
          <button className="bg-blue-600 text-white py-4 rounded-xl font-semibold">
            Fortsæt →
          </button>

          <p className="text-xs text-gray-500 text-center">
            Gratis · Ingen spam
          </p>

          <p className="text-sm text-center">{status}</p>
        </form>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <form onSubmit={handleStep2} className="flex flex-col gap-6">

          <p className="text-sm text-gray-600">
            For at matche dig bedst muligt, mangler vi lige de sidste detaljer 👇
          </p>

          <div className="bg-white p-4 rounded-xl border flex flex-col gap-4">
            <input name="address" required placeholder="Adresse" className={inputClass} />
            <input name="zip_code" required placeholder="Postnummer" className={inputClass} />

            <select name="property_type" required className={inputClass}>
              <option value="">Boligtype</option>
              <option>Villa</option>
              <option>Lejlighed</option>
              <option>Rækkehus</option>
            </select>

            <select name="budget" className={inputClass}>
              <option value="">Budget</option>
              <option value="0-25k">0–25k</option>
              <option value="25-75k">25–75k</option>
              <option value="75-150k">75–150k</option>
              <option value="150k+">150k+</option>
            </select>

            <select name="urgency" required className={inputClass}>
              <option value="">Hvornår?</option>
              <option>Hurtigst muligt</option>
              <option>1–2 måneder</option>
              <option>3–4 måneder</option>
            </select>
          </div>

          <button className="bg-blue-600 text-white py-4 rounded-xl font-semibold">
            Færdiggør →
          </button>

          <p className="text-sm text-center">{status}</p>
        </form>
      )}

      {/* SUCCESS */}
      {step === 3 && (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold mb-2">
            🎉 Tak for din forespørgsel
          </h3>
          <p className="text-gray-600">
            Du bliver kontaktet af relevante håndværkere snart.
          </p>
        </div>
      )}
    </div>
  );
}
