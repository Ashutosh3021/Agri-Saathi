-- =================================================================
-- Agri Sathi Database Schema
-- =================================================================
-- This SQL file creates all tables for the Agri Sathi application
-- Run this in Supabase SQL Editor
-- =================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================
-- Table: Farmer
-- Description: Stores farmer information and contact details
-- =================================================================
CREATE TABLE "Farmer" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "phone" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "location" TEXT,
    "district" TEXT,
    "state" TEXT,
    "lat" DECIMAL(9, 6),
    "lng" DECIMAL(9, 6),
    "language" TEXT NOT NULL DEFAULT 'hi',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE "Farmer" IS 'Stores farmer information and contact details';

-- =================================================================
-- Table: Volunteer
-- Description: Stores volunteer information, stats, and rankings
-- =================================================================
CREATE TABLE "Volunteer" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "userId" UUID NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL UNIQUE,
    "district" TEXT,
    "state" TEXT,
    "lat" DECIMAL(9, 6),
    "lng" DECIMAL(9, 6),
    "totalCoins" INTEGER NOT NULL DEFAULT 0,
    "totalScans" INTEGER NOT NULL DEFAULT 0,
    "avgRating" DECIMAL(3, 2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE "Volunteer" IS 'Stores volunteer information, stats, and rankings';

-- =================================================================
-- Table: Scan
-- Description: Stores crop disease scan results
-- =================================================================
CREATE TABLE "Scan" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "farmerId" UUID NOT NULL,
    "volunteerId" UUID,
    "scanType" TEXT NOT NULL,
    "imageUrl" TEXT,
    "diseaseDetected" TEXT,
    "confidence" DECIMAL(5, 4),
    "cropType" TEXT,
    "quickFix" TEXT,
    "permanentFix" TEXT,
    "severity" TEXT,
    "rawModelOutput" JSONB,
    "farmerRating" INTEGER,
    "coinsAwarded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE "Scan" IS 'Stores crop disease scan results';

-- Indexes for Scan table
CREATE INDEX "Scan_farmerId_idx" ON "Scan"("farmerId");
CREATE INDEX "Scan_volunteerId_idx" ON "Scan"("volunteerId");
CREATE INDEX "Scan_createdAt_idx" ON "Scan"("createdAt");
CREATE INDEX "Scan_scanType_idx" ON "Scan"("scanType");

-- Foreign key constraints for Scan
ALTER TABLE "Scan" 
    ADD CONSTRAINT "Scan_farmerId_fkey" 
    FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE CASCADE;

ALTER TABLE "Scan" 
    ADD CONSTRAINT "Scan_volunteerId_fkey" 
    FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE SET NULL;

-- =================================================================
-- Table: SoilReading
-- Description: Stores soil sensor readings and recommendations
-- =================================================================
CREATE TABLE "SoilReading" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "farmerId" UUID NOT NULL,
    "volunteerId" UUID,
    "deviceId" TEXT NOT NULL,
    "nitrogen" DECIMAL(6, 2),
    "phosphorus" DECIMAL(6, 2),
    "potassium" DECIMAL(6, 2),
    "moisture" DECIMAL(5, 2),
    "temperature" DECIMAL(5, 2),
    "humidity" DECIMAL(5, 2),
    "ph" DECIMAL(4, 2),
    "rainfall" DECIMAL(6, 2),
    "selectedCrop" TEXT,
    "recommendation" JSONB,
    "coinsAwarded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE "SoilReading" IS 'Stores soil sensor readings and recommendations';

-- Indexes for SoilReading table
CREATE INDEX "SoilReading_farmerId_idx" ON "SoilReading"("farmerId");

-- Foreign key constraints for SoilReading
ALTER TABLE "SoilReading" 
    ADD CONSTRAINT "SoilReading_farmerId_fkey" 
    FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE CASCADE;

ALTER TABLE "SoilReading" 
    ADD CONSTRAINT "SoilReading_volunteerId_fkey" 
    FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE SET NULL;

-- =================================================================
-- Table: CoinTransaction
-- Description: Tracks coin transactions for volunteers
-- =================================================================
CREATE TABLE "CoinTransaction" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "volunteerId" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "transactionType" TEXT NOT NULL,
    "referenceId" UUID,
    "description" TEXT,
    "balanceAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE "CoinTransaction" IS 'Tracks coin transactions for volunteers';

-- Indexes for CoinTransaction table
CREATE INDEX "CoinTransaction_volunteerId_idx" ON "CoinTransaction"("volunteerId");
CREATE INDEX "CoinTransaction_createdAt_idx" ON "CoinTransaction"("createdAt");

-- Foreign key constraint for CoinTransaction
ALTER TABLE "CoinTransaction" 
    ADD CONSTRAINT "CoinTransaction_volunteerId_fkey" 
    FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE CASCADE;

-- =================================================================
-- Table: Redemption
-- Description: Tracks reward redemptions by volunteers
-- =================================================================
CREATE TABLE "Redemption" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "volunteerId" UUID NOT NULL,
    "coinsRedeemed" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "methodDetails" TEXT,
    "amountInr" DECIMAL(8, 2),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "processedAt" TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE "Redemption" IS 'Tracks reward redemptions by volunteers';

-- Foreign key constraint for Redemption
ALTER TABLE "Redemption" 
    ADD CONSTRAINT "Redemption_volunteerId_fkey" 
    FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE CASCADE;

-- =================================================================
-- Table: LeaderboardCache
-- Description: Cached leaderboard rankings for volunteers
-- =================================================================
CREATE TABLE "LeaderboardCache" (
    "volunteerId" UUID PRIMARY KEY,
    "name" TEXT NOT NULL,
    "district" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "totalCoins" INTEGER NOT NULL DEFAULT 0,
    "totalScans" INTEGER NOT NULL DEFAULT 0,
    "avgRating" DECIMAL(3, 2) NOT NULL DEFAULT 0,
    "nationalRank" INTEGER,
    "stateRank" INTEGER,
    "districtRank" INTEGER,
    "lastUpdated" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE "LeaderboardCache" IS 'Cached leaderboard rankings for volunteers';

-- Indexes for LeaderboardCache table
CREATE INDEX "LeaderboardCache_totalCoins_idx" ON "LeaderboardCache"("totalCoins" DESC);
CREATE INDEX "LeaderboardCache_state_totalCoins_idx" ON "LeaderboardCache"("state", "totalCoins" DESC);
CREATE INDEX "LeaderboardCache_district_totalCoins_idx" ON "LeaderboardCache"("district", "totalCoins" DESC);

-- Foreign key constraint for LeaderboardCache
ALTER TABLE "LeaderboardCache" 
    ADD CONSTRAINT "LeaderboardCache_volunteerId_fkey" 
    FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE CASCADE;

-- =================================================================
-- Table: DiseaseTreatment
-- Description: Stores disease treatment and prevention information
-- =================================================================
CREATE TABLE "DiseaseTreatment" (
    "id" TEXT PRIMARY KEY,
    "diseaseName" TEXT NOT NULL,
    "cropType" TEXT NOT NULL,
    "quickFix" TEXT NOT NULL,
    "permanentFix" TEXT NOT NULL,
    "severityGuide" TEXT,
    "pesticideName" TEXT,
    "organicFix" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE "DiseaseTreatment" IS 'Stores disease treatment and prevention information';

-- =================================================================
-- Table: DroneDevice
-- Description: Stores drone device registration information
-- =================================================================
CREATE TABLE "DroneDevice" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "deviceId" TEXT NOT NULL UNIQUE,
    "deviceToken" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "volunteerId" UUID
);

COMMENT ON TABLE "DroneDevice" IS 'Stores drone device registration information';

-- =================================================================
-- Table: SoilDevice
-- Description: Stores soil sensor device registration information
-- =================================================================
CREATE TABLE "SoilDevice" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "deviceId" TEXT NOT NULL UNIQUE,
    "deviceToken" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "volunteerId" UUID
);

COMMENT ON TABLE "SoilDevice" IS 'Stores soil sensor device registration information';

-- =================================================================
-- Row Level Security (RLS) Policies
-- =================================================================

-- Enable RLS on all tables
ALTER TABLE "Farmer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Volunteer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Scan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SoilReading" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CoinTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Redemption" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeaderboardCache" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DiseaseTreatment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DroneDevice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SoilDevice" ENABLE ROW LEVEL SECURITY;

-- =================================================================
-- Trigger Function: Update updatedAt timestamp
-- =================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to Farmer table
CREATE TRIGGER update_farmer_updated_at
    BEFORE UPDATE ON "Farmer"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- Initial Data: Sample Disease Treatments
-- =================================================================
INSERT INTO "DiseaseTreatment" ("id", "diseaseName", "cropType", "quickFix", "permanentFix", "severityGuide", "pesticideName", "organicFix") VALUES
('disease-001', 'Rice Blast', 'Rice', 'Apply fungicide immediately and remove infected leaves', 'Use resistant varieties, maintain proper spacing, avoid excess nitrogen, apply preventive fungicides', 'High - Can cause 30-50% yield loss', 'Tricyclazole or Isoprothiolane', 'Neem oil spray, cow dung extract'),
('disease-002', 'Wheat Rust', 'Wheat', 'Apply fungicide spray immediately', 'Grow resistant varieties, early sowing, balanced fertilization', 'High - Major wheat disease worldwide', 'Propiconazole or Tebuconazole', 'Garlic extract, compost tea'),
('disease-003', 'Tomato Blight', 'Tomato', 'Remove infected plants, apply copper-based fungicide', 'Crop rotation, proper spacing, avoid overhead irrigation, use resistant varieties', 'Medium-High - Can devastate tomato crops', 'Copper oxychloride or Mancozeb', 'Baking soda spray, neem oil');

-- =================================================================
-- Setup Complete!
-- =================================================================
-- To run this SQL file:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Create a "New Query"
-- 4. Copy and paste this entire file
-- 5. Click "Run"
-- =================================================================
