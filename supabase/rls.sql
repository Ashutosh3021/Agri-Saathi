-- Supabase Row Level Security (RLS) Policies for Agri Sathi
-- Run this in the Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE "Farmer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Volunteer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Scan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SoilReading" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CoinTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Redemption" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeaderboardCache" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DiseaseTreatment" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FARMERS TABLE
-- ============================================
-- Service role only (no direct public access)
CREATE POLICY "Service role full access on Farmer"
ON "Farmer" FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- VOLUNTEERS TABLE
-- ============================================
-- Volunteer can SELECT/UPDATE their own row
CREATE POLICY "Volunteer can select own profile"
ON "Volunteer" FOR SELECT
TO authenticated
USING ("userId" = auth.uid());

CREATE POLICY "Volunteer can update own profile"
ON "Volunteer" FOR UPDATE
TO authenticated
USING ("userId" = auth.uid())
WITH CHECK ("userId" = auth.uid());

-- Admin can SELECT all volunteers
CREATE POLICY "Admin can select all volunteers"
ON "Volunteer" FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Service role full access
CREATE POLICY "Service role full access on Volunteer"
ON "Volunteer" FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- SCANS TABLE
-- ============================================
-- Volunteer can SELECT their own scans
CREATE POLICY "Volunteer can select own scans"
ON "Scan" FOR SELECT
TO authenticated
USING (
  "volunteerId" IN (
    SELECT "id" FROM "Volunteer" WHERE "userId" = auth.uid()
  )
);

-- Service role full access
CREATE POLICY "Service role full access on Scan"
ON "Scan" FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- SOIL READINGS TABLE
-- ============================================
-- Volunteer can SELECT their own soil readings
CREATE POLICY "Volunteer can select own soil readings"
ON "SoilReading" FOR SELECT
TO authenticated
USING (
  "volunteerId" IN (
    SELECT "id" FROM "Volunteer" WHERE "userId" = auth.uid()
  )
);

-- Service role full access
CREATE POLICY "Service role full access on SoilReading"
ON "SoilReading" FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- COIN TRANSACTIONS TABLE
-- ============================================
-- Volunteer can SELECT their own transactions
CREATE POLICY "Volunteer can select own transactions"
ON "CoinTransaction" FOR SELECT
TO authenticated
USING (
  "volunteerId" IN (
    SELECT "id" FROM "Volunteer" WHERE "userId" = auth.uid()
  )
);

-- Service role can INSERT/UPDATE
CREATE POLICY "Service role can insert transactions"
ON "CoinTransaction" FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update transactions"
ON "CoinTransaction" FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- REDEMPTIONS TABLE
-- ============================================
-- Volunteer can SELECT their own redemptions
CREATE POLICY "Volunteer can select own redemptions"
ON "Redemption" FOR SELECT
TO authenticated
USING (
  "volunteerId" IN (
    SELECT "id" FROM "Volunteer" WHERE "userId" = auth.uid()
  )
);

-- Volunteer can INSERT their own redemptions
CREATE POLICY "Volunteer can insert own redemptions"
ON "Redemption" FOR INSERT
TO authenticated
WITH CHECK (
  "volunteerId" IN (
    SELECT "id" FROM "Volunteer" WHERE "userId" = auth.uid()
  )
);

-- Admin can UPDATE (approve/reject) any redemption
CREATE POLICY "Admin can update redemptions"
ON "Redemption" FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Service role full access
CREATE POLICY "Service role full access on Redemption"
ON "Redemption" FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- LEADERBOARD CACHE TABLE
-- ============================================
-- Public SELECT (anyone can read the leaderboard)
CREATE POLICY "Public can read leaderboard"
ON "LeaderboardCache" FOR SELECT
TO anon, authenticated
USING (true);

-- Service role full access
CREATE POLICY "Service role full access on LeaderboardCache"
ON "LeaderboardCache" FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- DISEASE TREATMENTS TABLE
-- ============================================
-- Public SELECT
CREATE POLICY "Public can read disease treatments"
ON "DiseaseTreatment" FOR SELECT
TO anon, authenticated
USING (true);

-- Service role INSERT/UPDATE
CREATE POLICY "Service role can modify disease treatments"
ON "DiseaseTreatment" FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- SUPABASE STORAGE BUCKETS
-- ============================================

-- Create scan-images bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'scan-images',
  'scan-images',
  false,
  5242880,  -- 5MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Create profile-photos bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  2097152,  -- 2MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Storage policies for scan-images bucket
CREATE POLICY "Service role can upload scan images"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'scan-images');

CREATE POLICY "Authenticated users can read own scan images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'scan-images');

CREATE POLICY "Service role can delete scan images"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'scan-images');

-- Storage policies for profile-photos bucket
CREATE POLICY "Public can read profile photos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'profile-photos');

CREATE POLICY "Authenticated users can upload own profile photo"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own profile photo"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
