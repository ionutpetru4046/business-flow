-- Run this in the Supabase SQL Editor to create the vehicles table.

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  make text not null,
  model text not null,
  year integer,
  license_plate text,
  vin text,
  created_at timestamptz not null default now()
);

alter table public.vehicles enable row level security;

create policy "Allow all access to vehicles"
  on public.vehicles
  for all
  using (true)
  with check (true);
