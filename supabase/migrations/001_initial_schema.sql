-- ============================================
-- Wedding Site Database Schema
-- Run this migration in your Supabase SQL editor
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Parties table
create table parties (
  id uuid primary key default uuid_generate_v4(),
  party_name text not null,
  max_guests integer not null default 1,
  address text,
  invite_sent boolean not null default false,
  invite_sent_date date,
  created_at timestamptz not null default now()
);

-- RSVP status enum
create type rsvp_status as enum ('pending', 'accepted', 'declined');

-- Guests table
create table guests (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  email text,
  party_id uuid not null references parties(id) on delete cascade,
  rsvp_status rsvp_status not null default 'pending',
  meal_choice text,
  dietary_restrictions text,
  notes text,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

-- Contact messages table
create table contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index idx_guests_party_id on guests(party_id);
create index idx_guests_last_name on guests(lower(last_name));
create index idx_guests_rsvp_status on guests(rsvp_status);

-- Row Level Security: lock down the anon/public role.
-- All app reads/writes go through Next.js API routes using the service-role
-- key, which bypasses RLS. Enabling RLS with no public policies means the
-- anon key (if it ever leaked or got swapped in) cannot read guest data.
alter table parties enable row level security;
alter table guests enable row level security;
alter table contact_messages enable row level security;
