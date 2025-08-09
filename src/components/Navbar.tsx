"use client";

import { useUserStore } from "@/store/useUserStore";

export default function Navbar() {
  const openAuth = useUserStore((s) => s.openAuth);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="font-semibold tracking-wide">Lorebook</div>
        <button
          onClick={openAuth}
          className="text-sm rounded-full border border-white/15 px-4 py-1.5 hover:bg-white/10 transition"
        >
          Sign In / Sign Up
        </button>
      </div>
    </header>
  );
}


