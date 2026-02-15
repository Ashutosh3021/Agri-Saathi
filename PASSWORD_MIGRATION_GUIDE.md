# Password-Based Authentication Migration Guide

## Overview
We've successfully migrated from Supabase Magic Link authentication to Password-based authentication for volunteers to avoid rate limiting issues on the free plan.

## Changes Made

### 1. Database Schema Changes
**File:** `prisma/schema.prisma`
- Added `tempPassword` field to store the initial auto-generated password
- Added `passwordChanged` boolean field to track if user has changed their password

### 2. Database Migration
**File:** `prisma/migration_manual.sql` & `supabase/setup/01_create_volunteer_function.sql`
- Added SQL migration to add new columns
- Updated `create_volunteer` function to accept `p_temp_password` parameter

### 3. Volunteer Registration API
**File:** `app/api/volunteer/apply/route.ts`
- Password Generation: First letter of name + first 5 digits of phone number
  - Example: Name: "Ashutosh Patra", Phone: "8249912238" → Password: "A82499"
- Creates Supabase auth user with password instead of magic link
- Returns credentials in the response

### 4. New Login API
**File:** `app/api/auth/volunteer-login/route.ts`
- Handles email + password authentication
- Includes rate limiting (5 attempts per 15 minutes)
- Sets session cookies on successful login
- Validates user role is 'volunteer'

### 5. Updated Login Form
**File:** `app/Volunteers/components/volunteers/volunteer-login-form.tsx`
- Changed from magic link to password login
- Added password field with show/hide toggle
- Redirects to dashboard on successful login

### 6. Updated Registration Success UI
**File:** `components/landing/VolunteerCTASection.tsx`
- Shows credentials clearly after successful registration
- Copy-to-clipboard functionality for email and password
- Password visibility toggle
- Clear instructions and tips

### 7. Auth Callback Route (Kept for compatibility)
**File:** `app/auth/callback/route.ts`
- Still handles OAuth flows if needed in future
- Maintains session management

## Deployment Steps

### Step 1: Apply Database Changes
Run the following SQL in Supabase SQL Editor:

```sql
-- Add new columns
ALTER TABLE "Volunteer" 
ADD COLUMN IF NOT EXISTS "temp_password" TEXT,
ADD COLUMN IF NOT EXISTS "password_changed" BOOLEAN DEFAULT false;

-- Update the create_volunteer function
CREATE OR REPLACE FUNCTION create_volunteer(
  p_auth_user_id UUID,
  p_email TEXT,
  p_name TEXT,
  p_phone TEXT,
  p_district TEXT,
  p_state TEXT,
  p_motivation TEXT DEFAULT NULL,
  p_temp_password TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_volunteer_id UUID;
BEGIN
  INSERT INTO "Volunteer" (
    "authUserId",
    email,
    name,
    phone,
    district,
    state,
    motivation,
    "tempPassword",
    status,
    "emailVerified",
    "isActive",
    "totalCoins",
    "totalScans",
    "avgRating",
    "createdAt",
    "updatedAt"
  ) VALUES (
    p_auth_user_id,
    p_email,
    p_name,
    p_phone,
    p_district,
    p_state,
    p_motivation,
    p_temp_password,
    'active',
    true,
    true,
    0,
    0,
    0,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_volunteer_id;

  RETURN v_volunteer_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_volunteer(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION create_volunteer(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION create_volunteer(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
```

### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

### Step 3: Deploy Application
Deploy the updated code to your hosting platform (Vercel, etc.)

## New User Flow

1. **Registration:**
   - Volunteer fills the form with name, phone, email, district, state
   - System auto-generates password: First letter of name + first 5 digits of phone
   - Account is created with `email_confirm: true` (auto-verified)
   - Credentials are shown on screen for the user to save

2. **Login:**
   - Volunteer navigates to `/Volunteers`
   - Enters email and password
   - System authenticates with Supabase Auth
   - On success, redirects to `/Volunteers/Dashboard`

## Security Considerations

1. **Password Strength:**
   - Current implementation uses a simple pattern
   - Consider adding password change requirement on first login
   - Future: Allow users to change their password

2. **Rate Limiting:**
   - Login: 5 attempts per 15 minutes per IP
   - Registration: 3 attempts per hour per IP

3. **Data Storage:**
   - Password is stored in Supabase Auth (hashed)
   - `tempPassword` in database is for reference only
   - `passwordChanged` field ready for future password change feature

## Benefits of This Approach

1. ✅ No more magic link rate limits
2. ✅ Users can login multiple times without email delays
3. ✅ Better user experience - instant access
4. ✅ Reduced dependency on email delivery
5. ✅ Works even if email is delayed

## Future Improvements

1. Add "Change Password" feature in dashboard
2. Add "Forgot Password" functionality
3. Password strength requirements
4. Two-factor authentication (2FA)
5. Session management (view active sessions, logout from all devices)

## Testing Checklist

- [ ] New volunteer registration creates account successfully
- [ ] Password is generated correctly (first letter + first 5 phone digits)
- [ ] Credentials are displayed after registration
- [ ] Login works with email and generated password
- [ ] Failed login shows appropriate error messages
- [ ] Rate limiting works on both login and registration
- [ ] Dashboard redirects work correctly
- [ ] Session persists across page refreshes
- [ ] Logout functionality works

## Rollback Plan

If you need to rollback:
1. Revert to previous code version
2. Remove new columns from database (optional)
3. Restore magic link functionality

Note: Existing users created with the new system will need to be handled manually if rolling back.
