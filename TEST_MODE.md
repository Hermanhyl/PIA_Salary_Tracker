# 🧪 TEST MODE - Temporary Authentication Bypass

## ✅ You Can Now Test the App Without Supabase!

The app is currently running in **TEST MODE** which allows you to explore all features without setting up Supabase first.

---

## 🚀 How to Access the Dashboard

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open your browser** to: **http://localhost:4500**

3. You'll see the **login page** with a special orange button:

   **🧪 Test Mode - Skip to Dashboard**

4. **Click that button** to instantly access the dashboard!

---

## ⚠️ What's Different in Test Mode

- ✅ No authentication required
- ✅ You can see all UI components and pages
- ✅ Mock user email shown: `test@example.com`
- ❌ **Data won't be saved** (no database connection)
- ❌ Add/Edit forms won't persist data
- ❌ CSV export won't have real data

---

## 🎯 What You Can Test

### ✅ Working Features:
- Navigate through all pages
- See the dashboard layout
- View summary cards (will show zeros)
- See the monthly data table (empty state)
- Open the Add Entry dialog
- View the Settings page
- Explore the UI and design
- Test mobile responsiveness
- Try dark mode (if your system has dark mode)

### ❌ Not Working (requires Supabase):
- Saving salary entries
- Loading saved data
- User authentication
- Data persistence
- CSV export with real data

---

## 🔄 When You're Ready to Enable Full Features

### Step 1: Set Up Supabase
Follow the instructions in `SETUP_GUIDE.md` to:
1. Create a Supabase account
2. Run the database migration
3. Get your credentials

### Step 2: Update `.env.local`
Add your real Supabase credentials

### Step 3: Remove Test Mode

You need to uncomment the authentication code in these 3 files:

#### 1. `middleware.ts`
```typescript
// Change FROM:
export async function middleware(request: NextRequest) {
  // return await updateSession(request);
  return NextResponse.next();
}

// Change TO:
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
```

#### 2. `app/page.tsx`
```typescript
// Uncomment all these lines:
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return <DashboardContent />;
}
```

#### 3. `app/(dashboard)/layout.tsx`
```typescript
// Uncomment all these lines:
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader user={user} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
```

#### 4. `app/(auth)/login/page.tsx`
**Remove the orange test button** (lines 103-111)

---

## 📝 Files Modified for Test Mode

All changes are marked with comments:
```typescript
// TEMPORARY: Authentication disabled for testing
// TODO: Remove this when Supabase is configured
```

Search for these comments to find all test mode code.

---

## 🎉 Enjoy Testing!

You can now explore the entire UI and see how everything works before committing to setting up Supabase.

When you're ready for the full experience with data persistence, just follow the steps above to enable authentication!
