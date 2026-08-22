# Supabase Backend Setup Guide for SeekhoSaath

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - Name: `seekho-saath`
   - Database Password: (save this securely)
   - Region: Choose closest to your users (e.g., `ap-southeast-1` for India)
4. Click "Create new project"
5. Wait for project to be ready (~2 minutes)

## Step 2: Get API Credentials

1. In Supabase Dashboard, go to **Settings > API**
2. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in:
   - `VITE_SUPABASE_URL` - from Step 2
   - `VITE_SUPABASE_ANON_KEY` - from Step 2
   - `SUPABASE_SERVICE_ROLE_KEY` - from Step 2 (server-only, never expose to client)

## Step 4: Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

## Step 5: Configure Storage

The schema automatically creates two storage buckets:
- `tutor-images` - for profile pictures (public)
- `tutor-documents` - for Aadhar, degree certificates (private)

No additional setup needed - the schema handles this.

## Step 6: Create Admin User

1. First, sign up through the app as a tutor or student
2. Note your Firebase UID (check browser console after login)
3. In Supabase Dashboard, go to **Table Editor > profiles**
4. Find your user by email
5. Edit the row and change `role` from `student` to `admin`
6. Save

## Step 7: Test the Flow

### Tutor Registration:
1. Go to `/signup`
2. Select "I want to teach"
3. Fill all 3 steps
4. Submit application
5. Check Supabase **Table Editor > tutor_applications** - you should see your application with `status: pending`

### Admin Approval:
1. Login as admin user
2. Go to `/admin`
3. You should see the pending application
4. Click "Approve"
5. Check **Table Editor > tutors** - the tutor should now appear
6. Check **Table Editor > tutor_applications** - status should be `approved`

### Student Booking:
1. Go to `/tutors`
2. Click on a tutor profile
3. Click "Book a session"
4. Fill the form and submit
5. Check **Table Editor > bookings** - booking should appear

## Step 8: Enable Realtime (Optional)

For real-time notifications and live updates:

1. In Supabase Dashboard, go to **Database > Replication**
2. Enable replication for:
   - `bookings`
   - `sessions`
   - `payments`
   - `notifications`
   - `student_progress`

## Troubleshooting

### Forms not saving data:
- Check browser console for errors
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct in `.env.local`
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set (for server operations)
- Check Supabase Dashboard > Logs for database errors

### Tutor applications not appearing:
- Ensure schema was run successfully
- Check `tutor_applications` table in Supabase
- Verify RLS policies allow inserts

### Admin can't approve tutors:
- Ensure admin user has `role: admin` in `profiles` table
- Check `/api/admin/tutors/$id` endpoint is accessible

### Images not uploading:
- Ensure `tutor-images` bucket exists in Storage
- Check storage policies allow uploads
- Verify file size is under 5MB

## Production Deployment

1. Add environment variables to Vercel:
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add all variables from `.env.local`
   - Important: `SUPABASE_SERVICE_ROLE_KEY` should be server-only

2. Redeploy:
   ```bash
   vercel --prod
   ```

## Security Notes

- Never commit `.env.local` to git
- `SUPABASE_SERVICE_ROLE_KEY` bypasses all RLS - keep it server-only
- `tutor-documents` bucket is private - only admins can view documents
- All user inputs are validated both client-side and server-side
