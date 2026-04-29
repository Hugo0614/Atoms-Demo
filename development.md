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

## Implementation Approach & Key Trade-offs
### Why this stack
* **Next.js + Vercel:** tight integration with Route Handlers and streaming responses, fast deploy iterations, and an App Router architecture that matches the project’s server/client split.
* **Supabase:** managed Postgres with Auth + RLS baked in, minimizing custom backend code while keeping ownership of data models.
* **Kimi (OpenAI-compatible):** cost-effective, fast response times, and easy drop-in via `OPENAI_BASE_URL` + model overrides using the Vercel AI SDK.
* **Sandpack:** reliable in-browser code execution with a familiar React-file model for live previews.

### Design decisions
* **Server-only AI calls:** enforced via Route Handlers to avoid key leakage and CORS issues.
* **State-driven Sandpack:** generated code is stored as raw strings in React state and passed through `files` for deterministic rendering.
* **SSR CSS injection:** prevents Sandpack layout shifts while preserving Next.js streaming behavior.
* **Proxy-based auth guard:** keeps `/workspace` protection centralized and consistent across routes.

### Trade-offs & compromises
* **Vercel lock-in vs. speed:** optimized for Vercel’s hosting model; portability is lower but iteration speed is higher.
* **Supabase convenience vs. flexibility:** simplifies auth + storage at the expense of deeper control over auth flows.
* **Strict code-only AI output:** reduces hallucinated prose, but can be brittle when the model needs to explain changes.
* **Sandpack performance:** great for quick demos but heavier than a custom preview pipeline for large codebases.

## Current Progress & Completion Status
### Implemented
* **Auth flow:** sign-up/login pages, Supabase SSR clients, protected `/workspace` routing.
* **Workspace UI:** split-pane layout, Sandpack SSR CSS injection, live preview wiring.
* **AI streaming:** `/api/chat` route with `streamText`, `useChat` integration, and Sandpack file updates.
* **Env setup guidance:** README notes for Supabase + Vercel configuration.

### Pending (Phase 4)
* **Data persistence:** define `projects` schema (id, user_id, code_content, created_at) with RLS.
* **Save/load flow:** persist Sandpack state + chat history, and list saved projects.
* **Workspace layout:** shift to 3-pane (history, chat, preview) with preview mode toggles.

### Known issues / risks
* **Deployment config drift:** Vercel envs and Supabase Auth URLs must stay in sync to avoid `access_denied` or `otp_expired`.
* **RLS gaps:** Phase 4 requires careful policy setup to prevent cross-user access.
