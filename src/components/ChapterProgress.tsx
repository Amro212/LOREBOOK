"use client";

import { useEffect, useRef } from "react";
import { useGsapRegister, gsap } from "@/lib/gsap";

type Props = {
  chapterRoman?: string; // e.g., IV
  progress?: number; // 0..100
};

export default function ChapterProgress({ chapterRoman = "IV", progress = 32 }: Props) {
  const barRef = useRef<HTMLDivElement | null>(null);
  useGsapRegister();
  useEffect(() => {
    const mm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mm.matches || !barRef.current) return;
    gsap.fromTo(
      barRef.current,
      { width: "0%" },
      { width: `${progress}%`, duration: 1, ease: "power2.out" }
    );
  }, [progress]);
  return (
    <div className="rounded-2xl border border-[color:var(--accent-border)] p-5 bg-[color:var(--panel)] shadow-[inset_0_0_120px_rgba(243,201,139,0.05)]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Chapter {chapterRoman}</h3>
        <span className="text-sm opacity-75">{progress} / 100</span>
      </div>
      <div className="h-2 rounded-full bg-black/30 overflow-hidden">
        <div ref={barRef} className="h-full bg-[color:var(--gold)]" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-sm opacity-75">When this fills, the page is turned.</p>
    </div>
  );
}


