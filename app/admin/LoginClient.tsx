"use client"

export default function LoginClient(){

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = new FormData(e.currentTarget)
    const password = form.get("password")

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    })

    if (res.ok) {
      location.reload()
    } else {
      alert("Forkert kode")
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow border w-[300px]"
      >
        <h2 className="font-semibold mb-4">Admin login</h2>

        <input
          name="password"
          type="password"
          placeholder="Adgangskode"
          className="border p-2 rounded w-full mb-3"
        />

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Log ind
        </button>
      </form>
    </div>
  )
}
