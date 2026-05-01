# Atoms AI Workspace Demo

This is a Next.js (App Router) demo inspired by Atoms.dev. It focuses on a Supabase-authenticated workspace that streams AI-generated UI code into a live sandbox.

## ✅ Achieved Features

- Supabase email/password sign up + log in.
- Protected `/workspace` route via Next.js Proxy (`proxy.ts`).
- 3-pane workspace (projects list, chat panel, sandbox preview).
- AI streaming via `/api/chat` and `useChat`, with code extraction to Sandpack files.
- Save/load projects (Supabase `projects` table + RLS).
- Sandbox controls: preview toggle + reset preview + closable file tabs.

## ⚠️ Not Yet Implemented (vs Atoms.dev)
- Multi-agent visualization (Planner / Coder / Reviewer state graph).
- Rich preset templates/modules for instant project bootstrapping.
- VSCode-level editor tooling (create/rename/delete files, advanced tabs, diagnostics).
- Stronger preview reliability when Sandpack bundler is blocked by network policies.
- More polished empty states, loading UX, and error surfaces.

## Environment Variables

Create a `.env.local` file using the template below:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
OPENAI_API_KEY=your-provider-key
OPENAI_BASE_URL=https://api.moonshot.cn/v1
OPENAI_MODEL=moonshot-v1-8k
# Optional allowlist for multi-model switching
# OPENAI_MODELS=moonshot-v1-8k,moonshot-v1-32k
```

> **Important:** Supabase email auth requires a real, reachable email address.
> Fake emails will not receive the confirmation link, and login will fail.

## ✅ Quick Setup (Supabase + Vercel)

### 1) Supabase Project
- Create a new Supabase project.
- Copy **Project URL** and **Anon/Publishable Key** into `.env.local`.
- In **Auth → URL Configuration**:
	- **Site URL**: set to your app URL.
		- Local: `http://localhost:3000`
		- Vercel: `https://your-app.vercel.app`
	- **Redirect URLs**: add the same URL(s).

### 2) Vercel Environment Variables
Set these in Vercel → Project → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (your live domain)

### 3) AI API Keys (Phase 3)
Phase 3 requires an AI provider key. This project uses OpenAI-compatible APIs
(e.g., Kimi/Moonshot) via the OpenAI SDK:

- `OPENAI_API_KEY`
- `OPENAI_BASE_URL` (e.g. `https://api.moonshot.cn/v1`)
- `OPENAI_MODEL` (e.g. `moonshot-v1-8k`)
- Optional: `OPENAI_MODELS` (comma-separated allowlist)

## Development

Run the development server:

```
npm run dev
```

Open http://localhost:3000 to view the landing page. After logging in, head to
`/workspace` to see the split-pane sandbox.

## ✅ Auth Workflow (Local)

1. Sign up with a **real email address**.
2. Open the confirmation email from Supabase and click the link.
3. After confirmation, log in and navigate to `/workspace`.

If you see an error like `otp_expired` or `access_denied`, the confirmation link
has expired or the redirect URL does not match your current site URL.

## 🚀 Deploying to Vercel (Email Redirects)

When deployed, the confirmation link must point to your live domain, not
`http://localhost:3000`.

- Set `NEXT_PUBLIC_SITE_URL` in Vercel to your deployment URL (e.g.
	`https://your-app.vercel.app`).
- In Supabase Dashboard → Auth → URL Configuration, add the same URL to
	**Site URL** and **Redirect URLs**.

After this, Supabase will generate confirmation links that redirect to your
deployed app.

## Auth Flow Notes

- `/signup` creates a user in Supabase.
- `/login` signs the user in.
- `/workspace` is protected by Proxy (`proxy.ts`) and redirects to `/login` if not authenticated.

## Next Phases

The upcoming phases will add multi-agent visualization, preset templates, and deeper editor/preview tooling.
