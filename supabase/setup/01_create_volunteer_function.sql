-- =====================================================
-- CRITICAL: Run this SQL in Supabase SQL Editor
-- BEFORE deploying the application
-- =====================================================

-- Create the create_volunteer RPC function
-- This is REQUIRED for volunteer registration to work

CREATE OR REPLACE FUNCTION create_volunteer(
  p_auth_user_id UUID,
  p_email TEXT,
  p_name TEXT,
  p_phone TEXT,
  p_district TEXT,
  p_state TEXT,
  p_motivation TEXT DEFAULT NULL
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
    'pending',
    false,
    false,
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
GRANT EXECUTE ON FUNCTION create_volunteer(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION create_volunteer(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION create_volunteer(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- Verify the function was created
SELECT 
  proname as function_name,
  prorettype::regtype as return_type
FROM pg_proc 
WHERE proname = 'create_volunteer';

-- =====================================================
-- OPTIONAL: Emergency cleanup queries
-- Uncomment and run if needed
-- =====================================================

-- Delete a user completely (both auth and Volunteer table):
-- DELETE FROM auth.users WHERE email = 'user@example.com';
-- DELETE FROM "Volunteer" WHERE email = 'user@example.com';

-- Manually verify a user's email:
-- UPDATE "Volunteer" SET "emailVerified" = true, status = 'active', "isActive" = true WHERE email = 'user@example.com';

-- List all volunteers:
-- SELECT id, name, email, status, "emailVerified", "createdAt" FROM "Volunteer" ORDER BY "createdAt" DESC;

-- =====================================================
