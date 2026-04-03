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
        setStatus("✅ Tak! Vi kontakter dig inden for 1-2 dage.");
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
    "border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-3 rounded-lg transition";

  const labelClass = "text-sm font-medium text-gray-700";

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">

      {/* 🔥 HEADER */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Få tilbud på din opgave</h3>
        <p className="text-sm text-gray-500">
          Kun 2-3 håndværkere kontaktes · Gratis og uforpligtende
        </p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4">

        {/* TASK */}
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

        {/* NAME */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>
            Navn <span className="text-red-500">*</span>
          </label>
          <input name="name" required className={inputClass} />
        </div>

        {/* PHONE */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>
            Telefon <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            required
            className={inputClass}
            placeholder="fx 20 30 40 50"
          />
        </div>

        {/* EMAIL */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Email</label>
          <input name="email" className={inputClass} />
        </div>

        {/* ZIP */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Postnummer</label>
          <input name="zip_code" className={inputClass} />
        </div>


{/* ADDRESS */}
<div className="flex flex-col gap-1">
  <label className={labelClass}>Adresse</label>
  <input name="address" className={inputClass} placeholder="Vejnavn og nr." />
</div>


        {/* PROPERTY */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Boligtype</label>
          <select name="property_type" className={inputClass}>
            <option value="">Vælg</option>
            <option>Villa</option>
            <option>Lejlighed</option>
            <option>Rækkehus</option>
            <option>Andet</option>
          </select>
        </div>

        {/* CONTACT TIME */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Hvornår må vi ringe?</label>
          <select name="contact_time" className={inputClass}>
            <option value="">Vælg</option>
            <option>Morgen</option>
            <option>Formiddag</option>
            <option>Eftermiddag</option>
            <option>Aften</option>
          </select>
        </div>

        {/* BUDGET */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Budget</label>
          <select name="budget" className={inputClass}>
            <option value="">Valgfrit</option>
            <option value="0-25k">0 – 25.000 kr</option>
            <option value="25-75k">25.000 – 75.000 kr</option>
            <option value="75-150k">75.000 – 150.000 kr</option>
            <option value="150k+">150.000+ kr</option>
          </select>
        </div>

        {/* URGENCY */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Hvornår skal det udføres?</label>
          <select name="urgency" className={inputClass}>
            <option value="">Vælg</option>
            <option value="flexible">Fleksibel</option>
            <option value="1-3 måneder">1–3 måneder</option>
            <option value="hurtigst muligt">Hurtigst muligt</option>
          </select>
        </div>

        {/* SERVICE LEVEL */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Serviceniveau</label>
          <select name="service_level" className={inputClass}>
            <option value="">Vælg</option>
            <option value="prisfokus">Billigst muligt</option>
            <option value="balance">God kvalitet / pris</option>
            <option value="premium">Høj kvalitet</option>
          </select>
        </div>

        {/* DESCRIPTION */}
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

        {/* CTA */}
        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-sm transition disabled:opacity-50"
        >
          {loading ? "Sender..." : "Få tilbud"}
        </button>

        {/* STATUS */}
        <p className="text-sm text-center text-gray-600">{status}</p>

      </form>
    </div>
  );
}
