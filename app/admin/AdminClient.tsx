//app/admin/adminClient.tsx
"use client"

import { useEffect, useState } from "react"

// 🔷 TYPES
type Lead = {
  id: string
  category: string
  task_type?: string
  zip_code: string
  name: string
  phone: string
  contact_time?: string
  property_type?: string
  budget?: string
  urgency?: string 
  service_level?: string
  created_at?: string

  contractor_id?: string
  company_name?: string
  lead_price?: number
}

type Contractor = {
  id: string
  company_name: string
  email?: string
  total_leads?: number
  price?: number
}

export default function AdminClient(){

  const [tab,setTab] = useState<"inbox" | "sent">("inbox")
  const [leads,setLeads] = useState<Lead[]>([])
  const [stats,setStats] = useState<Contractor[]>([])

  const [selectedLead,setSelectedLead] = useState<Lead | null>(null)
  const [contractors,setContractors] = useState<Contractor[]>([])
  const [selectedContractors,setSelectedContractors] = useState<Contractor[]>([])

  const [message,setMessage] = useState("")
  const [contractorContactTime,setContractorContactTime] = useState("")
  const [customerContactTime,setCustomerContactTime] = useState("")
  const [sendToCustomer,setSendToCustomer] = useState(false)

  const [loading,setLoading] = useState(false)

  // 🔥 LOAD
  useEffect(()=>{

    const url = tab === "inbox"
      ? "/api/leads/inbox"
      : "/api/leads/sent"

    fetch(url)
      .then(res=>res.json())
      .then(setLeads)
      .catch(()=>setLeads([]))

    fetch("/api/contractors/stats")
      .then(res=>res.json())
      .then(setStats)
      .catch(()=>setStats([]))

  },[tab])

  // 🔥 GROUP SENT LEADS (FIXED)
  
const groupedLeads = tab === "sent"
  ? Object.values(
      leads.reduce((acc: any, row: any) => {

        const id = String(row.id) // ✅ force string key

        if (!acc[id]) {
          acc[id] = {
            ...row,
            contractors: []
          }
        }

        // ✅ avoid duplicate contractors
        if (row.contractor_id) {

          const exists = acc[id].contractors.some(
            (c:any) => c.id === row.contractor_id
          )

          if (!exists) {
            acc[id].contractors.push({
              id: row.contractor_id,
              name: row.company_name,
              price: row.lead_price
            })
          }
        }

        return acc

      }, {})
    )
  : leads


  // 🔥 OPEN
  async function openLead(lead: Lead){

    if (tab !== "inbox") return

    setSelectedLead(lead)
    setSelectedContractors([])
    setMessage("")
    setSendToCustomer(false)

    try {
      const res = await fetch(`/api/contractors/list?category=${lead.category}`)
      const data = await res.json()
      setContractors(data)
    } catch {
      setContractors([])
    }
  }

  // 🔥 SEND
  async function sendLead(){

    if(!selectedLead || loading) return

    if (selectedContractors.length === 0 && !sendToCustomer) {
      alert("Vælg mindst én handling")
      return
    }

    if (sendToCustomer && message.trim().length === 0) {
      alert("Skriv en besked til kunden")
      return
    }

    setLoading(true)

    try {

      const res = await fetch("/api/leads/send", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          lead: selectedLead,
          contractors: selectedContractors,
          message: sendToCustomer ? message : "",
          contractorContactTime,
          customerContactTime
        })
      })

      if (!res.ok) throw new Error()

      alert("✅ Lead håndteret")

      setLeads(prev => prev.filter(l => l.id !== selectedLead.id))
      closeModal()

    } catch {
      alert("❌ Noget gik galt")
    } finally {
      setLoading(false)
    }
  }

  function closeModal(){
    setSelectedLead(null)
    setMessage("")
    setContractorContactTime("")
    setCustomerContactTime("")
    setSelectedContractors([])
    setSendToCustomer(false)
  }

  // 🔥 UI
  return(

  <div className="max-w-6xl mx-auto mt-10">

    <h1 className="text-2xl font-semibold mb-6">Leads</h1>

    {/* TABS */}
    <div className="flex gap-4 mb-6">
      <button onClick={()=>setTab("inbox")}
        className={`px-4 py-2 rounded ${tab==="inbox"?"bg-blue-600 text-white":"bg-gray-100"}`}>
        Indbakke
      </button>

      <button onClick={()=>setTab("sent")}
        className={`px-4 py-2 rounded ${tab==="sent"?"bg-blue-600 text-white":"bg-gray-100"}`}>
        Sendte leads
      </button>
    </div>

    {/* TABLE */}
    <div className="bg-white rounded-xl shadow border overflow-hidden">

      <div className="grid grid-cols-9 bg-gray-50 text-sm font-medium px-4 py-3 border-b">
        <div>Dato</div>
        <div>Kategori</div>
        <div>Navn</div>
        <div>Telefon</div>
        <div>Postnr</div>
        <div>Budget</div>
        <div>Urgency</div>
        <div>Service</div>
        <div>Kontakt</div>
      </div>

      {groupedLeads.map((lead:any)=>{

        const date = lead.created_at
          ? new Date(lead.created_at).toLocaleDateString("da-DK")
          : "-"

        return(
          <div
            key={`lead-${lead.id}`} // ✅ FIXED
            onClick={()=>openLead(lead)}
            className={`border-b ${tab==="inbox"?"hover:bg-gray-50 cursor-pointer":""}`}
          >

            <div className="grid grid-cols-9 px-4 py-3 text-sm">
              <div>{date}</div>
              <div className="capitalize">{lead.category}</div>
              <div className="font-medium">{lead.name}</div>
              <div>{lead.phone}</div>
              <div>{lead.zip_code}</div>
              <div>{lead.budget || "-"}</div>
              <div>{lead.urgency || "-"}</div>
              <div>{lead.service_level || "-"}</div>
              <div>{lead.contact_time || "-"}</div>
            </div>

            {/* CONTRACTORS */}
            {tab === "sent" && lead.contractors?.length > 0 && (
              <div className="bg-gray-50 px-6 pb-3 text-sm">
                {lead.contractors.map((c:any)=>(
                  <div key={`contractor-${c.id}`}> {/* ✅ FIXED */}
                    • {c.name} – <b>{c.price} kr</b>
                  </div>
                ))}
              </div>
            )}

          </div>
        )
      })}

      {groupedLeads.length === 0 && (
        <div className="p-6 text-center text-gray-400">
          Ingen leads
        </div>
      )}

    </div>

    {/* MODAL */}
    {selectedLead && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl w-[420px] max-h-[90vh] overflow-auto">

        <h2 className="font-semibold text-lg mb-2">Send lead</h2>

        <p className="text-sm text-gray-500 mb-4">
          {selectedLead.name} · {selectedLead.zip_code}
        </p>

        {/* CONTRACTORS */}
        <div className="mb-4">
          <p className="font-medium mb-2">Vælg håndværkere</p>

          {contractors.map((c)=>{

            const checked = selectedContractors.some(x => x.id === c.id)

            return (
              <div key={c.id} className="flex justify-between text-sm mb-2">

                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e)=>{
                      if(e.target.checked){
                        setSelectedContractors(prev=>[...prev, c])
                      } else {
                        setSelectedContractors(prev=>prev.filter(x=>x.id !== c.id))
                      }
                    }}
                  />
                  {c.company_name}
                </label>

                {checked && (
                  <input
                    type="number"
                    placeholder="Pris"
                    className="border px-2 py-1 rounded w-20 text-xs"
                    onChange={(e)=>{
                      const price = Number(e.target.value)
                      setSelectedContractors(prev =>
                        prev.map(x => x.id === c.id ? { ...x, price } : x)
                      )
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* CONTACT TIME */}
        <input
          placeholder="Hvornår skal håndværker kontakte kunden?"
          className="border p-2 mb-3 w-full rounded"
          value={contractorContactTime}
          onChange={(e)=>setContractorContactTime(e.target.value)}
        />

        {/* CUSTOMER */}
        <label className="flex gap-2 text-sm mb-2">
          <input
            type="checkbox"
            checked={sendToCustomer}
            onChange={(e)=>setSendToCustomer(e.target.checked)}
          />
          Send besked til kunde
        </label>

        <textarea
          placeholder="Besked til kunde"
          className="border p-2 mb-4 w-full rounded disabled:bg-gray-100"
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          disabled={!sendToCustomer}
        />

        {/* ACTIONS */}
        <div className="flex justify-between">
          <button onClick={closeModal}>Annuller</button>

          <button
            onClick={sendLead}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Sender..." : "Udfør"}
          </button>
        </div>

      </div>
    </div>
    )}

  </div>
  )
}
