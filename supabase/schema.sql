-- Run in Supabase SQL Editor; use a dedicated project.
create table if not exists public.submissions (
 id uuid primary key default gen_random_uuid(),
 reference text not null unique,
 kind text not null check (kind in ('hospital','career','contact')),
 data jsonb not null,
 file_path text,
 created_at timestamptz not null default now()
);
-- No public read/write policies. All submissions use the server-side service role.
alter table public.submissions enable row level security;
-- Create private storage bucket for PDF files (not public).
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('visit-now-uploads','visit-now-uploads',false,5242880,array['application/pdf'])
on conflict (id) do nothing;
-- Protect service credentials; never put service role key in client env vars.
