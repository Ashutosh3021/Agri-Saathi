-- Supabase RPC Functions for Leaderboard Rank Calculation
-- These functions are called by the Edge Function to recalculate ranks

-- Function to recalculate national ranks
CREATE OR REPLACE FUNCTION recalculate_national_ranks()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  WITH ranked AS (
    SELECT 
      "volunteerId" as volunteer_id,
      ROW_NUMBER() OVER (ORDER BY "totalCoins" DESC) as new_rank
    FROM "LeaderboardCache"
  )
  UPDATE "LeaderboardCache"
  SET "nationalRank" = ranked.new_rank
  FROM ranked
  WHERE "LeaderboardCache"."volunteerId" = ranked.volunteer_id;
END;
$$;

-- Function to recalculate state ranks
CREATE OR REPLACE FUNCTION recalculate_state_ranks()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  WITH state_ranked AS (
    SELECT 
      "volunteerId" as volunteer_id,
      ROW_NUMBER() OVER (PARTITION BY state ORDER BY "totalCoins" DESC) as new_rank
    FROM "LeaderboardCache"
    WHERE state IS NOT NULL AND state != ''
  )
  UPDATE "LeaderboardCache"
  SET "stateRank" = state_ranked.new_rank
  FROM state_ranked
  WHERE "LeaderboardCache"."volunteerId" = state_ranked.volunteer_id;
END;
$$;

-- Function to recalculate district ranks
CREATE OR REPLACE FUNCTION recalculate_district_ranks()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  WITH district_ranked AS (
    SELECT 
      "volunteerId" as volunteer_id,
      ROW_NUMBER() OVER (PARTITION BY district ORDER BY "totalCoins" DESC) as new_rank
    FROM "LeaderboardCache"
    WHERE district IS NOT NULL AND district != ''
  )
  UPDATE "LeaderboardCache"
  SET "districtRank" = district_ranked.new_rank
  FROM district_ranked
  WHERE "LeaderboardCache"."volunteerId" = district_ranked.volunteer_id;
END;
$$;

-- Grant execute permissions to service role
GRANT EXECUTE ON FUNCTION recalculate_national_ranks() TO service_role;
GRANT EXECUTE ON FUNCTION recalculate_state_ranks() TO service_role;
GRANT EXECUTE ON FUNCTION recalculate_district_ranks() TO service_role;

-- Alternative: Single function that updates all ranks at once
CREATE OR REPLACE FUNCTION refresh_all_leaderboard_ranks()
RETURNS TABLE(updated_count bigint)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update national ranks
  WITH ranked AS (
    SELECT 
      "volunteerId" as vid,
      ROW_NUMBER() OVER (ORDER BY "totalCoins" DESC) as new_rank
    FROM "LeaderboardCache"
  )
  UPDATE "LeaderboardCache"
  SET "nationalRank" = ranked.new_rank
  FROM ranked
  WHERE "LeaderboardCache"."volunteerId" = ranked.vid;

  -- Update state ranks
  WITH state_ranked AS (
    SELECT 
      "volunteerId" as vid,
      ROW_NUMBER() OVER (PARTITION BY state ORDER BY "totalCoins" DESC) as new_rank
    FROM "LeaderboardCache"
    WHERE state IS NOT NULL AND state != ''
  )
  UPDATE "LeaderboardCache"
  SET "stateRank" = state_ranked.new_rank
  FROM state_ranked
  WHERE "LeaderboardCache"."volunteerId" = state_ranked.vid;

  -- Update district ranks
  WITH district_ranked AS (
    SELECT 
      "volunteerId" as vid,
      ROW_NUMBER() OVER (PARTITION BY district ORDER BY "totalCoins" DESC) as new_rank
    FROM "LeaderboardCache"
    WHERE district IS NOT NULL AND district != ''
  )
  UPDATE "LeaderboardCache"
  SET "districtRank" = district_ranked.new_rank
  FROM district_ranked
  WHERE "LeaderboardCache"."volunteerId" = district_ranked.vid;

  -- Update lastUpdated timestamp
  UPDATE "LeaderboardCache"
  SET "lastUpdated" = NOW();

  -- Return count
  RETURN QUERY SELECT COUNT(*)::bigint FROM "LeaderboardCache";
END;
$$;

GRANT EXECUTE ON FUNCTION refresh_all_leaderboard_ranks() TO service_role;
