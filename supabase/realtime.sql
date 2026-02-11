-- Supabase Realtime Configuration
-- Enable realtime on tables for live updates

-- Add tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard_cache;
ALTER PUBLICATION supabase_realtime ADD TABLE coin_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE scans;

-- Note: Run this in the Supabase SQL Editor after enabling Realtime in the Dashboard
-- Realtime must be enabled in the Supabase Dashboard under Database > Realtime
