# PiA Vergütung Tracker

A German salary tracking web application for Psychotherapist in Training (PiA) to track monthly compensation (Vergütung) with automatic tax and insurance deduction calculations.

## Features

- **Authentication**: Secure email/password authentication with Supabase
- **Dashboard**: Year-based overview of all salary records
- **Summary Statistics**: Automatic calculation of total gross, deductions, and net income
- **Monthly Data Table**: Detailed view of all salary components with German formatting
- **Visual Analytics**: Line chart showing monthly income trends
- **Automatic Calculations**: Auto-calculate social insurance deductions based on configurable rates
- **Manual Override**: Ability to manually enter all deduction values
- **Settings Page**: Configure default deduction rates
- **CSV Export**: Download annual data as CSV for external analysis
- **German Localization**: All UI text and date/currency formatting in German
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic theme switching

## Tech Stack

- **Frontend**: Next.js 14+ with App Router, React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Backend**: Supabase (PostgreSQL database + Authentication)
- **Charts**: Recharts
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available at https://supabase.com)
- Git (optional, for version control)

## Setup Instructions

### 1. Clone or Download the Project

```bash
cd pia-salary-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: PiA Salary Tracker (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to you
4. Click "Create new project" and wait for initialization (~2 minutes)

#### Get Your Supabase Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon)
2. Go to **API** section
3. You'll need:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

#### Run the Database Migration

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql` from this project
4. Paste it into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned" - this means the tables were created successfully

### 4. Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`:

```bash
# On Windows (Command Prompt)
copy .env.example .env.local

# On Windows (PowerShell)
Copy-Item .env.example .env.local

# On Mac/Linux
cp .env.example .env.local
```

2. Open `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with the values from step 3.

### 5. Run the Development Server

```bash
npm run dev
```

Open **http://localhost:4500** in your browser. You should see the login page.

**Note**: This project runs on port 4500 to avoid conflicts with other Next.js projects. See `PORT_TROUBLESHOOTING.md` if you encounter any port-related issues.

### 6. Create Your First Account

1. Click "Registrieren" (Sign up)
2. Enter your email and password
3. Click "Registrieren"
4. You'll be automatically logged in and redirected to the dashboard

## Usage Guide

### Adding a Salary Entry

1. On the dashboard, click **"Eintrag hinzufügen"** (Add Entry)
2. Select the month
3. Enter your gross salary (Bruttogehalt)
4. Enter your income tax (Einkommenssteuer) - this varies by tax class
5. Toggle **"Abzüge automatisch berechnen"** (Auto-calculate deductions) if you want automatic calculation of social insurance deductions
6. If auto-calculate is ON, the pension, health/care, and unemployment insurance will be calculated automatically based on your settings
7. If auto-calculate is OFF, you can manually enter each deduction
8. Optionally add notes
9. Review the preview showing total deductions and net income
10. Click **"Speichern"** (Save)

### Editing an Entry

1. In the monthly data table, click the **Edit** icon (pencil) next to the entry
2. Modify any fields
3. Click **"Speichern"** (Save)

### Deleting an Entry

1. Click the **Delete** icon (trash) next to the entry
2. Confirm the deletion in the dialog

### Configuring Deduction Rates

1. Click the **Settings** icon (gear) in the top right
2. Toggle **"Automatische Berechnung"** (Auto-calculate) on/off
3. Adjust the percentage rates for:
   - **Rentenversicherung** (Pension Insurance) - Default: 9.30%
   - **Kranken- und Pflegeversicherung** (Health + Care Insurance) - Default: 9.00%
   - **Arbeitslosenversicherung** (Unemployment Insurance) - Default: 1.30%
4. Click **"Speichern"** (Save)

### Exporting Data

1. Select the year you want to export
2. Click **"CSV Export"**
3. A CSV file will be downloaded with all records for that year

### Viewing Different Years

Use the year selector dropdown next to "Dashboard" to switch between years.

## Database Schema

### Tables

#### monthly_records
Stores salary records for each month.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| month | INTEGER | Month (1-12) |
| year | INTEGER | Year |
| gross_salary | DECIMAL | Gross salary amount |
| income_tax | DECIMAL | Income tax deduction |
| pension_insurance | DECIMAL | Pension insurance deduction |
| health_insurance | DECIMAL | Health + care insurance deduction |
| unemployment_insurance | DECIMAL | Unemployment insurance deduction |
| total_deductions | DECIMAL | Sum of all deductions |
| net_income | DECIMAL | Net income after deductions |
| notes | TEXT | Optional notes |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

#### user_settings
Stores user preferences for automatic calculations.

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | Primary key, foreign key to auth.users |
| auto_calculate_deductions | BOOLEAN | Enable/disable auto-calculation |
| pension_rate | DECIMAL | Pension insurance rate (0.0930 = 9.3%) |
| health_care_rate | DECIMAL | Health+care insurance rate (0.0900 = 9.0%) |
| unemployment_rate | DECIMAL | Unemployment insurance rate (0.0130 = 1.3%) |
| created_at | TIMESTAMP | Settings creation time |
| updated_at | TIMESTAMP | Last update time |

### Row Level Security (RLS)

All tables have RLS enabled. Users can only access their own data. This is enforced at the database level for maximum security.

## Project Structure

```
pia-salary-tracker/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Dashboard page
├── components/
│   ├── dashboard/           # Dashboard-specific components
│   │   ├── add-edit-record-dialog.tsx
│   │   ├── dashboard-content.tsx
│   │   ├── dashboard-header.tsx
│   │   ├── monthly-data-table.tsx
│   │   └── monthly-income-chart.tsx
│   └── ui/                  # Reusable UI components (shadcn/ui)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       └── textarea.tsx
├── lib/
│   ├── supabase/            # Supabase client utilities
│   │   ├── client.ts        # Client-side client
│   │   ├── server.ts        # Server-side client
│   │   └── middleware.ts    # Auth middleware
│   ├── calculations.ts      # Salary calculation logic
│   ├── types.ts             # TypeScript type definitions
│   └── utils.ts             # Utility functions
├── middleware.ts            # Next.js middleware for auth
├── supabase-schema.sql      # Database schema
├── .env.example             # Environment variables template
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub (if not already done)
2. Go to https://vercel.com and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js
6. Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Click "Deploy"
8. Your app will be live in ~2 minutes!

### Other Deployment Options

This is a standard Next.js app and can be deployed to:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify
- Any platform supporting Node.js

## Default Insurance Rates (2024)

The app comes pre-configured with German social insurance rates for 2024 (employee portion):

- **Rentenversicherung** (Pension Insurance): 9.30%
- **Krankenversicherung** (Health Insurance): 7.30%
- **Pflegeversicherung** (Care Insurance): 1.70%
- **Combined Health + Care**: 9.00%
- **Arbeitslosenversicherung** (Unemployment Insurance): 1.30%

**Note**: These rates represent only the employee portion. Income tax (Einkommenssteuer) must be entered manually as it varies by tax class.

## Troubleshooting

### "Not authenticated" error
- Make sure you're logged in
- Try logging out and logging in again
- Clear browser cookies and try again

### Database errors
- Verify your `.env.local` file has the correct Supabase credentials
- Check that you ran the SQL migration in Supabase
- Check the Supabase dashboard logs for detailed error messages

### Build errors
- Make sure all dependencies are installed: `npm install`
- Delete `.next` folder and rebuild: `rm -rf .next && npm run dev`
- Check that Node.js version is 18 or higher: `node --version`

## Security Notes

- Never commit `.env.local` to version control
- The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose in the browser - it's protected by RLS policies
- All database operations are secured with Row Level Security (RLS)
- Users can only access their own data
- Supabase handles password hashing and authentication securely

## License

This project is provided as-is for educational and personal use.

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Review Next.js documentation: https://nextjs.org/docs

## Future Enhancements

Potential features for future development:
- Email confirmation for signups
- Password reset functionality
- Annual tax summary report
- Multi-year comparison charts
- PDF export with formatted reports
- Additional expense tracking
- Tax calculation estimates
- Mobile app (React Native)
