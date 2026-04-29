-- Supabase schema for Phase 4: projects persistence

create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code_content text not null,
  chat_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists projects_user_id_idx on public.projects(user_id);

alter table public.projects enable row level security;

create policy "projects_select_own" on public.projects
  for select
  using (auth.uid() = user_id);

create policy "projects_insert_own" on public.projects
  for insert
  with check (auth.uid() = user_id);

create policy "projects_update_own" on public.projects
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "projects_delete_own" on public.projects
  for delete
  using (auth.uid() = user_id);
