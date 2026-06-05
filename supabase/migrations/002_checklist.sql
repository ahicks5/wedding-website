-- ============================================
-- Wedding planning checklist state
-- Run this migration in your Supabase SQL editor (after 001_initial_schema.sql)
--
-- The checklist item *definitions* (text + grouping) live in code at
-- src/lib/checklist-data.ts. This table only stores the mutable state for each
-- item, keyed by its stable item_id. A row exists only once an item has been
-- touched (checked or given a note); missing rows mean "unchecked, no note".
-- ============================================

create table checklist_items (
  item_id text primary key,
  checked boolean not null default false,
  notes text,
  updated_at timestamptz not null default now()
);

-- Row Level Security: lock down the anon/public role. All reads/writes go
-- through the Next.js admin API route using the service-role key (which
-- bypasses RLS) and are gated behind the admin password.
alter table checklist_items enable row level security;
