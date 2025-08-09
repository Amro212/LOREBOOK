"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthModal from "@/components/AuthModal";
import { useUserStore } from "@/store/useUserStore";
import { Cormorant } from "next/font/google";
import SentencePreview from "@/components/SentencePreview";
import SentenceInput from "@/components/SentenceInput";

const storySerif = Cormorant({ subsets: ["latin"], weight: ["400", "700"] });

export default function Home() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const setUser = useUserStore((s) => s.setUser);
  const setSession = useUserStore((s) => s.setSession);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(Boolean(data.session));
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      setSessionChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(Boolean(session));
      setSession(session ?? null);
      setUser(session?.user ?? null);
      // Write a lightweight auth cookie for middleware checks
      if (typeof document !== "undefined") {
        if (session) document.cookie = "lb_auth=1; path=/";
        else document.cookie = "lb_auth=; Max-Age=0; path=/";
      }
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen py-10">
      <main className="space-y-16">
        {/* Hero */}
        <section className="fade-in text-center md:text-left grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded-2xl border border-[rgba(232,181,126,0.25)]/40 p-6 md:p-8 bg-white/5 shadow-[0_0_60px_rgba(232,181,126,0.12)]">
            <h1 className={`${storySerif.className} text-[#f1e5c9] text-3xl md:text-5xl font-semibold tracking-tight mb-4`}>
              You’ve stumbled upon a living book
            </h1>
            <p className={`${storySerif.className} text-[#f1e5c9]/90 mb-6 leading-relaxed`}>
              written by thousands, read by none in full. Every person may add only one sentence. The rest is hidden in shadow.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <button
                onClick={() => setAuthOpen(true)}
                className="rounded-full border border-[rgba(232,181,126,0.45)] px-5 py-2 hover:bg-white/10 shadow-[0_0_24px_rgba(232,181,126,0.2)] transition"
              >
                ✍️ Create your account and shape the story
              </button>
              {sessionChecked && (
                <span className="text-xs self-center rounded-full px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-600/20">
                  {isAuthed ? "Session active" : "No session"}
                </span>
              )}
            </div>
          </div>
          <div className="h-40 md:h-56 rounded-xl border border-white/10 bg-white/5" />
        </section>

        {/* Sentence Preview placeholder */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Latest Sentences</h2>
          <SentencePreview />
        </section>

        {/* Chapter Archive placeholder */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Chapter Archive</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center opacity-80"
              >
                Chapter {i + 1} (placeholder)
              </div>
            ))}
          </div>
        </section>

        {/* Sentence Input */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Contribute</h2>
          <SentenceInput onSubmit={async () => {
            // Hooked to API in later tasks
            await new Promise((r) => setTimeout(r, 600));
          }} />
        </section>
      </main>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
