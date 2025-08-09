# 🛠️ Lorebook MVP Build Plan

This document outlines a step-by-step build sequence to create the MVP of Lorebook. Each task is focused on a single unit of functionality and should be executed and tested before moving on.

---

## ✅ Setup & Configuration

1. **Initialize Next.js Project**  
   - Create a new Next.js app using the App Router (Next.js 13+).  
   - Include TypeScript and Tailwind CSS.  
   - Confirm development server runs with no errors.

2. **Setup Tailwind CSS**  
   - Configure `tailwind.config.ts` and `globals.css`.  
   - Add base styles for body, inputs, and headings.  
   - Verify Tailwind classes work in a test component.

3. **Initialize Supabase Project**  
   - Create a Supabase project.  
   - Generate public + secret API keys.  
   - Enable email-less auth (username + password only).

4. **Connect Supabase Client to Frontend**  
   - Create `/lib/supabase.ts` to initialize the client.  
   - Use environment variables for keys.  
   - Test by fetching the current user session.

---

## 👤 Authentication

5. **Build Auth Modal UI**  
   - Create `AuthModal.tsx` with username/password inputs.  
   - Add open/close logic via Zustand or local state.
   - Style with parchment glow and mystical accents.

6. **Implement Signup Functionality**
   - Use Supabase Auth API to register users.  
   - On signup, insert `{ username, ip_address, created_at }` into `users` table.  
   - Show success message and close modal.

7. **Implement Login Functionality**
   - Use Supabase Auth API to log in.  
   - On success, store user in Zustand store.  
   - Show error on incorrect credentials.

8. **Protect Routes via Middleware**  
   - Create `middleware.ts` to guard `/dashboard`.  
   - Redirect unauthenticated users back to home.

---

## 🎨 Frontend UI Construction (Layout + Styling)

9. **Create Global App Layout (`app/layout.tsx`)**  
   - Wrap all pages in `<Navbar />`, `<main>{children}</main>`, and `<Footer />`.  
   - Apply parchment-texture background and responsive container.

10. **Build `Navbar.tsx`**  
    - Left: Lorebook logo/name.  
    - Right: “Sign In” / “Sign Up” button.  
    - Add glowing hover animation; make sticky on scroll.

11. **Build `Footer.tsx`**  
    - Include “© 2025 Lorebook. X Chapters written.”  
    - Optional rotating lore-themed quote.  
    - Fade-in animation on load.

12. **Structure Homepage Layout (`app/page.tsx`)**  
    - Vertical flow: Hero → Sentence Preview → Chapter Archive.  
    - Use Tailwind spacing/utilities for consistent rhythm.  
    - Verify layout on desktop and mobile widths.

13. **Build Hero Section**  
    - Add tagline text:
      > “You’ve stumbled upon a living book, written by thousands, read by none in full. Every person may add only one sentence. The rest is hidden in shadow.”  
    - Add CTA button: “✍️ Create your account and shape the story”  
    - Style: gold/beige serif text, fade-in animation, parchment glow backdrop.

14. **Style Sentence Preview Section**  
    - Create `SentencePreview.tsx` to display last 5 sentences.  
    - Use serif font (e.g., Cormorant) and mood emoji per line.  
    - Animate new entries with fade-in/glow.

15. **Build Sentence Input Component (`SentenceInput.tsx`)**  
    - Parchment-style textarea (max 280 chars) + live character count.  
    - Emoji mood selector (horizontal scroll on mobile).  
    - “Submit” button with glowing hover/focus outline.

16. **Add Responsive Mobile Support**  
    - Test hero, preview, and input on 375px width.  
    - Collapse `Navbar` into hamburger menu if needed.  
    - Use responsive Tailwind classes (`md:flex-row`, `lg:w-1/2`, etc.).

17. **Implement Loading & Error States**  
    - Show “Submitting…” on button during sentence send.  
    - Show “✅ Sentence added” on success.  
    - Show “❌ You’ve already contributed” on duplicate submission.

18. **Animate Sentence Submission UX**  
    - On submission, briefly glow the new sentence.  
    - Optional sparkle effect or sound cue.  
    - Disable further input until next chapter.

---

## 🗃️ Database Setup

19. **Create Supabase Table: `chapters`**  
    - Columns: `id (PK)`, `created_at`, `is_active`.  
    - Manually insert initial chapter with `is_active = true`.

20. **Create Supabase Table: `users`**  
    - Columns: `id (PK)`, `username (unique)`, `ip_address (unique)`, `created_at`.

21. **Create Supabase Table: `sentences`**  
    - Columns: `id (PK)`, `text`, `mood`, `chapter_id (FK)`, `user_id (FK)`, `created_at`.

22. **Add Supabase RLS (Row-Level Security)**  
    - Allow inserts only for authenticated users.  
    - Enforce 1 sentence per user per chapter via policy.  
    - Enforce 1 account per IP via a custom RPC in `users`.

---

## ✍️ Sentence Submission

23. **Build Submission API Route (`/app/api/submit-sentence.ts`)**  
    - Validate: non-empty, ≤280 chars, valid mood.  
    - Check via RLS or server logic that user hasn’t submitted.  
    - Insert into `sentences`.  
    - Return JSON `{ success: boolean, position?: number }`.

24. **Hook up `SentenceInput` to API**  
    - POST user input to `/api/submit-sentence`.  
    - On success, update Zustand store and UI state.  
    - On failure, display error.

25. **Disable Input After Submission**  
    - Read Zustand flag `hasSubmitted`.  
    - Hide or disable `SentenceInput.tsx` if true.

---

## 📜 Story Viewing

26. **Create Preview API Route (`/app/api/get-last-sentences.ts`)**  
    - Query last 5 rows from `sentences` where `chapter_id = active`.  
    - Sort `created_at DESC`.  
    - Return JSON array.

27. **Subscribe to Supabase Realtime**  
    - In `SentencePreview.tsx`, subscribe to `sentences` INSERT events.  
    - On new event, prepend to preview list and trigger fade-in.

28. **Test Live Updates**  
    - Open two browser windows.  
    - Submit a sentence in one; verify real-time update in the other.

---

## 📚 Chapter Archiving

29. **Auto-archive on 100th Sentence**  
    - Create Supabase trigger or Cron:  
      1. When `sentences` count for active chapter hits 100:  
         - Set current `chapters.is_active = false`.  
         - Insert new active chapter row.

30. **Build `ChapterCard.tsx`**  
    - Display archived chapter number, creation date, placeholder cover image.  
    - Click navigates to `/chapter/[id]`.

31. **Create Chapter Page (`/app/chapter/[id]/page.tsx`)**  
    - Fetch all 100 sentences for given `id`.  
    - Render as parchment scroll with username + emoji per line.

---

## 🧑‍💻 User Dashboard

32. **Create Dashboard Page (`/app/dashboard/page.tsx`)**  
    - Greet user: “Welcome, **{username}**”  
    - Show “Your Contributions” list (sentence & chapter).  
    - Show current chapter status: “Ready to contribute” or “Already contributed”.

---

## 🪄 UI Polish & Theming

33. **Add Global Color Palette & Fonts**  
    - Configure Tailwind theme for parchment background, gold/beige text, accent glows.  
    - Import and apply serif font for story, sans-serif for UI.

34. **Enhance Animations**  
    - Add hover/focus glow on buttons.  
    - Fade-in effects on page transitions.  
    - Subtle parchment scroll parallax on archive page.

35. **Finalize Mobile Touch Interactions**  
    - Tap ripple/glow on buttons.  
    - Smooth input focus scroll into view.  
    - Test on iOS Safari and Android Chrome.

---

## 📦 Optional Add-ons (Stretch Goals)

36. **Track Chapter Mood Stats**  
    - On archive, count emojis and display dominant mood badge.

37. **AI Cover Art Generator (Placeholder)**  
    - Build endpoint to generate prompt from mood stats.  
    - Display generated image in `ChapterCard`.

38. **Leaderboard & Reactions**  
    - Build sentence “like” endpoint; allow 1 reaction per user.  
    - Create `/leaderboard` page showing top contributors and moods.

---

## 🚀 Final Deployment

39. **Deploy Frontend to Vercel**  
    - Connect GitHub repo.  
    - Set environment variables (`SUPABASE_URL`, `SUPABASE_KEY`).

40. **Configure Supabase Production**  
    - Enable RLS policies in production.  
    - Set up any scheduled functions (cron).

41. **Test & Launch**  
    - Verify signup, login, submission, live preview, archiving workflow.  
    - Test across devices.  
    - Announce launch!

---
