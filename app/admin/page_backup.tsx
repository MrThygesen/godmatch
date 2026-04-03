//app/admin/page.tsx
"use client"

import { useEffect, useState } from "react"

type Lead = {
  id: string
  category: string
  task_type?: string
  zip_code: string
  name: string
  phone: string
  contact_time?: string
  property_type?: string
}

type Contractor = {
  id: string
  company_name: string
  email?: string
}

export default function Admin(){

  const [tab,setTab] = useState<"inbox"|"sent">("inbox")

  const [leads,setLeads] = useState<Lead[]>([])
  const [selectedLead,setSelectedLead] = useState<Lead | null>(null)

  const [contractors,setContractors] = useState<Contractor[]>([])
  const [selectedContractors,setSelectedContractors] = useState<Contractor[]>([])

  const [message,setMessage] = useState("")
  const [contactTime,setContactTime] = useState("")
  const [sendToCustomer,setSendToCustomer] = useState(false)

  // 🔥 LOAD DATA BASED ON TAB
  useEffect(()=>{
    const url = tab === "inbox"
      ? "/api/leads/inbox"
      : "/api/leads/sent"

    fetch(url)
      .then(res=>res.json())
      .then(setLeads)

  },[tab])

  async function openLead(lead: Lead){
    setSelectedLead(lead)
    setSelectedContractors([])
    setMessage("")
    setSendToCustomer(false)

    const res = await fetch(`/api/contractors/list?category=${lead.category}`)
    const data = await res.json()
    setContractors(data)
  }

  async function sendLead(){

    if(!selectedLead) return

    await fetch("/api/leads/send",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        lead: selectedLead,
        contractors: selectedContractors,
        message: sendToCustomer ? message : "",
        contactTime
      })
    })

    alert("✅ Udført")

    setSelectedLead(null)
    setSelectedContractors([])
    setMessage("")
    setSendToCustomer(false)

    // reload
    setTab("inbox")
  }

  return(

  <div className="max-w-5xl mx-auto mt-10">

    <h1 className="text-2xl font-semibold mb-6">Leads</h1>

    {/* 🔥 TABS */}
    <div className="flex gap-4 mb-6">
      <button
        onClick={()=>setTab("inbox")}
        className={`px-4 py-2 rounded ${tab==="inbox"?"bg-blue-600 text-white":"bg-gray-100"}`}
      >
        Indkommende
      </button>

      <button
        onClick={()=>setTab("sent")}
        className={`px-4 py-2 rounded ${tab==="sent"?"bg-blue-600 text-white":"bg-gray-100"}`}
      >
        Afsendte
      </button>
    </div>

    {/* 🔥 LIST */}
    {leads.map(lead=>(
      <div key={lead.id} className="border p-4 mb-4 rounded flex justify-between">

        <div>
          <p className="font-medium">
            {lead.category} – {lead.task_type || "-"}
          </p>
          <p className="text-sm text-gray-500">{lead.zip_code}</p>
          <p className="text-sm">{lead.name} – {lead.phone}</p>
        </div>

        {tab === "inbox" && (
          <button
            onClick={()=>openLead(lead)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Åbn
          </button>
        )}
      </div>
    ))}

    {/* 🔥 MODAL */}
    {selectedLead && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

        <div className="bg-white p-6 rounded-xl w-[420px]">

          <h2 className="font-semibold mb-4">
            {selectedLead.name}
          </h2>

          {/* Contractors */}
          <div className="mb-4">
            {contractors.map(c=>(
              <label key={c.id} className="block text-sm">
                <input
                  type="checkbox"
                  onChange={(e)=>{
                    if(e.target.checked){
                      setSelectedContractors(p=>[...p,c])
                    } else {
                      setSelectedContractors(p=>p.filter(x=>x.id!==c.id))
                    }
                  }}
                />
                {c.company_name}
              </label>
            ))}
          </div>

          {/* Customer toggle */}
          <label className="flex gap-2 text-sm mb-2">
            <input
              type="checkbox"
              checked={sendToCustomer}
              onChange={(e)=>setSendToCustomer(e.target.checked)}
            />
            Send mail til kunde
          </label>

          <textarea
            placeholder="Besked"
            disabled={!sendToCustomer}
            className="border p-2 w-full mb-3"
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
          />

          <button
            onClick={sendLead}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Udfør handling
          </button>

        </div>

      </div>
    )}

  </div>
  )
}
