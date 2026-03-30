-- ─────────────────────────────────────────────
-- AI Ad Generator — Supabase Migration
-- Run this in your Supabase SQL editor
-- ─────────────────────────────────────────────

-- Projects table (stores every generated ad project)
create table if not exists ai_ad_projects (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null default 'Untitled Ad',
  status        text not null default 'pending',   -- pending | generating | done | failed
  platform      text[] default '{}',              -- ['instagram','facebook','google']
  tone          text default 'professional',
  audience      jsonb default '{}',               -- { age, interest, location }
  product_url   text,
  image_url     text,                             -- uploaded product image (Supabase Storage URL)
  -- Generated outputs
  headlines     text[] default '{}',
  descriptions  text[] default '{}',
  cta           text,
  hashtags      text[] default '{}',
  ad_image_url  text,                             -- Replicate output
  video_url     text,                             -- Runway/Pika output
  -- Metadata
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Queue table for async video generation jobs
create table if not exists ai_ad_queue (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references ai_ad_projects(id) on delete cascade,
  user_id       uuid not null,
  job_type      text not null,                    -- 'image' | 'video'
  provider      text not null,                    -- 'replicate' | 'runway' | 'pika'
  provider_job_id text,                           -- external job ID for polling
  status        text not null default 'queued',   -- queued | processing | done | failed
  result_url    text,
  error         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Indexes
create index if not exists idx_ai_ad_projects_user on ai_ad_projects(user_id);
create index if not exists idx_ai_ad_queue_project  on ai_ad_queue(project_id);
create index if not exists idx_ai_ad_queue_status   on ai_ad_queue(status);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger ai_ad_projects_updated_at before update on ai_ad_projects
  for each row execute function update_updated_at();

create trigger ai_ad_queue_updated_at before update on ai_ad_queue
  for each row execute function update_updated_at();

-- RLS policies
alter table ai_ad_projects enable row level security;
alter table ai_ad_queue    enable row level security;

create policy "Users own their ad projects" on ai_ad_projects
  for all using (auth.uid() = user_id);

create policy "Users own their queue jobs" on ai_ad_queue
  for all using (auth.uid() = user_id);
