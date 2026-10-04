-- Careerfolio production data model.
-- Run in Supabase SQL Editor after creating the project.

create extension if not exists pgcrypto;

create type public.plan_tier as enum ('free', 'pro');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  plan public.plan_tier not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.portfolios (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null default '',
  role text not null default '',
  about text not null default '',
  location text not null default '',
  contact_email text not null default '',
  template_id text not null default 'canvas',
  custom_domain text unique,
  published boolean not null default false,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('razorpay', 'stripe', 'manual')),
  provider_payment_id text unique,
  plan public.plan_tier not null default 'free',
  status text not null check (status in ('pending', 'active', 'cancelled', 'refunded')),
  amount_paise integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.portfolio_events (
  id bigint generated always as identity primary key,
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  event_type text not null check (event_type in ('view', 'share', 'contact_click')),
  occurred_at timestamptz not null default now()
);

create index portfolios_owner_id_idx on public.portfolios(owner_id);
create index portfolios_published_idx on public.portfolios(published) where published = true;
create index portfolio_events_portfolio_id_idx on public.portfolio_events(portfolio_id, occurred_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.portfolios enable row level security;
alter table public.subscriptions enable row level security;
alter table public.portfolio_events enable row level security;

create policy "Profiles are visible to their owner" on public.profiles
  for select using (auth.uid() = id);
create policy "Profiles are editable by their owner" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Owners can manage their portfolios" on public.portfolios
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Published portfolios are publicly readable" on public.portfolios
  for select using (published = true);

create policy "Owners can read their subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Insert subscription rows and change profile.plan only from a secure payment webhook.
-- Never accept a plan change directly from browser code.
create policy "Public clients cannot write subscriptions" on public.subscriptions
  for insert with check (false);
create policy "Public clients cannot update subscriptions" on public.subscriptions
  for update using (false);

-- Analytics should be written by an edge/server function, not directly by visitors.
create policy "Public clients cannot write analytics" on public.portfolio_events
  for insert with check (false);
create policy "Owners can read analytics for their portfolios" on public.portfolio_events
  for select using (
    exists (select 1 from public.portfolios where portfolios.id = portfolio_events.portfolio_id and portfolios.owner_id = auth.uid())
  );
