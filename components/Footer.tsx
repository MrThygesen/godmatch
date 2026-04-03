export default function Footer() {
  return (
    <footer className="mt-32 border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10 text-sm items-start">

        {/* 🔵 Brand (pill style like pre-header) */}
        <div>
        <div className="inline-block bg-blue-600 text-white px-5 py-3 rounded-xl shadow-md">
  <h3 className="font-semibold text-base leading-tight">
    GodMatch
  </h3>
  <p className="text-blue-100 text-sm mt-1">
    Bliv kontaktet af lokale håndværkere
  </p>
</div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold mb-2">Links</span>
          <a href="/faq" className="text-gray-600 hover:text-blue-600 transition">
            FAQ
          </a>
          <a href="/kontakt" className="text-gray-600 hover:text-blue-600 transition">
            Samarbejde med GodMatch 
          </a>
        </div>

        {/* 🔘 Contact (light emphasis) */}
        <div>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
            <span className="font-semibold mb-2 block text-gray-900">
              Kontakt
            </span>
            <p className="text-gray-700">info@godmatch.dk</p>
          </div>
        </div>

      </div>

      <div className="text-center text-xs text-gray-400 pb-6">
        © {new Date().getFullYear()} GodMatch
      </div>
    </footer>
  )
}
