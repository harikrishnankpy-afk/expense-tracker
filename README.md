# Expense Tracker

A modern expense tracking dashboard starter built with React + TypeScript + Vite and Supabase-ready configuration.

## Features

- Add income and expense transactions
- Track spending by category
- Monthly overview cards
- Budget progress panels
- Local demo mode for quick testing
- Supabase-ready environment configuration

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Supabase JS client

## Get started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment sample:
   ```bash
   cp .env.example .env
   ```

3. Add your Supabase credentials to `.env`:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

The app works in local demo mode even before Supabase is configured.

## Suggested Supabase schema

Create the following tables in your Supabase project:

```sql
create table profiles (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  currency text default 'USD'
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  title text not null,
  amount numeric not null,
  type text not null check (type in ('expense', 'income')),
  category text not null,
  notes text,
  date date not null default current_date
);

create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  category text not null,
  limit numeric not null,
  spent numeric not null default 0
);
```

## Future ideas

- Receipt upload support
- Recurring transactions
- CSV import/export
- Multi-user household budgets
- Bank sync integration
