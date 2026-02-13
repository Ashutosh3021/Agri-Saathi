# Agri Sathi - Complete Setup Checklist

> **Last Updated:** 2025-02-13
> 
> This document contains all the steps required to get the Agri Sathi platform fully operational.

## 🚨 CRITICAL - Must Do First

### 1. Update Supabase Service Role Key
The 500 error when submitting the volunteer form is caused by a missing service role key.

**Steps:**
1. Go to https://supabase.com/dashboard
2. Select your project: `jfsjnbjzsabkbxmrzbdx`
3. Navigate to: **Project Settings → API**
4. Find the **service_role** key (under "Project API keys")
5. Copy it (it starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
6. Update `.env.local` file:
   ```env
   SUPABASE_SERVICE_ROLE_KEY="your-actual-service-role-key-here"
   ```

⚠️ **WARNING:** Never commit this key to Git. It has admin privileges.

---

## 📋 Database Setup

### 2. Apply Prisma Schema Changes
The database schema has been updated with new fields for volunteer authentication.

**Steps:**
```bash
# Generate Prisma client (creates TypeScript types)
npx prisma generate

# Push schema changes to database
npx prisma db push

# Optional: Open Prisma Studio to verify
npx prisma studio
```

**Expected Output:**
- Prisma client generated successfully
- Database schema updated with new Volunteer fields

---

## 🔐 Authentication Setup

### 3. Configure Supabase Auth

**Enable Email Provider:**
1. Supabase Dashboard → Authentication → Providers
2. Find "Email" provider
3. Enable it
4. Configure settings:
   - ✅ Enable "Confirm email"
   - ✅ Enable "Secure email change"
   - Set "Mailer OTP Expiration" to 86400 (24 hours)

**Update Site URL:**
1. Supabase Dashboard → Authentication → URL Configuration
2. Set "Site URL" to: `http://localhost:3000`
3. Add to "Redirect URLs":
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/Volunteers/Dashboard`

---

## 📧 Email Configuration (Optional but Recommended)

### 4. Set Up Email Provider
Without email provider, magic links won't be sent. For development, you can view emails in Supabase.

**Option A: Use Supabase Default (Development)**
- Emails will appear in Supabase Dashboard → Auth → Emails
- No configuration needed

**Option B: Use Custom SMTP (Production)**
1. Supabase Dashboard → Project Settings → Auth
2. Enable "Custom SMTP"
3. Configure your SMTP provider (SendGrid, AWS SES, etc.)

---

## 🧪 Testing the Volunteer Flow

### 5. Test Complete Signup Process

**Step 1: Navigate to Landing Page**
```
http://localhost:3000
```

**Step 2: Submit Volunteer Form**
1. Scroll to "Join as Volunteer" section
2. Fill the form:
   - Full Name: Test User
   - Phone: 9876543210
   - Email: your-test-email@example.com
   - District: Test District
   - State: Maharashtra
   - Motivation: I want to help farmers
3. Submit

**Expected Result:**
- ✅ Success message appears
- ✅ Check your email for verification link
- ✅ New user appears in Supabase Auth → Users

**Step 3: Verify Email**
1. Check your email inbox
2. Click the verification link
3. You should be redirected to `/Volunteers/Dashboard`

**Step 4: Login (After Verification)**
1. Go to `/Volunteers`
2. Enter your email
3. Check email for magic link
4. Click link to access dashboard

---

## 🔍 Troubleshooting Common Issues

### Issue: "Failed to create account" Error
**Cause:** Missing or invalid SUPABASE_SERVICE_ROLE_KEY
**Fix:** Complete Step 1 above

### Issue: "Cannot find module '@prisma/client'"
**Cause:** Prisma client not generated
**Fix:** Run `npx prisma generate`

### Issue: "Database connection failed"
**Cause:** Invalid DATABASE_URL
**Fix:** Check `.env` file has correct database credentials

### Issue: Emails not being received
**Cause:** No email provider configured
**Fix:** Check Supabase Dashboard → Auth → Emails to view sent emails

### Issue: "Volunteer not found" after login
**Cause:** Database schema mismatch
**Fix:** Run `npx prisma db push` to update database

### Issue: Dashboard shows 404
**Cause:** Wrong route structure
**Fix:** Ensure you're accessing `/Volunteers/Dashboard` (capital V)

---

## 🚀 Production Deployment Checklist

### Before deploying to production:

- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Configure custom SMTP for email delivery
- [ ] Set up proper CORS in Supabase
- [ ] Enable Row Level Security (RLS) policies
- [ ] Configure webhook endpoints
- [ ] Set up monitoring and logging
- [ ] Test all authentication flows
- [ ] Verify database backups

---

## 📁 File Structure Verification

Ensure these files exist:

```
.env                          # Database URLs only
.env.local                    # All secrets (not in git)
app/
├── api/
│   ├── auth/
│   │   └── send-magic-link/
│   │       └── route.ts      # Magic link API
│   ├── volunteer/
│   │   ├── apply/
│   │   │   └── route.ts      # Volunteer signup
│   │   └── me/
│   │       └── route.ts      # Get current volunteer
│   └── auth/
│       └── callback/
│           └── route.ts      # Handle email verification
├── Volunteers/               # Volunteer portal (Capital V)
│   ├── app/
│   │   ├── page.tsx          # Login landing
│   │   └── volunteers/
│   │       └── page.tsx      # Login form
│   └── Dashboard/            # Dashboard sub-project
│       └── app/
│           └── Volunteers/
│               └── Dashboard/
│                   ├── page.tsx
│                   └── layout.tsx
├── auth/
│   └── callback/
│       └── route.ts          # Auth callback handler
├── components/
│   └── landing/
│       ├── VolunteerCTASection.tsx
│       └── navbar.tsx
middleware.ts                  # Route protection
prisma/
└── schema.prisma             # Database schema
```

---

## 🔧 Environment Variables Reference

### Required in `.env.local`:

```env
# Database (from Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT]...[POOLER]"
DIRECT_URL="postgresql://postgres.[PROJECT]...[DIRECT]"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE_ROLE_KEY]"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional
INTERNAL_API_KEY="[RANDOM_STRING]"
CRON_SECRET="[RANDOM_STRING]"
```

---

## ✅ Verification Steps

Run these commands to verify setup:

```bash
# 1. Check Node.js version
node -v  # Should be 18.x or higher

# 2. Install dependencies
pnpm install

# 3. Generate Prisma client
npx prisma generate

# 4. Start development server
pnpm dev

# 5. Test the API
curl -X POST http://localhost:3000/api/volunteer/apply \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"9876543210","email":"test@test.com","district":"Test","state":"Maharashtra","motivation":"Test"}'
```

---

## 📝 Next Steps After Setup

1. **Test the entire flow** - Signup → Verification → Login → Dashboard
2. **Add your own branding** - Update colors, logos, images
3. **Configure WhatsApp** - For farmer notifications (optional)
4. **Set up ML service** - For crop disease detection (optional)
5. **Deploy to Vercel** - Production deployment guide

---

## 🆘 Getting Help

If you encounter issues:

1. Check browser console for errors
2. Check server logs (terminal running `pnpm dev`)
3. Check Supabase Dashboard logs
4. Verify all environment variables are set
5. Ensure database is accessible

**Support Resources:**
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

---

## 📊 Quick Health Check

After setup, verify these work:

- [ ] Landing page loads at `/`
- [ ] Volunteer form submits without 500 error
- [ ] Email received after signup
- [ ] Email verification link works
- [ ] Dashboard accessible after login
- [ ] Logout functionality works
- [ ] Navbar shows correct auth state

---

**Status:** ⏳ Setup In Progress
**Last Verified:** [Fill in after completing checklist]
