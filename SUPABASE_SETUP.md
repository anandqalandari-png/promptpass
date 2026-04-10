# Supabase Setup — PromptPass

Follow these steps exactly. Do not continue until each step is confirmed.

---

## 1. Create your account

Go to [https://supabase.com](https://supabase.com) → **Start your project** → sign up free.

---

## 2. Create a new project

- Click **New project**
- Name it: `promptpass`
- Set a strong database password (save it somewhere)
- Choose the region closest to your users (e.g. West EU for France)
- Click **Create new project** — wait ~2 minutes for it to provision

---

## 3. Create the unlocked_packages table

- In the left sidebar go to **SQL Editor**
- Click **New query**
- Paste and run this exact SQL:

```sql
CREATE TABLE unlocked_packages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  department_id text NOT NULL,
  stripe_session_id text,
  created_at timestamp DEFAULT now(),
  UNIQUE(email, department_id)
);
```

- Click **Run** (or press Cmd+Enter)
- You should see: `Success. No rows returned`

---

## 4. Get your API credentials

- In the left sidebar go to **Settings → API**
- Copy these two values:
  - **Project URL** — looks like `https://xxxxxxxxxxxx.supabase.co`
  - **anon public** key — a long JWT string under "Project API keys"

---

## 5. Add to your .env file

Open `/Users/anandqalandari/promptpass/.env` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 6. Confirm

Once you have:
- ✓ Project created
- ✓ SQL query ran successfully
- ✓ `.env` updated with real URL and key

**Reply "Supabase done" and we will move to Step 2.**
