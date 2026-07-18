-- ============================================
-- Seating chart — floor plan + guest assignments
-- Run this migration in your Supabase SQL editor (after 001–004).
--
-- Two tables, mirroring the RSVP two-layer philosophy:
--   * seating_tables      — the round guest tables you place on the floor plan
--                           (position, name, capacity). Fully admin-managed.
--   * seating_assignments — which guest sits at which table. Keyed on the stable
--                           guest_id (G###) so seatings SURVIVE guest re-imports,
--                           exactly like the rsvps table. Cascades if a guest is
--                           ever hard-deleted.
--
-- The fixed fixtures (head table, DJ booth, bars, dance floor) are NOT stored
-- here — they are part of the room and rendered from code. Only the round guest
-- tables and their occupants are data.
-- ============================================

create extension if not exists "uuid-ossp";

-- --------------------------------------------
-- Round guest tables placed on the floor plan.
-- pos_x / pos_y are fractions (0..1) of the floor-plan canvas, so the layout
-- scales with the canvas at any screen size instead of storing raw pixels.
-- --------------------------------------------
create table seating_tables (
  id uuid primary key default uuid_generate_v4(),
  name text not null,                       -- e.g. "Table 1", "Sager Family"
  pos_x real not null default 0.5,          -- 0..1 fraction across the floor plan
  pos_y real not null default 0.5,          -- 0..1 fraction down the floor plan
  capacity integer not null default 8,      -- circle tables seat 8
  sort_order integer not null default 0,    -- tie-breaker for stable ordering
  created_at timestamptz not null default now()
);

-- --------------------------------------------
-- Guest → table assignments. One row per seated guest; absence means unseated.
-- guest_id is the primary key, so a guest can sit at exactly one table and the
-- row survives spreadsheet re-imports (same design as rsvps).
-- --------------------------------------------
create table seating_assignments (
  guest_id text primary key references guests(guest_id) on delete cascade,
  table_id uuid not null references seating_tables(id) on delete cascade,
  seat_index integer,                       -- optional fixed seat within a table
  updated_at timestamptz not null default now()
);

create index idx_seating_assignments_table on seating_assignments (table_id);

-- Row Level Security: lock down the anon/public role on both tables. All reads
-- and writes go through the Next.js admin API route using the service-role key
-- (which bypasses RLS) and are gated behind the admin password.
alter table seating_tables enable row level security;
alter table seating_assignments enable row level security;
