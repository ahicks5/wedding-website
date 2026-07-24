-- ============================================
-- Site settings (small key/value store)
-- Run this migration in your Supabase SQL editor (after 005_seating.sql)
--
-- A general-purpose settings table for mutable, admin-controlled site state
-- that must persist across devices and deploys. First use: the `rsvp_open`
-- flag that the admin dashboard flips to open/close the public RSVP form.
--
-- Values are stored as jsonb so a single table can hold booleans, strings, or
-- richer config as more settings are added. Reads/writes go through the
-- Next.js server (service-role key) — see src/lib/settings.ts.
-- ============================================

create table site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Seed the RSVP-open flag as true (open). Missing row is also treated as open
-- by the app, so this is just an explicit, editable starting point.
insert into site_settings (key, value)
values ('rsvp_open', 'true'::jsonb)
on conflict (key) do nothing;

-- Row Level Security: lock down the anon/public role. All reads/writes go
-- through server-side code using the service-role key (which bypasses RLS).
alter table site_settings enable row level security;
