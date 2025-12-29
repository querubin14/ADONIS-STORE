
-- Update Orders Table to support full cart details
alter table if exists orders 
  add column if not exists items jsonb,
  add column if not exists customer_info jsonb,
  add column if not exists delivery_cost numeric default 0,
  add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- Ensure RLS allows public to insert orders (Checkout)
drop policy if exists "Enable insert for all users" on orders;
create policy "Enable insert for all users" on orders for insert with check (true);

drop policy if exists "Enable read for all users" on orders;
create policy "Enable read for all users" on orders for select using (true);

drop policy if exists "Enable update for all users" on orders;
create policy "Enable update for all users" on orders for update using (true);

-- Create Blog Posts Table
create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text,
  image text,
  rating integer,
  tag text,
  author text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Blog
alter table blog_posts enable row level security;

drop policy if exists "Public read access" on blog_posts;
create policy "Public read access" on blog_posts for select using (true);

drop policy if exists "Admin full access" on blog_posts;
create policy "Admin full access" on blog_posts for insert with check (true);
create policy "Admin update access" on blog_posts for update using (true);
create policy "Admin delete access" on blog_posts for delete using (true);
