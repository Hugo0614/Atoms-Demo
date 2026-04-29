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
- [ ] Install Vercel AI SDK (`ai`, `@ai-sdk/openai`).
- [ ] Create an API route (`/api/chat`) using `streamText` with a strict system prompt instructing the AI to only output valid React code.
- [ ] Connect the frontend chat UI to the API route using the `useChat` hook.
- [ ] Parse the AI's streaming response to extract the code blocks and pipe them directly into the Sandpack `files` state so the user sees live generation.
- [ ] Configure deployment envs (manual): Vercel project env vars + Supabase Auth URL config.
> **🛑 STOPPING HERE FOR HUMAN TESTING AND GITHUB PUSH.**

## Phase 4: Data Persistence
- [ ] Define a Supabase database schema for `projects` (id, user_id, code_content, created_at).
- [ ] Implement a "Save Project" function that writes the current Sandpack code state and chat history to Supabase.
- [ ] Create a "My Projects" sidebar or dashboard where users can fetch and load their previously saved Sandpack states.
> **🛑 STOPPING HERE FOR HUMAN TESTING AND GITHUB PUSH.**

## Phase 5: Advanced Feature - Multi-Agent Visualization
- [ ] Install `reactflow`.
- [ ] Add a visual node graph above the chat input in the left pane. Define 3 nodes: "Planner", "Coder", "Reviewer".
- [ ] Update the AI API route to return custom tool calls or state updates (using Vercel AI SDK step tools) that indicate which "Agent" phase is running.
- [ ] Animate the React Flow edges or highlight the active node dynamically based on the current AI generation state to provide transparency.
> **🛑 STOPPING HERE FOR HUMAN TESTING AND GITHUB PUSH.**