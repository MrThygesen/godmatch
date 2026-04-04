"use client"

import Link from "next/link"
import { useState } from "react"

export default function Menu() {
  const [open, setOpen] = useState(false)

  const items = [
    { href: "/totalentreprise", label: "Totalentreprise" },
    { href: "/toemrer", label: "Tømrer" },
    { href: "/murer", label: "Murer" },
    { href: "/el", label: "El" },
    { href: "/badevaerelse", label: "Badeværelse" },
    { href: "/faq", label: "FAQ" },
  ]

  return (
    <nav className="border-b bg-white px-4 py-4">

      <div className="flex justify-between items-center">
        <Link href="/" className="font-semibold text-xl">
          GodMatch
        </Link>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-sm border px-3 py-1 rounded"
        >
          Menu
        </button>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-8 text-sm">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="flex flex-col gap-4 mt-4 md:hidden text-sm">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

    </nav>
  )
}
