import Link from "next/link"
import { Hammer } from "lucide-react"
import HeroSlider from "@/components/HeroSlider"

export default function Page(){

  return(

    <div>

      {/* 🔥 HERO */}
<section className="max-w-6xl mx-auto px-4">

        {/* 🔥 WRAPPED HERO BLOCK */}
        <div className="grid md:grid-cols-2 gap-12 items-center bg-white p-8 rounded-3xl shadow-lg">

          {/* 🟢 LEFT: CONTENT + CARDS */}
          <div>

            {/* ✅ FIXED: LEFT-ALIGNED PILL (IN FLOW) */}
<div className="mb-6">
  <div className="inline-block bg-blue-600 text-white text-sm px-5 py-3 rounded-xl shadow-md">
    GodMatch forbinder dig med håndværkere klar til at tage din opgave
  </div>
</div>

<h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 max-w-xl">
              Bliv kontaktet af relevante håndværkere
            </h1>

            <p className="text-gray-600 mb-6">
              Badeværelse · Renovering · Køkken · El · Gratis og uforpligtende
            </p>

            {/* 🔥 CARDS CONTAINER */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">

              {/* ✅ INSIDE CONTAINER */}
              <p className="text-sm font-medium text-gray-900 mb-4">
                Vælg serviceområde
              </p>

              <div className="flex flex-col gap-4">

                <Link href="/totalentreprise" className="group">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition">
                    <div className="text-3xl">🏗️</div>
                    <div>
                      <h3 className="font-semibold group-hover:text-blue-600">
                        Totalentreprise
                      </h3>
                      <p className="text-sm text-gray-500">
                        Alt samlet ét sted
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href="/toemrer" className="group">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition">
                    <Hammer className="w-8 h-8 text-gray-800" />
                    <div>
                      <h3 className="font-semibold group-hover:text-blue-600">
                        Tømrer
                      </h3>
                      <p className="text-sm text-gray-500">
                        Terrasse · gulv
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href="/murer" className="group">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition">
                    <div className="text-3xl">🧱</div>
                    <div>
                      <h3 className="font-semibold group-hover:text-blue-600">
                        Murer
                      </h3>
                      <p className="text-sm text-gray-500">
                        Facade · tilbygning
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href="/el" className="group">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition">
                    <div className="text-3xl">⚡</div>
                    <div>
                      <h3 className="font-semibold group-hover:text-blue-600">
                        Elektriker
                      </h3>
                      <p className="text-sm text-gray-500">
                        Installation · fejlfinding
                      </p>
                    </div>
                  </div>
                </Link>

                <Link href="/badevaerelse" className="group">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition">
                    <div className="text-3xl">🚿</div>
                    <div>
                      <h3 className="font-semibold group-hover:text-blue-600">
                        Badeværelse
                      </h3>
                      <p className="text-sm text-gray-500">
                        Renovering
                      </p>
                    </div>
                  </div>
                </Link>

              </div>

            </div>

          </div>

          {/* 🔵 RIGHT: SLIDER */}
          <div className="relative mt-12 md:mt-0">

            <div className="absolute -inset-2 bg-blue-50 rounded-2xl blur-lg opacity-20"></div>

            <div className="relative">
              <HeroSlider />
            </div>

          </div>

        </div>

      </section>


      {/* 🔥 HOW IT WORKS */}
      <section className="bg-slate-50 mt-28 py-20">

        <div className="max-w-5xl mx-auto px-4 text-center">

          <h2 className="text-3xl font-semibold mb-14">
            Sådan fungerer det
          </h2>

          <div className="grid md:grid-cols-3 gap-12">

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-lg">1. Beskriv opgaven</h3>
              <p className="text-gray-500 mt-2">1 minut</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-lg">2. Vi matcher</h3>
              <p className="text-gray-500 mt-2">op til 3 håndværker-firmaer</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium text-lg">3. Få kontakt</h3>
              <p className="text-gray-500 mt-2">Gratis</p>
            </div>

          </div>

        </div>

      </section>


      {/* 🔥 CTA */}
      <section className="mt-24 text-center">

        <Link
          href="/totalentreprise"
          className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg hover:bg-blue-700 transition shadow-md"
        >
          Start totalentreprise projekt nu 
        </Link>

      </section>

    </div>

  )

}
