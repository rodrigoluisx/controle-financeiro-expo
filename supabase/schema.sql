create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  description text not null,
  amount numeric(12,2) not null check (amount > 0),
  type text not null check (type in ('income', 'expense')),
  transaction_date date not null,
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

drop policy if exists "read own transactions" on public.transactions;
drop policy if exists "insert own transactions" on public.transactions;
drop policy if exists "update own transactions" on public.transactions;
drop policy if exists "delete own transactions" on public.transactions;

create policy "read own transactions" on public.transactions
for select using (auth.uid() = user_id);

create policy "insert own transactions" on public.transactions
for insert with check (auth.uid() = user_id);

create policy "update own transactions" on public.transactions
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "delete own transactions" on public.transactions
for delete using (auth.uid() = user_id);

create index if not exists transactions_user_date_idx
on public.transactions (user_id, transaction_date desc);
