-- =====================================================
-- CRITICAL: Run this SQL in Supabase SQL Editor NOW
-- This fixes the column not found error
-- =====================================================

-- Step 1: Add all required columns to Volunteer table
ALTER TABLE "Volunteer" 
ADD COLUMN IF NOT EXISTS "authUserId" UUID,
ADD COLUMN IF NOT EXISTS "email" TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS "motivation" TEXT,
ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'pending_verification',
ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "lastLogin" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "lastLoginAttempt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "tempPassword" TEXT,
ADD COLUMN IF NOT EXISTS "passwordChanged" BOOLEAN DEFAULT false;

-- Step 2: Update existing volunteers to have active status
UPDATE "Volunteer" 
SET "status" = 'active',
    "emailVerified" = true,
    "isActive" = true
WHERE "email" IS NOT NULL;

-- Step 3: Create the updated create_volunteer function
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

-- Step 4: Grant execute permissions
GRANT EXECUTE ON FUNCTION create_volunteer(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION create_volunteer(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION create_volunteer(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- Step 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Volunteer_email_idx" ON "Volunteer"(email);
CREATE INDEX IF NOT EXISTS "Volunteer_authUserId_idx" ON "Volunteer"("authUserId");

-- Step 6: Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'Volunteer' 
ORDER BY ordinal_position;

-- =====================================================
-- VERIFICATION QUERY - Run this to check if it worked
-- =====================================================
-- SELECT * FROM "Volunteer" LIMIT 1;
