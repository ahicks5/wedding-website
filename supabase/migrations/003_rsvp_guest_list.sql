-- ============================================
-- RSVP Guest List — two-layer schema
-- Run this migration in your Supabase SQL editor (after 001 and 002).
--
-- Two layers, on purpose:
--   * IMPORTED tables (households, guests) are rebuilt from the spreadsheet
--     (Wedding_Guests_RSVP_Clean.xlsx) on every run of scripts/import-guests.mjs.
--   * The RESPONSE table (rsvps) is written ONLY by the website and is NEVER
--     touched by the importer, so guests' submitted RSVPs survive re-imports.
--
-- The link between them is the stable guest_id (G###). Imported guests are
-- soft-removed (removed = true), never hard-deleted, so an rsvps row can never
-- be orphaned by a foreign key.
--
-- This replaces the demo parties/guests schema from 001 (no real data existed).
-- contact_messages (001) and checklist_items (002) are left untouched.
-- ============================================

create extension if not exists "uuid-ossp";

-- Drop the demo guest model. Safe: only seed/demo data ever lived here.
drop table if exists guests cascade;
drop table if exists parties cascade;
drop type if exists rsvp_status;

-- --------------------------------------------
-- Households (imported, upserted on household_id)
-- --------------------------------------------
create table households (
  household_id integer primary key,
  search_name text not null,           -- the one searchable name (primary contact)
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  zip text,                            -- text, to preserve leading zeros
  created_at timestamptz not null default now()
);

create index idx_households_search on households (lower(search_name));

-- --------------------------------------------
-- Guests (imported fields only, upserted on guest_id)
-- --------------------------------------------
create table guests (
  guest_id text primary key,           -- STABLE key, format G### (never renumber)
  household_id integer not null references households(household_id) on delete cascade,
  first_name text,
  last_name text,
  display_name text not null,
  name_status text not null default 'confirmed',  -- confirmed | PLACEHOLDER_UNKNOWN
  is_primary_contact boolean not null default false,
  relationship_to_couple text,
  side text,                           -- Sager | Hicks | Mutual | (blank)
  invite_group text,
  guest_type text not null default 'adult',  -- adult | child | toddler | infant
  tier text,
  plus_one_allowed text,               -- Y | review | (blank) — admin metadata only
  invited_rehearsal_dinner boolean not null default false,
  needs_review boolean not null default false,
  review_reason text,
  removed boolean not null default false,  -- soft delete (absent from latest sheet)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_guests_household on guests (household_id);
create index idx_guests_removed on guests (removed);

-- --------------------------------------------
-- RSVPs (response table — ONLY the website writes here)
-- Keyed on guest_id so responses survive every re-import.
-- --------------------------------------------
create table rsvps (
  guest_id text primary key references guests(guest_id) on delete cascade,
  attending_wedding boolean,
  attending_rehearsal boolean,
  meal_preference text,
  dietary_notes text,
  rsvp_email text,                     -- collected at RSVP time (primary contact)
  rsvp_phone text,
  notes text,                          -- free-text note for the couple (primary contact)
  plus_one_name text,                  -- name a guest fills in for a placeholder seat
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------
-- Import audit log (one row per non-dry-run import)
-- --------------------------------------------
create table import_log (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  filename text,
  inserted integer not null default 0,
  updated integer not null default 0,
  soft_removed integer not null default 0,
  households integer not null default 0,
  placeholders integer not null default 0,
  warnings jsonb not null default '[]'::jsonb,
  dry_run boolean not null default false
);

-- Row Level Security: lock down the anon/public role on every table. All app
-- reads/writes go through Next.js API routes using the service-role key (which
-- bypasses RLS). With RLS on and no public policies, a leaked/misconfigured
-- anon key cannot read guest or RSVP data.
alter table households enable row level security;
alter table guests enable row level security;
alter table rsvps enable row level security;
alter table import_log enable row level security;
