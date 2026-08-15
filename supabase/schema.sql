-- Super Tech — database schema
--
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Safe to re-run; every statement is idempotent.
--
-- Security model: the public site reads with the anon key, so every table
-- grants SELECT to anon. No write policies exist at all — the admin panel
-- writes from the server using the service_role key, which bypasses RLS. That
-- means a leaked anon key can read the catalogue (which is public anyway) but
-- can never modify it.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  slug            text primary key,
  name            text not null,
  short_name      text not null default '',
  description     text not null default '',
  icon            text not null default 'package',
  image           text not null default '',
  subcategories   text[] not null default '{}',
  -- Arabic overrides; null falls back to the English column.
  name_ar         text,
  short_name_ar   text,
  description_ar  text,
  sort_order      integer not null default 0,
  updated_at      timestamptz not null default now()
);

create index if not exists categories_sort_idx on public.categories (sort_order);

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id             text primary key,
  name           text not null,
  category       text not null references public.categories (slug) on update cascade,
  subcategory    text not null default '',
  brand          text,
  images         text[] not null default '{}',
  description    text not null default '',
  specs          jsonb not null default '{}'::jsonb,
  featured       boolean not null default false,
  name_ar        text,
  description_ar text,
  specs_ar       jsonb,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_featured_idx on public.products (featured) where featured;
create index if not exists products_sort_idx on public.products (sort_order);

-- Full-text search across the English and Arabic copy, so the search page can
-- move off the current in-memory filter when the catalogue outgrows it.
create index if not exists products_search_idx on public.products
  using gin (to_tsvector('simple',
    coalesce(name, '') || ' ' ||
    coalesce(brand, '') || ' ' ||
    coalesce(subcategory, '') || ' ' ||
    coalesce(description, '') || ' ' ||
    coalesce(name_ar, '') || ' ' ||
    coalesce(description_ar, '')));

-- ---------------------------------------------------------------------------
-- Site settings — a single row holding contact details and the site images
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id         boolean primary key default true,
  contact    jsonb not null default '{}'::jsonb,
  images     jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id)
);

-- ---------------------------------------------------------------------------
-- Page-text overrides — one row per locale, holding only the edited strings
-- ---------------------------------------------------------------------------
create table if not exists public.content_overrides (
  locale     text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- FAQs
-- ---------------------------------------------------------------------------
create table if not exists public.faqs (
  id         uuid primary key default gen_random_uuid(),
  locale     text not null default 'en',
  question   text not null,
  answer     text not null,
  sort_order integer not null default 0
);

create index if not exists faqs_locale_sort_idx on public.faqs (locale, sort_order);

-- ---------------------------------------------------------------------------
-- Shared Arabic translations that aren't tied to one product
-- (`scope` is 'subcategory' or 'spec_key')
-- ---------------------------------------------------------------------------
create table if not exists public.translations (
  scope    text not null,
  key      text not null,
  value_ar text not null,
  primary key (scope, key)
);

-- ---------------------------------------------------------------------------
-- Blog posts
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  slug            text primary key,
  title           text not null,
  description     text not null default '',
  category        text not null default '',
  published_at    date not null default current_date,
  read_time       text not null default '',
  image           text not null default '',
  body            jsonb not null default '[]'::jsonb,
  -- Arabic overrides; null falls back to the English column.
  title_ar        text,
  description_ar  text,
  category_ar     text,
  read_time_ar    text,
  body_ar         jsonb,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists blog_posts_published_idx on public.blog_posts (published_at desc);

-- ---------------------------------------------------------------------------
-- Row level security: public read, no public writes
-- ---------------------------------------------------------------------------
alter table public.categories        enable row level security;
alter table public.products          enable row level security;
alter table public.site_settings     enable row level security;
alter table public.content_overrides enable row level security;
alter table public.faqs              enable row level security;
alter table public.translations      enable row level security;
alter table public.blog_posts        enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'categories', 'products', 'site_settings', 'content_overrides', 'faqs', 'translations', 'blog_posts'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', t || '_public_read', t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      t || '_public_read', t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Keep updated_at honest
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare
  t text;
begin
  foreach t in array array['categories', 'products', 'site_settings', 'content_overrides', 'blog_posts']
  loop
    execute format('drop trigger if exists %I on public.%I', t || '_touch', t);
    execute format(
      'create trigger %I before update on public.%I
         for each row execute function public.touch_updated_at()',
      t || '_touch', t
    );
  end loop;
end $$;
