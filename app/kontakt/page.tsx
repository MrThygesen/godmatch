"use client"

import { useState } from "react"

export default function Kontakt() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setStatus("")

    const formElement = e.currentTarget
    const form = new FormData(formElement)

    const data = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      message: String(form.get("message") || ""),
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      // 🔥 CRITICAL: safe parsing
      let result: any = null

      try {
        result = await res.json()
      } catch (err) {
        console.error("JSON parse error:", err)
      }

      console.log("RESPONSE:", res.status, result)

      // ✅ SUCCESS (even if JSON fails)
      if (res.ok) {
        setStatus("✅ Tak! Vi vender tilbage hurtigst muligt.")
        formElement.reset()
        return
      }

      // ❌ API error
      setStatus("❌ " + (result?.error || "Noget gik galt"))

    } catch (err) {
      console.error("FETCH ERROR:", err)
      setStatus("❌ Netværksfejl – prøv igen")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 mt-16">

      <h1 className="text-3xl font-semibold mb-4">
        Kontakt
      </h1>

      <p className="text-gray-600 mb-8">
        Vil din virksomhed samarbejde med GodMatch, eller har du andre forespørgsler? Så skriv her.
      </p>

      <form onSubmit={submit} className="flex flex-col gap-4">

        <input
          name="name"
          placeholder="Navn"
          required
          className="border p-3 rounded-xl"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="border p-3 rounded-xl"
        />

        <textarea
          name="message"
          placeholder="Besked"
          required
          className="border p-3 rounded-xl min-h-[120px]"
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Sender..." : "Send besked"}
        </button>

        <p className="text-sm text-gray-500 text-center">{status}</p>

      </form>
    </div>
  )
}
