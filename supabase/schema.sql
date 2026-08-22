-- SeekhoSaath Supabase Production Schema (minimal/admin-safe)
-- Run this in Supabase SQL Editor

-- Enable extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
create table if not exists public.profiles (
  id text primary key,
  email text,
  full_name text,
  mobile text,
  role text default 'student' check (role in ('student','tutor','admin')),
  profile_pic text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- TUTOR APPLICATIONS
-- ============================================
create table if not exists public.tutor_applications (
  id uuid primary key default uuid_generate_v4(),
  user_id text,
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

-- ============================================
-- TUTORS
-- ============================================
create table if not exists public.tutors (
  id uuid primary key default uuid_generate_v4(),
  user_id text,
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

-- ============================================
-- BOOKINGS
-- ============================================
create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  tutor_id uuid not null references public.tutors on delete cascade,
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

-- ============================================
-- PAYMENTS
-- ============================================
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references public.bookings on delete cascade,
  user_id text not null,
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

-- ============================================
-- MEETINGS
-- ============================================
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

-- ============================================
-- SESSIONS
-- ============================================
create table if not exists public.sessions (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references public.bookings on delete cascade,
  tutor_id uuid references public.tutors on delete cascade,
  student_id text not null,
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

-- ============================================
-- STUDENT PROGRESS
-- ============================================
create table if not exists public.student_progress (
  id uuid primary key default uuid_generate_v4(),
  student_id text not null,
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

-- ============================================
-- NOTIFICATIONS
-- ============================================
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  type text not null check (type in ('booking','payment','session','message','system')),
  title text not null,
  message text not null,
  data jsonb,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_tutor_applications_status on public.tutor_applications(status);
create index if not exists idx_tutor_applications_email on public.tutor_applications(email);
create index if not exists idx_tutor_applications_user_id on public.tutor_applications(user_id);
create index if not exists idx_tutors_status on public.tutors(status);
create index if not exists idx_tutors_user_id on public.tutors(user_id);
create index if not exists idx_bookings_user_id on public.bookings(user_id);
create index if not exists idx_bookings_tutor_id on public.bookings(tutor_id);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_payments_booking_id on public.payments(booking_id);
create index if not exists idx_sessions_tutor_id on public.sessions(tutor_id);
create index if not exists idx_sessions_student_id on public.sessions(student_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_read on public.notifications(read);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tutor-images', 'tutor-images', true, 5242880, '{"image/png","image/jpeg","image/jpg","image/webp"}')
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tutor-documents', 'tutor-documents', false, 10485760, '{"image/png","image/jpeg","image/jpg","image/webp","application/pdf"}')
on conflict (id) do nothing;

-- ============================================
-- RLS POLICIES
-- ============================================
alter table public.profiles enable row level security;
alter table public.tutor_applications enable row level security;
alter table public.tutors enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.meetings enable row level security;
alter table public.sessions enable row level security;
alter table public.student_progress enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Authenticated users can insert profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

drop policy if exists "Tutor applications are viewable by everyone" on public.tutor_applications;
drop policy if exists "Authenticated users can insert applications" on public.tutor_applications;
drop policy if exists "Admins can update applications" on public.tutor_applications;

drop policy if exists "Approved tutors are viewable by everyone" on public.tutors;
drop policy if exists "Admins can insert tutors" on public.tutors;
drop policy if exists "Admins can update tutors" on public.tutors;

drop policy if exists "Users can view their own bookings" on public.bookings;
drop policy if exists "Authenticated users can insert bookings" on public.bookings;
drop policy if exists "Users can update own bookings" on public.bookings;

drop policy if exists "Users can view own payments" on public.payments;
drop policy if exists "Users can insert own payments" on public.payments;

drop policy if exists "Meetings are insertable by everyone" on public.meetings;
drop policy if exists "Meetings are viewable by everyone" on public.meetings;

drop policy if exists "Participants can view sessions" on public.sessions;
drop policy if exists "Authenticated users can insert sessions" on public.sessions;
drop policy if exists "Tutors can update their sessions" on public.sessions;

drop policy if exists "Students can view their own progress" on public.student_progress;
drop policy if exists "Tutors can view their students progress" on public.student_progress;
drop policy if exists "Authenticated users can insert progress" on public.student_progress;
drop policy if exists "Authenticated users can update progress" on public.student_progress;

drop policy if exists "Users can view their own notifications" on public.notifications;
drop policy if exists "Users can update their own notifications" on public.notifications;
drop policy if exists "Authenticated users can insert notifications" on public.notifications;

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Authenticated users can upload tutor images" on storage.objects;
drop policy if exists "Users can update their own images" on storage.objects;
drop policy if exists "Users can delete their own images" on storage.objects;
drop policy if exists "Admins can view tutor documents" on storage.objects;
drop policy if exists "Authenticated users can upload tutor documents" on storage.objects;
drop policy if exists "Users can update their own documents" on storage.objects;
drop policy if exists "Users can delete their own documents" on storage.objects;

create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Authenticated users can insert profiles" on public.profiles for insert with check (auth.uid() is not null);
create policy "Users can update own profile" on public.profiles for update using (auth.uid()::text = id);

create policy "Tutor applications are viewable by everyone" on public.tutor_applications for select using (true);
create policy "Authenticated users can insert applications" on public.tutor_applications for insert with check (auth.uid() is not null);
create policy "Admins can update applications" on public.tutor_applications for update using (
  exists (select 1 from public.profiles where profiles.id = auth.uid()::text and profiles.role = 'admin')
);

create policy "Approved tutors are viewable by everyone" on public.tutors for select using (status = 'approved');
create policy "Admins can insert tutors" on public.tutors for insert with check (
  exists (select 1 from public.profiles where profiles.id = auth.uid()::text and profiles.role = 'admin')
);
create policy "Admins can update tutors" on public.tutors for update using (
  exists (select 1 from public.profiles where profiles.id = auth.uid()::text and profiles.role = 'admin')
);

create policy "Users can view their own bookings" on public.bookings for select using (user_id = auth.uid()::text);
create policy "Authenticated users can insert bookings" on public.bookings for insert with check (auth.uid() is not null);
create policy "Users can update own bookings" on public.bookings for update using (user_id = auth.uid()::text);

create policy "Users can view own payments" on public.payments for select using (user_id = auth.uid()::text);
create policy "Users can insert own payments" on public.payments for insert with check (auth.uid() is not null);

create policy "Meetings are insertable by everyone" on public.meetings for insert with check (true);
create policy "Meetings are viewable by everyone" on public.meetings for select using (true);

create policy "Participants can view sessions" on public.sessions for select using (
  student_id = auth.uid()::text or
  exists (select 1 from public.tutors where tutors.id = sessions.tutor_id and tutors.user_id = auth.uid()::text)
);
create policy "Authenticated users can insert sessions" on public.sessions for insert with check (auth.uid() is not null);
create policy "Tutors can update their sessions" on public.sessions for update using (
  exists (select 1 from public.tutors where tutors.id = sessions.tutor_id and tutors.user_id = auth.uid()::text)
);

create policy "Students can view their own progress" on public.student_progress for select using (student_id = auth.uid()::text);
create policy "Tutors can view their students progress" on public.student_progress for select using (
  exists (select 1 from public.tutors where tutors.id = student_progress.tutor_id and tutors.user_id = auth.uid()::text)
);
create policy "Authenticated users can insert progress" on public.student_progress for insert with check (auth.uid() is not null);
create policy "Authenticated users can update progress" on public.student_progress for update using (auth.uid() is not null);

create policy "Users can view their own notifications" on public.notifications for select using (user_id = auth.uid()::text);
create policy "Users can update their own notifications" on public.notifications for update using (user_id = auth.uid()::text);
create policy "Authenticated users can insert notifications" on public.notifications for insert with check (auth.uid() is not null);

create policy "Avatar images are publicly accessible" on storage.objects for select using (bucket_id = 'tutor-images');
create policy "Authenticated users can upload tutor images" on storage.objects for insert with check (bucket_id = 'tutor-images' and auth.uid() is not null);
create policy "Users can update their own images" on storage.objects for update using (bucket_id = 'tutor-images' and auth.uid() is not null);
create policy "Users can delete their own images" on storage.objects for delete using (bucket_id = 'tutor-images' and auth.uid() is not null);

create policy "Admins can view tutor documents" on storage.objects for select using (bucket_id = 'tutor-documents');
create policy "Authenticated users can upload tutor documents" on storage.objects for insert with check (bucket_id = 'tutor-documents' and auth.uid() is not null);
create policy "Users can update their own documents" on storage.objects for update using (bucket_id = 'tutor-documents' and auth.uid() is not null);
create policy "Users can delete their own documents" on storage.objects for delete using (bucket_id = 'tutor-documents' and auth.uid() is not null);
