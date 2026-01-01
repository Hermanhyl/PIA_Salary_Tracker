# 🚀 START HERE - PiA Salary Tracker

## Your App is Configured to Run on Port 4500

To avoid conflicts with other Next.js projects, this application runs on **port 4500** instead of the default 3000.

---

## Quick Start (3 Steps)

### 1️⃣ Set Up Supabase (5 minutes)

1. Go to https://supabase.com and create a free account
2. Create a new project
3. In **SQL Editor**, run the SQL from `supabase-schema.sql`
4. In **Settings > API**, copy your:
   - Project URL
   - anon/public key

### 2️⃣ Update Environment Variables (1 minute)

Open `.env.local` and paste your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_key_here
```

### 3️⃣ Start the App (1 minute)

```bash
npm run dev
```

Open: **http://localhost:4500**

---

## 🔧 Port Troubleshooting

### If you see "Port already in use" error:

```bash
npm run kill-port
```

This will kill any stuck processes on ports 3000 and 4500.

### Manual port cleanup (Windows):

```powershell
# Find what's using port 4500
netstat -ano | findstr :4500

# Kill it (replace 12345 with the PID from above)
taskkill /PID 12345 /F
```

### Change the port (if needed):

Edit `package.json` and change `4500` to any port you want:

```json
"dev": "next dev -p 5000"
```

---

## 📚 Documentation

- **README.md** - Complete documentation
- **SETUP_GUIDE.md** - Quick setup reference
- **PORT_TROUBLESHOOTING.md** - Detailed port solutions
- **PROJECT_SUMMARY.md** - What's been built

---

## ✅ First Time Setup Checklist

- [ ] Supabase account created
- [ ] SQL migration run in Supabase
- [ ] `.env.local` updated with real credentials
- [ ] `npm run dev` started successfully
- [ ] Accessing http://localhost:4500
- [ ] Created first account
- [ ] Added first salary entry

---

## 🎯 Features You'll Have

✅ Secure authentication
✅ Add/edit/delete monthly salary entries
✅ Automatic calculation of insurance deductions
✅ Visual charts of income trends
✅ CSV export for data analysis
✅ German formatting (currency, dates, text)
✅ Mobile-responsive design
✅ Dark mode support

---

## 🆘 Need Help?

**Port issues?** → Read `PORT_TROUBLESHOOTING.md`
**Setup issues?** → Read `README.md` Troubleshooting section
**Database errors?** → Check your Supabase credentials in `.env.local`

---

## 🎉 You're All Set!

Once you've completed the 3 steps above, you'll have a fully functional salary tracking application running on **http://localhost:4500**

Happy tracking! 💰
