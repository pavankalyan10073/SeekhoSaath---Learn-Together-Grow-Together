-- Supabase schema for SeekhoSaath
-- Run this in the Supabase SQL Editor after creating your project

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  mobile text,
  role text default 'student',
  profile_pic text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tutor applications table
create table if not exists public.tutor_applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  full_name text not null,
  email text not null,
  mobile text not null,
  profile_pic text,
  bio text,
  experience text,
  degree text,
  college text,
  year_of_passing text,
  specializations text[] default '{}',
  subjects_to_teach text[] default '{}',
  charge_per_session text,
  teaching_mode text check (teaching_mode in ('online','offline','hybrid')),
  state text,
  district text,
  city text,
  pin_code text,
  full_address text,
  languages text[] default '{}',
  aadhar_front text,
  aadhar_back text,
  aadhar_number text,
  application_date text,
  verified boolean default false,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  rejection_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tutors table
create table if not exists public.tutors (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  name text not null,
  email text not null,
  mobile text not null,
  profile_pic text,
  bio text,
  experience text,
  degree text,
  college text,
  year_of_passing text,
  specializations text[] default '{}',
  subjects_to_teach text[] default '{}',
  charge_per_session text,
  teaching_mode text check (teaching_mode in ('online','offline','hybrid')),
  location text,
  languages text[] default '{}',
  state text,
  district text,
  city text,
  pin_code text,
  full_address text,
  aadhar_front text,
  aadhar_back text,
  application_date text,
  verified boolean default false,
  rating numeric default 0,
  sessions integer default 0,
  response_time text,
  status text default 'approved' check (status in ('pending','approved','rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bookings table
create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  tutor_id uuid references public.tutors on delete cascade,
  tutor_name text not null,
  tutor_subject text not null,
  student_name text not null,
  student_phone text not null,
  student_email text not null,
  mode text check (mode in ('online','offline','hybrid')),
  date text,
  time text,
  tuition_type text,
  status text default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  payment_status text default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  amount integer,
  payment_id text,
  razorpay_order_id text,
  order_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payments table
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references public.bookings on delete cascade,
  user_id uuid references auth.users on delete cascade,
  tutor_id uuid references public.tutors on delete cascade,
  amount integer not null,
  currency text default 'INR',
  status text default 'created' check (status in ('created','paid','failed','refunded')),
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  method text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Meetings table (replaces Google Sheets for meeting requests)
create table if not exists public.meetings (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text not null,
  email text not null,
  tuition_type text not null,
  date text not null,
  time text not null,
  tutor_name text,
  tutor_subject text,
  type text default 'meeting',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sessions table for tracking actual tutoring sessions
create table if not exists public.sessions (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references public.bookings on delete cascade,
  tutor_id uuid references public.tutors on delete cascade,
  student_id uuid references auth.users on delete cascade,
  subject text not null,
  mode text check (mode in ('online','offline','hybrid')),
  scheduled_at timestamp with time zone not null,
  duration_minutes integer default 60,
  status text default 'scheduled' check (status in ('scheduled','in_progress','completed','cancelled','no_show')),
  notes text,
  rating numeric check (rating >= 0 AND rating <= 5),
  feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Student progress table
create table if not exists public.student_progress (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references auth.users on delete cascade,
  tutor_id uuid references public.tutors on delete cascade,
  subject text not null,
  sessions_completed integer default 0,
  total_hours numeric default 0,
  average_rating numeric default 0,
  last_session_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, tutor_id, subject)
);

-- Notifications table for realtime notifications
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  type text not null check (type in ('booking','payment','session','message','system')),
  title text not null,
  message text not null,
  data jsonb,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Analytics materialized view for tutor stats
create or replace view public.tutor_analytics as
select 
  t.id as tutor_id,
  t.user_id,
  count(distinct b.id) as total_bookings,
  count(distinct case when b.status = 'completed' then b.id end) as completed_sessions,
  count(distinct case when b.status = 'pending' then b.id end) as pending_sessions,
  sum(case when b.payment_status = 'paid' then b.amount else 0 end) as total_earnings,
  avg(case when s.rating is not null then s.rating end) as average_rating,
  count(distinct case when s.rating is not null then s.id end) as total_ratings,
  sum(case when s.status = 'completed' then s.duration_minutes else 0 end) / 60 as total_hours
from public.tutors t
left join public.bookings b on b.tutor_id = t.id
left join public.sessions s on s.tutor_id = t.id and s.status = 'completed'
where t.status = 'approved'
group by t.id, t.user_id;

-- Analytics view for student stats
create or replace view public.student_analytics as
select 
  b.user_id as student_id,
  count(distinct b.id) as total_bookings,
  count(distinct case when b.status = 'completed' then b.id end) as completed_sessions,
  count(distinct case when b.status = 'pending' then b.id end) as upcoming_sessions,
  sum(case when b.payment_status = 'paid' then b.amount else 0 end) as total_spent,
  count(distinct b.tutor_id) as tutors_engaged,
  sum(case when s.status = 'completed' then s.duration_minutes else 0 end) / 60 as total_hours,
  avg(case when s.rating is not null then s.rating end) as average_rating_given
from public.bookings b
left join public.sessions s on s.booking_id = b.id and s.student_id = b.user_id
group by b.user_id;

-- Storage buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tutor-images', 'tutor-images', true, 5242880, '{"image/png","image/jpeg","image/jpg","image/webp"}')
on conflict (id) do nothing;

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.tutor_applications enable row level security;
alter table public.tutors enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.meetings enable row level security;
alter table public.sessions enable row level security;
alter table public.student_progress enable row level security;
alter table public.notifications enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Tutor applications policies
create policy "Tutor applications are viewable by everyone" on public.tutor_applications for select using (true);
create policy "Users can insert their own application" on public.tutor_applications for insert with check (auth.uid() = user_id);
create policy "Admins can update applications" on public.tutor_applications for update using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- Tutors policies
create policy "Tutors are viewable by everyone" on public.tutors for select using (true);
create policy "Admins can insert tutors" on public.tutors for insert with check (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins can update tutors" on public.tutors for update using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- Bookings policies
create policy "Users can view own bookings" on public.bookings for select using (auth.uid() = user_id);
create policy "Users can insert own bookings" on public.bookings for insert with check (auth.uid() = user_id);
create policy "Users can update own bookings" on public.bookings for update using (auth.uid() = user_id);

-- Payments policies
create policy "Users can view own payments" on public.payments for select using (auth.uid() = user_id);
create policy "Users can insert own payments" on public.payments for insert with check (auth.uid() = user_id);

-- Meetings policies
create policy "Meetings are insertable by everyone" on public.meetings for insert with check (true);
create policy "Meetings are viewable by everyone" on public.meetings for select using (true);

-- Sessions policies
create policy "Tutors can view their sessions" on public.sessions for select using (
  auth.uid() = tutor_id or auth.uid() = student_id
);
create policy "System can insert sessions" on public.sessions for insert with check (true);
create policy "Tutors can update their sessions" on public.sessions for update using (auth.uid() = tutor_id);

-- Student progress policies
create policy "Students can view their own progress" on public.student_progress for select using (auth.uid() = student_id);
create policy "Tutors can view their students progress" on public.student_progress for select using (auth.uid() = tutor_id);
create policy "System can insert progress" on public.student_progress for insert with check (true);
create policy "System can update progress" on public.student_progress for update using (true);

-- Notifications policies
create policy "Users can view their own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update their own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "System can insert notifications" on public.notifications for insert with check (true);

-- Storage policies
create policy "Avatar images are publicly accessible" on storage.objects for select using (bucket_id = 'tutor-images');
create policy "Anyone can upload avatar images" on storage.objects for insert with check (bucket_id = 'tutor-images');
create policy "Anyone can update avatar images" on storage.objects for update with check (bucket_id = 'tutor-images');
create policy "Anyone can delete avatar images" on storage.objects for delete using (bucket_id = 'tutor-images');

-- Realtime publication for account dashboard
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.payments;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.student_progress;
