-- =====================================================
-- FIX: Use correct column names (snake_case for database)
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Add all required columns to Volunteer table (using snake_case)
ALTER TABLE "Volunteer" 
ADD COLUMN IF NOT EXISTS "auth_user_id" UUID,
ADD COLUMN IF NOT EXISTS "email" TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS "motivation" TEXT,
ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'pending_verification',
ADD COLUMN IF NOT EXISTS "email_verified" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "last_login" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "last_login_attempt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "temp_password" TEXT,
ADD COLUMN IF NOT EXISTS "password_changed" BOOLEAN DEFAULT false;

-- Step 2: Update existing volunteers to have active status
UPDATE "Volunteer" 
SET "status" = 'active',
    "email_verified" = true,
    "isActive" = true
WHERE "email" IS NOT NULL;

-- Step 3: Create the updated create_volunteer function (using snake_case)
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
    "auth_user_id",
    email,
    name,
    phone,
    district,
    state,
    motivation,
    "temp_password",
    status,
    "email_verified",
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
CREATE INDEX IF NOT EXISTS "Volunteer_auth_user_id_idx" ON "Volunteer"("auth_user_id");

-- Step 6: Verify all columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'Volunteer' 
ORDER BY ordinal_position;

-- =====================================================
-- MANUAL FIX: Insert the orphaned volunteer record
-- Run this if the user was created but volunteer record failed
-- =====================================================

-- INSERT INTO "Volunteer" (
--   "auth_user_id", email, name, phone, district, state, 
--   status, "email_verified", "isActive", "temp_password", 
--   "totalCoins", "totalScans", "avgRating", "createdAt", "updatedAt"
-- ) VALUES (
--   '6a9d5c1c-28ab-4719-97ab-3b0a55d7e029', 
--   'ashutoshpatraybl@gmail.com', 
--   'Ashutosh Patra', 
--   '8249912238', 
--   'SBP', 
--   'Odisha',
--   'active', true, true, 'A82499', 0, 0, 0, NOW(), NOW()
-- );
