//admin/contractors/ContractorsClient.tsx

"use client"

import { useState } from "react"

export default function Contractors(){

const [status,setStatus] = useState("")

async function submit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()

  const form = new FormData(e.currentTarget)
  const data = Object.fromEntries(form)

  await fetch("/api/contractors", {
    method: "POST",
    body: JSON.stringify(data)
  })

  setStatus("✅ Gemt")
  e.currentTarget.reset()
}

return(

<div className="max-w-xl mx-auto mt-10">

<h1 className="text-2xl font-semibold mb-6">
Tilføj håndværker
</h1>

<form onSubmit={submit} className="flex flex-col gap-3">

<input name="company_name" placeholder="Firmanavn" required className="border p-3 rounded"/>
<input name="contact_name" placeholder="Kontaktperson" className="border p-3 rounded"/>
<input name="phone" placeholder="Telefon" className="border p-3 rounded"/>
<input name="email" placeholder="Email" required className="border p-3 rounded"/>

<select name="category" className="border p-3 rounded">
<option value="toemrer">Tømrer</option>
<option value="murer">Murer</option>
<option value="el">El</option>
<option value="badevaerelse">Badeværelse</option>
<option value="totalentreprise">Totalentreprise</option>
</select>

<input name="zip_codes" placeholder="fx 4000,4100,4200" className="border p-3 rounded"/>

<button className="bg-blue-600 text-white py-3 rounded">
Gem håndværker
</button>

<p className="text-green-600">{status}</p>

</form>

</div>

)
}
