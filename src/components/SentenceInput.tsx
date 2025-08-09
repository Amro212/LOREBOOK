"use client";

import { useMemo, useState } from "react";
import { MAX_SENTENCE_LENGTH, MOOD_EMOJIS } from "@/lib/constants";

type Props = {
  onSubmit?: (payload: { text: string; mood: string }) => Promise<void> | void;
};

export default function SentenceInput({ onSubmit }: Props) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState(MOOD_EMOJIS[0]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | { kind: "ok" | "error"; msg: string }>(null);

  const remaining = useMemo(() => MAX_SENTENCE_LENGTH - text.length, [text.length]);
  const disabled = loading || text.trim().length === 0 || text.length > MAX_SENTENCE_LENGTH;

  async function handleSubmit() {
    if (disabled) return;
    setLoading(true);
    setStatus(null);
    try {
      await onSubmit?.({ text: text.trim(), mood });
      setStatus({ kind: "ok", msg: "✅ Sentence added" });
      setText("");
    } catch (e) {
      setStatus({ kind: "error", msg: e instanceof Error ? e.message : "Submission failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-[rgba(232,181,126,0.25)] p-3 bg-white/5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add one sentence to the chapter…"
          rows={4}
          className="w-full resize-none bg-transparent outline-none"
          maxLength={MAX_SENTENCE_LENGTH + 50}
        />
        <div className="mt-2 flex items-center justify-between text-sm">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {MOOD_EMOJIS.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`rounded-md border px-2 py-1 transition ${
                  mood === m ? "border-[rgba(232,181,126,0.6)] bg-white/10" : "border-white/10 hover:bg-white/5"
                }`}
                aria-pressed={mood === m}
              >
                {m}
              </button>
            ))}
          </div>
          <span className={remaining < 0 ? "text-red-500" : "opacity-70"}>{remaining}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={disabled}
          className="rounded-full border border-[rgba(232,181,126,0.45)] px-5 py-2 hover:bg-white/10 enabled:shadow-[0_0_18px_rgba(232,181,126,0.25)] transition disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit"}
        </button>
        {status && (
          <span className={`text-sm ${status.kind === "ok" ? "text-emerald-400" : "text-red-400"}`}>
            {status.msg}
          </span>
        )}
      </div>
    </div>
  );
}


