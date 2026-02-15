-- =====================================================
-- FIX: Create the correct create_volunteer function
-- Using your actual column names (snake_case)
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create the updated create_volunteer function
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
    auth_user_id,
    email,
    name,
    phone,
    district,
    state,
    motivation,
    temp_password,
    status,
    email_verified,
    is_active,
    total_coins,
    total_scans,
    avg_rating,
    created_at,
    updated_at
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Volunteer_email_idx" ON "Volunteer"(email);
CREATE INDEX IF NOT EXISTS "Volunteer_auth_user_id_idx" ON "Volunteer"(auth_user_id);

-- =====================================================
-- OPTIONAL: Insert the orphaned volunteer record
-- Uncomment and run this if you want to fix the previous attempt
-- =====================================================

-- INSERT INTO "Volunteer" (
--   auth_user_id, email, name, phone, district, state, 
--   status, email_verified, is_active, temp_password, 
--   total_coins, total_scans, avg_rating, created_at, updated_at
-- ) VALUES (
--   '6a9d5c1c-28ab-4719-97ab-3b0a55d7e029', 
--   'ashutoshpatraybl@gmail.com', 
--   'Ashutosh Patra', 
--   '8249912238', 
--   'SBP', 
--   'Odisha',
--   'active', true, true, 'A82499', 0, 0, 0, NOW(), NOW()
-- );
