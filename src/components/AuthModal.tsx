"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { isValidUsername, slugifyUsername } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-sm rounded-2xl border border-white/15 bg-white/90 dark:bg-black/80 p-5 shadow-xl dark:shadow-emerald-500/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-[-0.01em]">{mode === "signup" ? "Create account" : "Sign in"}</h2>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block opacity-80">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_name"
              className="w-full"
              autoComplete="username"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block opacity-80">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full"
              autoComplete="current-password"
            />
          </label>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        <div className="mt-5 flex gap-2 justify-between items-center">
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            className="text-xs opacity-75 hover:opacity-100"
          >
            {mode === "signup" ? "Have an account? Sign in" : "New here? Create account"}
          </button>
          <div className="flex gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5"
          >
            Close
          </button>
          <button
            onClick={async () => {
              setError(null);
              if (!isValidUsername(username)) {
                setError("Username must be 3–24 chars: letters, numbers, _ or -");
                return;
              }
              if (password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
              }
              setLoading(true);
              try {
                const clean = slugifyUsername(username);
                const fakeEmail = `${clean}@local.invalid`;
                if (mode === "signup") {
                  const { error: signUpError, data } = await supabase.auth.signUp({
                    email: fakeEmail,
                    password,
                    options: {
                      data: { username: clean },
                    },
                  });
                  if (signUpError) {
                    setError(signUpError.message);
                    setLoading(false);
                    return;
                  }
                  if (data.user) setUser(data.user);
                } else {
                  const { error: signInError, data } = await supabase.auth.signInWithPassword({
                    email: fakeEmail,
                    password,
                  });
                  if (signInError) {
                    setError(signInError.message);
                    setLoading(false);
                    return;
                  }
                  if (data.user) setUser(data.user);
                }
                onClose();
              } catch (e: unknown) {
                setError(e instanceof Error ? e.message : "Signup failed");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm bg-foreground text-background disabled:opacity-60"
          >
            {loading ? (mode === "signup" ? "Signing up..." : "Signing in...") : "Continue"}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}


