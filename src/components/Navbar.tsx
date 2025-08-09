"use client";

import { useUserStore } from "@/store/useUserStore";
import { useEffect, useRef } from "react";
import { useGsapRegister, gsap } from "@/lib/gsap";

export default function Navbar() {
  const openAuth = useUserStore((s) => s.openAuth);
  const ref = useRef<HTMLElement | null>(null);
  useGsapRegister();
  useEffect(() => {
    if (!ref.current) return;
    const mm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mm.matches) return;
    gsap.fromTo(
      ref.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  }, []);
  return (
    <header ref={ref} className="sticky top-0 z-40 w-full border-b border-[color:var(--accent-border)] bg-[color:var(--bg)]/70 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--bg)]/60">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="font-semibold tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Lorebook</div>
        <button
          onClick={openAuth}
          className="text-sm rounded-full border border-[color:var(--gold-strong)]/40 px-4 py-1.5 hover:bg-[color:var(--panel)] transition shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_18px_rgba(232,181,126,0.25)]"
        >
          Sign In / Sign Up
        </button>
      </div>
    </header>
  );
}


