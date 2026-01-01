# Quick Setup Guide for PiA Salary Tracker

## Important: Complete These Steps Before Running the App

### Step 1: Set Up Supabase

1. Go to https://supabase.com and create a free account
2. Click "New Project" and create a new project
3. Wait for the project to initialize (~2 minutes)
4. Go to **SQL Editor** in your Supabase dashboard
5. Click "New Query"
6. Copy all contents from `supabase-schema.sql` and paste into the editor
7. Click "Run" to create the database tables

### Step 2: Get Your Supabase Credentials

1. In Supabase dashboard, click **Settings** (gear icon)
2. Go to **API** section
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxx.supabase.co`)
   - **anon/public key** (looks like: `eyJhbGciOiJIUzI1NiIsInR...`)

### Step 3: Update Environment Variables

1. Open the `.env.local` file in the project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

3. Save the file

### Step 4: Run the Application

```bash
npm run dev
```

Open **http://localhost:4500** in your browser.

**Important**: This project uses port 4500 instead of the default 3000.

If you see a "port already in use" error, run:
```bash
npm run kill-port
```
Then try `npm run dev` again.

### Step 5: Create Your Account

1. Click "Registrieren" (Sign up)
2. Enter your email and password
3. You'll be automatically logged in!

## That's It!

You now have a fully functional salary tracking application. Check the main README.md for detailed usage instructions and deployment options.

## Common Issues

**Issue**: "Not authenticated" error
**Solution**: Make sure you updated the `.env.local` file with your actual Supabase credentials

**Issue**: "Cannot find module" errors
**Solution**: Run `npm install` to install all dependencies

**Issue**: Database errors
**Solution**: Make sure you ran the SQL migration in Supabase (Step 1, items 4-7)

## Need Help?

Refer to the detailed README.md file for comprehensive documentation including:
- Detailed setup instructions
- Usage guide
- Database schema details
- Deployment options
- Troubleshooting
