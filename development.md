# Development & Architecture Guidelines

## Tech Stack & Dependencies
* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS, Shadcn UI
* **Icons:** `lucide-react`
* **AI Orchestration:** `ai` (Vercel AI SDK), `@ai-sdk/openai`, `@ai-sdk/react`
* **Database & Auth:** `@supabase/supabase-js`, `@supabase/ssr`
* **Live Sandbox:** `@codesandbox/sandpack-react`
* **Visualization Graph:** `reactflow`

## Architecture Rules
1. **Server-Side AI:** ALL AI SDK calls (`streamText`, `generateObject`) must occur on the backend via Next.js Route Handlers to protect API keys and avoid CORS issues.
  - For OpenAI-compatible providers (e.g., Kimi/Moonshot), configure `OPENAI_BASE_URL` + `OPENAI_MODEL` in environment variables.
2. **Sandbox Implementation:** Use Sandpack to render the code. The Next.js state should hold the raw generated code string and pass it dynamically into the `<Sandpack />` component's `files` property.
3. **SSR Hydration:** To prevent layout shifts with Sandpack in Next.js, implement the `getSandpackCssText` utility injected into the root layout's `<head>`.[4]
4. **Database Security:** Use Supabase Row Level Security (RLS) to ensure users can only read/write their own saved projects.
5. **Auth Guard:** `/workspace` is protected by Next.js Proxy (`proxy.ts`). Keep this in sync when changing auth flows.

## UI/UX Layout
* Use a split-pane layout: 
  * Left Panel: Conversational UI (Chat interface) and the Multi-Agent Visualization Graph.
  * Right Panel: The live Sandpack interactive preview.

## Phase 2 Implementation Notes
* Sandpack SSR styles are injected via `getSandpackCssText` in `src/app/sandpack-registry.tsx`.
* The split-pane workspace UI lives in `src/app/workspace/page.tsx` and uses
  `src/components/workspace/sandpack-preview.tsx` for the static preview.

## Auth Testing Notes
* Supabase email/password auth requires **real email addresses**. Fake emails
  will not receive confirmation links.
* The confirmation link uses `NEXT_PUBLIC_SITE_URL`. For local dev, keep it as
  `http://localhost:3000`. For Vercel deployments, update it to your live URL
  and whitelist that URL in Supabase → Auth → URL Configuration.
* Errors like `otp_expired` or `access_denied` typically mean the confirmation
  link expired or points at the wrong site URL.

## Public Repo Setup Checklist
* Copy `.env.example` to `.env.local` and fill in your own keys.
* Create a Supabase project and set **Site URL** + **Redirect URLs**.
* For Vercel deployments, set environment variables in the Vercel dashboard.
* AI API keys are only required starting in Phase 3.
* For OpenAI-compatible providers, add `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `OPENAI_MODEL`.
