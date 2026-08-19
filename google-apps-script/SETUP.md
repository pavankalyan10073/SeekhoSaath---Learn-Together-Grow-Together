# Google Sheets Integration Setup

## Step 1: Create Google Sheet
1. Go to https://sheets.google.com and create a new spreadsheet
2. Name it "SeekhoSaath Bookings"
3. Copy the Sheet ID from the URL:
   - URL: `https://docs.google.com/spreadsheets/d/1A2b3C4d5E6f7G8h9I0j/edit#gid=0`
   - Sheet ID: `1A2b3C4d5E6f7G8h9I0j`

## Step 2: Create Apps Script
1. Go to https://script.google.com
2. Click "New project"
3. Delete the default `Code.gs` content
4. Copy the entire content from `Code.gs` in this folder
5. Replace `REPLACE_WITH_YOUR_SHEET_ID` with your actual Sheet ID
6. Save the project (Ctrl+S or File > Save) - name it "SeekhoSaath Webhook"

## Step 3: Deploy as Web App
1. Click "Deploy" > "New deployment"
2. Select type: **Web app**
3. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click "Deploy"
5. Copy the webhook URL (looks like: `https://script.google.com/macros/s/.../exec`)

## Step 4: Add Environment Variables
Add these to your Vercel project or `.env` file:

```env
VITE_GOOGLE_SHEET_WEBHOOK=https://script.google.com/macros/s/your-webhook-id/exec
VITE_WHATSAPP_NUMBER=9391485316
```

## Step 5: Redeploy
Redeploy your Vercel project for the environment variables to take effect.

## How It Works
- **Book a session** form data → Google Sheet tab "Bookings"
- **Schedule a Meeting** form data → Google Sheet tab "Bookings"
- Each submission creates a new row with timestamp, type, and all form fields
- The webhook receives JSON payloads from both `/api/booking` and `/api/meeting`

## Google Sheet Columns
The script will create these columns automatically:
1. Timestamp
2. Type (book_session / meeting)
3. Full Name
4. Phone
5. Email
6. Mode (online/offline/hybrid)
7. Tuition Type
8. Date
9. Time
10. Tutor Name
11. Tutor Subject
12. Raw JSON payload
