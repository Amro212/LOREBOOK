🏗️ Lorebook App Architecture
🧱 Stack Overview
| Layer          | Technology          | Purpose                                  |
| -------------- | ------------------- | ---------------------------------------- |
| **Frontend**   | `Next.js`           | React framework for SSR + static pages   |
| **Styling**    | `Tailwind CSS`      | Utility-first CSS styling                |
| **Backend**    | `Supabase`          | Auth, database (PostgreSQL), API routing |
| **State**      | `Zustand`           | Lightweight state management             |
| **Realtime**   | `Supabase Realtime` | Listen to new sentences as they’re added |
| **Deployment** | `Vercel`            | Host frontend (or self-host)             |


📁 File + Folder Structure

/LOREBOOK
│
├── public/                     # Static assets (icons, cover images, etc.)
│
├── styles/                    # Global + custom styles
│   └── globals.css
│
├── components/                # Reusable UI components
│   ├── SentencePreview.tsx
│   ├── SentenceInput.tsx
│   ├── ChapterCard.tsx
│   ├── AuthModal.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
│
├── app/                       # App router (Next.js 13+)
│   ├── layout.tsx             # Global layout wrapper
│   ├── page.tsx               # Home page
│   ├── dashboard/             # Authenticated user dashboard
│   │   └── page.tsx
│   ├── chapter/               # Dynamic chapter pages
│   │   └── [id]/page.tsx
│   └── api/                   # API routes for server logic
│       ├── submit-sentence.ts
│       └── get-last-sentences.ts
│
├── lib/                       # Shared logic & utils
│   ├── supabase.ts            # Supabase client initialization
│   ├── constants.ts           # App-wide constants (max characters, chapter size, etc.)
│   └── utils.ts               # Text formatting, emoji mapping, etc.
│
├── store/                     # Zustand state stores
│   └── useUserStore.ts
│
├── middleware.ts              # Middleware for route protection
├── tailwind.config.ts
├── .env.local                 # Supabase keys + environment vars
├── next.config.js
└── package.json

🔌 Services & Integrations
🧠 Supabase (Auth + Database + Realtime)
Auth: Username + password (no email)

Use auth.users for account creation

Store IP address in a separate table to block duplicate entries

Database Tables:

users: { id, username, ip_address, created_at }

sentences: { id, text, mood, chapter_id, user_id, created_at }

chapters: { id, created_at, is_active }

Policies: Use RLS to ensure:

1 sentence per user per chapter

Prevent non-authenticated users from submitting

Enforce IP uniqueness using RPC function (custom check)

Realtime:

Use Supabase Realtime on sentences table to update preview when a new sentence is submitted


🧠 Where State Lives

| State              | Location             | Managed With                   |
| ------------------ | -------------------- | ------------------------------ |
| Auth User          | `useUserStore.ts`    | Zustand + Supabase client      |
| Current Chapter    | Supabase `chapters`  | Fetched via SWR or query       |
| Sentence Preview   | Local page state     | Supabase Realtime subscription |
| Auth Modal Open    | Global UI state      | Zustand                        |
| Submission Lockout | Server-side enforced | Supabase + RLS                 |


⚙️ What Each Part Does

/components
SentencePreview.tsx
Displays the 5 most recent sentences of the current chapter

SentenceInput.tsx
Text area for submitting a sentence + mood emoji picker
Only shown if user hasn't submitted in current chapter

ChapterCard.tsx
Displays cover art + summary for archived chapters

AuthModal.tsx
Login/signup modal with username + password only
Validates IP and handles Supabase auth flow

Navbar.tsx / Footer.tsx
Themed nav and footer with mystical aesthetic


/app
page.tsx
Homepage showing story preview, hero text, CTA, and chapter archive

dashboard/page.tsx
Logged-in view showing user's previous sentences, active chapter status

chapter/[id]/page.tsx
View full 100-sentence archived chapters

api/submit-sentence.ts
Server route to:

Validate input length & auth

Check IP + user sentence status

Insert sentence into DB

Return success/failure

api/get-last-sentences.ts
Returns the latest 5 sentences from active chapter for homepage preview


/lib
supabase.ts
Shared instance of Supabase client

constants.ts
Constants like MAX_SENTENCE_LENGTH, CHAPTER_SIZE, MOOD_EMOJIS, etc.

utils.ts
Helper functions like formatSentence, slugifyUsername, emojiToColor


/store/useUserStore.ts
Zustand store for:

Authenticated user object

Auth modal open/close state

Sentence submission success flag

Sentence-in-progress state

🛠️ Middleware
middleware.ts
Protects dashboard & API routes from unauthenticated access
Could also redirect users who try to resubmit

🧪 Validation
Enforce 280 character max

Emoji/mood must be from whitelist

Sentence can’t be blank

1 sentence per user per chapter (validated server-side)

📱 Mobile Notes
Sticky sentence preview at top of screen

Sentence input expands like a messaging app

All cards + chapter list scroll naturally

Tap-to-reveal mood emoji menu

Light glow/tap animations on inputs & buttons


+## 🎨 Visual Design & Theming
+
+**Theme**  
+Dark parchment background with warm beige and gold accents, invoking an ancient mystical manuscript.
+
+**Fonts**  
+- **Story Text:** Elegant serif (e.g. Cormorant or Merriweather)  
+- **UI Elements:** Clean sans-serif (e.g. Inter or Manrope)
+
+**Color Palette**  
+| Element        | Color    |
+|:---------------|:---------|
+| Background     | `#1a1a1a` |
+| Primary Text   | `#f1e5c9` |
+| Highlight Text | `#ffd27f` |
+| Button Glow    | `#e8b57e` |
+| Accent Glows   | `#f3c98b` |
+
+**Core Animations**  
+- **Sentence Fade-In:** New sentences softly fade into view.  
+- **Glow on Hover:** Buttons and inputs glow subtly on hover/focus.  
+- **Sparkle Burst:** A quick sparkle effect when a sentence is submitted.  
+- **Parallax Scroll:** Subtle parallax on archived chapters to mimic page-turning.


🎨 Optional Add-ons
| Feature                | Description                                                         |
| ---------------------- | ------------------------------------------------------------------- |
| Cover art generator    | Use mood emojis to prompt AI image for chapter thumbnail            |
| Emoji leaderboard      | Track which emoji moods dominate a chapter                          |
| Sentence reactions     | React (1x per user) to other users’ sentences in archived chapters  |
| Invite-based referrals | Share your sentence # to invite others into the chapter             |
| Titles + achievements  | Auto-assign special roles (e.g., “Opener”, “Closer”, “Cliffhanger”) |


✅ Deployment Recommendations
| Service        | Purpose                     |
| -------------- | --------------------------- |
| **Vercel**     | Frontend hosting            |
| **Supabase**   | Auth, DB, realtime          |
| **Cloudflare** | IP geo-blocking (if needed) |
