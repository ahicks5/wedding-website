-- ============================================
-- Honeymoon fund contributions
-- Run this migration in your Supabase SQL editor (after 003_rsvp_guest_list.sql)
--
-- The experience *definitions* (title, blurb, goal) live in code at
-- src/lib/honeymoon.ts. This table only stores the individual contributions,
-- keyed by the stable experience_id string. The honeymoon page sums these per
-- experience_id to fill each progress bar.
--
-- Rows are written ONLY by the Stripe webhook (src/app/api/honeymoon/webhook),
-- after a checkout session is confirmed paid — never trusting the browser.
-- ============================================

create table honeymoon_contributions (
  id uuid primary key default gen_random_uuid(),
  experience_id text not null,
  amount_cents integer not null check (amount_cents > 0),
  contributor_name text,
  contributor_email text,
  message text,
  stripe_session_id text unique,        -- guards against double-recording webhook retries
  created_at timestamptz not null default now()
);

create index honeymoon_contributions_experience_idx
  on honeymoon_contributions (experience_id);

-- Row Level Security: lock down the anon/public role. All reads/writes go
-- through Next.js server code using the service-role key (which bypasses RLS).
alter table honeymoon_contributions enable row level security;
