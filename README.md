# Atoms AI Workspace Demo

This is a Next.js (App Router) demo inspired by Atoms.dev. Phase 1 delivers the authentication foundation with Supabase and shadcn UI.

## ✅ Features in Phase 1

- Supabase email/password sign up + log in.
- Protected `/workspace` route via Next.js Proxy (`proxy.ts`).
- Minimal shadcn-based UI for auth flows.

## ✅ Features in Phase 2

- Split-pane workspace layout with chat + live preview.
- Sandpack preview wired with a basic React “Hello World” starter.
- SSR CSS injection for Sandpack to avoid layout flashes.
- Static chat prompt UI ready for Phase 3 AI wiring.

## Environment Variables

Create a `.env.local` file using the template below:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
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
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
- `NEXT_PUBLIC_SITE_URL` (your live domain)

### 3) AI API Keys (Phase 3)
Phase 3 will require an AI provider key. Add one when you reach that phase:
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`

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

The upcoming phases will add the live coding workspace, AI orchestration, persistence, and multi-agent visualization.
