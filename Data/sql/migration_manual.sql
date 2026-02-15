-- ============================================
-- Agri Sathi Database Migration
-- Add volunteer authentication fields
-- ============================================

-- Step 1: Add new columns to Volunteer table
ALTER TABLE "Volunteer" 
ADD COLUMN IF NOT EXISTS "email" TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS "auth_user_id" UUID UNIQUE,
ADD COLUMN IF NOT EXISTS "motivation" TEXT,
ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'pending_verification',
ADD COLUMN IF NOT EXISTS "email_verified" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "last_login" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "last_login_attempt" TIMESTAMP;

-- Step 2: Update existing volunteers (if any) to have default values
UPDATE "Volunteer" 
SET "status" = 'active',
    "email_verified" = true,
    "isActive" = true
WHERE "email" IS NOT NULL;

-- Step 3: Make email required for new volunteers (optional - only if you want to enforce this)
-- Note: Only run this if all existing volunteers have emails
-- ALTER TABLE "Volunteer" ALTER COLUMN "email" SET NOT NULL;

-- Step 4: Create index for faster lookups
CREATE INDEX IF NOT EXISTS "Volunteer_email_idx" ON "Volunteer"("email");
CREATE INDEX IF NOT EXISTS "Volunteer_auth_user_id_idx" ON "Volunteer"("auth_user_id");

-- Step 5: Add password authentication columns
ALTER TABLE "Volunteer" 
ADD COLUMN IF NOT EXISTS "temp_password" TEXT,
ADD COLUMN IF NOT EXISTS "password_changed" BOOLEAN DEFAULT false;

-- Step 6: Create index for faster lookups
CREATE INDEX IF NOT EXISTS "Volunteer_email_idx" ON "Volunteer"("email");
CREATE INDEX IF NOT EXISTS "Volunteer_auth_user_id_idx" ON "Volunteer"("auth_user_id");

-- Step 7: Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'Volunteer' 
ORDER BY ordinal_position;
