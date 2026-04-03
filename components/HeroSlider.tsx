    "use client";

import { useEffect, useState } from "react";

const slides = [
  { src: "/images/bathroom2.jpg", text: "Nyt badeværelse?" },
  { src: "/images/house4.jpg", text: "Renovering eller tilbygning?" },
  { src: "/images/kitchen1.jpg", text: "Behov for hjælp til nyt køkken" },
  { src: "/images/room2.jpg", text: "Find håndværkere i dit område" },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(index);
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // ⏱ slower = less distracting

    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="w-full h-[340px] rounded-xl overflow-hidden shadow-lg relative">

      {/* Previous image */}
      <img
        src={slides[prevIndex].src}
        className="absolute inset-0 w-full h-full object-cover brightness-90"
        alt=""
      />

      {/* Current image */}
      <img
        src={slides[index].src}
        className="absolute inset-0 w-full h-full object-cover animate-fadeZoom brightness-90"
        alt=""
      />

      {/* Softer overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

      {/* TEXT */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
        <p className="text-xs text-white/70 mb-1">GodMatch</p>
        <h2 className="text-white text-lg md:text-xl font-semibold max-w-md">
          {slides[index].text}
        </h2>
      </div>

    </div>
  );
}
