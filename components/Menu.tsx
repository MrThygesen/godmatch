import Link from "next/link";

export default function Menu() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b bg-white">

      {/* LOGO */}

      <Link href="/" className="font-semibold text-xl tracking-tight">
        GodMatch
      </Link>

      {/* MENU */}

      <div className="flex gap-8 text-sm">

        {[
          { href: "/totalentreprise", label: "Totalentreprise" },
          { href: "/toemrer", label: "Tømrer" },
          { href: "/murer", label: "Murer" },
          { href: "/el", label: "El" },
          { href: "/badevaerelse", label: "Badeværelse" },
          { href: "/faq", label: "FAQ" },
        ].map((item) => (

          <Link
            key={item.href}
            href={item.href}
            className="group relative text-gray-700 hover:text-blue-600 transition"
          >

            {item.label}

            {/* underline animation */}
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>

          </Link>

        ))}

      </div>

    </nav>
  );
}
