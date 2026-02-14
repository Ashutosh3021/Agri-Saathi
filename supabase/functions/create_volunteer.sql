-- Create the create_volunteer RPC function
-- This is required for volunteer registration to work

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
  -- Insert volunteer record
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

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION create_volunteer(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;

-- Also grant to anon and authenticated for safety (though service_role is used)
GRANT EXECUTE ON FUNCTION create_volunteer(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION create_volunteer(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
