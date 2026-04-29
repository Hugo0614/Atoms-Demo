# Implementation Plan & AI Agent Directives

**CRITICAL INSTRUCTION FOR AI AGENT:** 
You must implement this project strictly phase by phase. **DO NOT** proceed to the next phase until the user explicitly tells you to do so. After completing the tasks in a phase, you must output the exact phrase: `🛑 STOPPING HERE FOR HUMAN TESTING AND GITHUB PUSH.` and wait for the user's next prompt.

## Phase 1: Foundation & Authentication
- [x] Initialize Next.js app with Tailwind CSS and Shadcn UI.
- [x] Set up Supabase SSR client utilities (`createBrowserClient`, `createServerClient`).
- [x] Create simple Sign Up and Log In pages.
- [x] Create Next.js middleware to protect the main `/workspace` route.
- [x] Ensure user sessions are working and routing properly.
- [x] Document Supabase + Vercel environment variable setup in README.
> **🛑 STOPPING HERE FOR HUMAN TESTING AND GITHUB PUSH.**

## Phase 2: Core Workspace UI & Live Preview
- [x] Build the `/workspace` page with a split-pane layout.
- [x] Install `@codesandbox/sandpack-react`.
- [x] Implement the Server-Side Rendering (SSR) CSS injection for Sandpack in the root layout.
- [x] Place a static `<Sandpack />` component in the right pane rendering a basic "Hello World" React component to verify the compiler works.
- [x] Build a basic chat input UI in the left pane (just the UI, no AI connection yet).
> **🛑 STOPPING HERE FOR HUMAN TESTING AND GITHUB PUSH.**

## Phase 3: AI Orchestration & Code Generation
- [x] Install Vercel AI SDK (`ai`, `@ai-sdk/openai`).
- [x] Create an API route (`/api/chat`) using `streamText` with a strict system prompt instructing the AI to only output valid React code.
- [x] Connect the frontend chat UI to the API route using the `useChat` hook.
- [x] Parse the AI's streaming response to extract the code blocks and pipe them directly into the Sandpack `files` state so the user sees live generation.
- [x] Configure deployment envs (manual): Vercel project env vars + Supabase Auth URL config.
> **🛑 STOPPING HERE FOR HUMAN TESTING AND GITHUB PUSH.**

## Phase 4: Data Persistence
- [ ] Define a Supabase database schema for `projects` (id, user_id, code_content, created_at).
- [ ] Implement a "Save Project" function that writes the current Sandpack code state and chat history to Supabase.
- [ ] Create a "My Projects" sidebar or dashboard where users can fetch and load their previously saved Sandpack states.
- [ ] Redesign `/workspace` layout into three areas: session history list, active chat panel, and preview panel.
- [ ] Add preview mode toggle buttons: **Code Editor** (shows AI-generated code) and **Live Preview** (interactive app preview).
> **🛑 STOPPING HERE FOR HUMAN TESTING AND GITHUB PUSH.**

## Phase 5: Advanced Feature - Multi-Agent Visualization
- [ ] Install `reactflow`.
- [ ] Add a visual node graph above the chat input in the left pane. Define 3 nodes: "Planner", "Coder", "Reviewer".
- [ ] Update the AI API route to return custom tool calls or state updates (using Vercel AI SDK step tools) that indicate which "Agent" phase is running.
- [ ] Animate the React Flow edges or highlight the active node dynamically based on the current AI generation state to provide transparency.
> **🛑 STOPPING HERE FOR HUMAN TESTING AND GITHUB PUSH.**

## Phase 6: Advanced AI Features & State Management
- [ ] **KV Caching for State Persistence:** Implement a KV cache (e.g., Upstash Redis) using the Vercel AI SDK to cache LLM responses and persist the agent's conversational state and generated code across user sessions.
- [ ] **Editable System Prompts:** Build an "Agent Settings" UI panel where the user can view, edit, and save the AI's underlying system prompt. This allows users to dynamically change the agent's coding rules, persona, or preferred frameworks.
- [ ] **Pre-set User Prompts (Templates):** Create a quick-start UI section with 3-4 clickable preset prompt buttons (e.g., "Generate a SaaS Dashboard", "Create a Landing Page", "Build a Pricing Table"). Clicking these should instantly populate the chat and trigger the generation of different web app styles.
- [ ] **Self-Healing Code Implementation:** Add a custom tool to the Vercel AI SDK that automatically captures any compilation or console errors from the Sandpack preview. Feed these errors back to the agent so it can autonomously diagnose and rewrite the broken code.
- [ ] **Testing & Verification:** Once the code for this phase is complete, provide explicit terminal commands (e.g., `npm run dev`) and step-by-step instructions on how to test the KV cache persistence, modify the system prompt, and verify the self-healing error loop.
> **🛑 STOPPING HERE FOR HUMAN TESTING AND GITHUB PUSH.**
