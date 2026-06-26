create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text not null default 'Servicios',
  tax_id text,
  plan text not null default 'starter',
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  full_name text not null,
  email text not null,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  app_state jsonb not null default '{"records":[],"tasks":[]}'::jsonb,
  share_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, company_id)
);

alter table public.companies enable row level security;
alter table public.user_profiles enable row level security;
alter table public.app_workspaces enable row level security;

drop policy if exists "Users can read their company" on public.companies;
create policy "Users can read their company"
  on public.companies
  for select
  using (
    owner_id = auth.uid()
    or id in (select company_id from public.user_profiles where id = auth.uid())
  );

drop policy if exists "Owners can update their company" on public.companies;
create policy "Owners can update their company"
  on public.companies
  for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "Users can create owned company" on public.companies;
create policy "Users can create owned company"
  on public.companies
  for insert
  with check (owner_id = auth.uid());

drop policy if exists "Users can read own profile" on public.user_profiles;
create policy "Users can read own profile"
  on public.user_profiles
  for select
  using (id = auth.uid());

drop policy if exists "Users can create own profile" on public.user_profiles;
create policy "Users can create own profile"
  on public.user_profiles
  for insert
  with check (id = auth.uid());

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
  on public.user_profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "Users can manage own workspace" on public.app_workspaces;
create policy "Users can manage own workspace"
  on public.app_workspaces
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
