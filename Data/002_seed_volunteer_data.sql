-- =================================================================
-- Agri Sathi Volunteer Seed Data
-- =================================================================
-- This SQL file contains sample data for volunteers
-- Run this after creating tables to populate with test data
-- =================================================================

-- =================================================================
-- Insert Sample Volunteers
-- =================================================================
INSERT INTO "Volunteer" ("id", "userId", "name", "phone", "district", "state", "lat", "lng", "totalCoins", "totalScans", "avgRating", "isActive", "createdAt") VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Rahul Kumar', '+91-9876543210', 'Patna', 'Bihar', 25.5941, 85.1376, 1250, 45, 4.5, true, NOW() - INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Priya Singh', '+91-9876543211', 'Lucknow', 'Uttar Pradesh', 26.8467, 80.9462, 890, 32, 4.2, true, NOW() - INTERVAL '45 days'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Amit Patel', '+91-9876543212', 'Ahmedabad', 'Gujarat', 23.0225, 72.5714, 2100, 78, 4.8, true, NOW() - INTERVAL '60 days'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Sneha Reddy', '+91-9876543213', 'Hyderabad', 'Telangana', 17.3850, 78.4867, 650, 22, 4.0, true, NOW() - INTERVAL '20 days'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Vikram Sharma', '+91-9876543214', 'Jaipur', 'Rajasthan', 26.9124, 75.7873, 1750, 58, 4.6, true, NOW() - INTERVAL '50 days');

-- =================================================================
-- Insert Sample Farmers
-- =================================================================
INSERT INTO "Farmer" ("id", "phone", "name", "location", "district", "state", "lat", "lng", "language", "createdAt") VALUES
('660e8400-e29b-41d4-a716-446655440001', '+91-9876500001', 'Ram Prasad', 'Village A', 'Patna', 'Bihar', 25.6000, 85.1400, 'hi', NOW() - INTERVAL '40 days'),
('660e8400-e29b-41d4-a716-446655440002', '+91-9876500002', 'Sita Devi', 'Village B', 'Lucknow', 'Uttar Pradesh', 26.8500, 80.9500, 'hi', NOW() - INTERVAL '35 days'),
('660e8400-e29b-41d4-a716-446655440003', '+91-9876500003', 'Mohan Lal', 'Village C', 'Ahmedabad', 'Gujarat', 23.0300, 72.5800, 'gu', NOW() - INTERVAL '50 days'),
('660e8400-e29b-41d4-a716-446655440004', '+91-9876500004', 'Geeta Bai', 'Village D', 'Hyderabad', 'Telangana', 17.3900, 78.4900, 'te', NOW() - INTERVAL '25 days');

-- =================================================================
-- Insert Sample Scans
-- =================================================================
INSERT INTO "Scan" ("id", "farmerId", "volunteerId", "scanType", "imageUrl", "diseaseDetected", "confidence", "cropType", "quickFix", "permanentFix", "severity", "coinsAwarded", "farmerRating", "createdAt") VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'disease', 'https://example.com/scans/scan1.jpg', 'Rice Blast', 0.9456, 'Rice', 'Apply fungicide immediately', 'Use resistant varieties', 'High', 25, 5, NOW() - INTERVAL '2 days'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'disease', 'https://example.com/scans/scan2.jpg', 'Brown Spot', 0.8234, 'Rice', 'Remove infected leaves', 'Balanced fertilization', 'Medium', 20, 4, NOW() - INTERVAL '5 days'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'disease', 'https://example.com/scans/scan3.jpg', 'Wheat Rust', 0.9123, 'Wheat', 'Apply fungicide spray', 'Grow resistant varieties', 'High', 25, 5, NOW() - INTERVAL '1 day'),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'disease', 'https://example.com/scans/scan4.jpg', 'Tomato Blight', 0.8876, 'Tomato', 'Apply copper-based fungicide', 'Crop rotation', 'Medium', 20, 4, NOW() - INTERVAL '3 days'),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'disease', 'https://example.com/scans/scan5.jpg', 'Bacterial Wilt', 0.7654, 'Brinjal', 'Remove infected plants', 'Soil treatment', 'Low', 15, 3, NOW());

-- =================================================================
-- Insert Sample Coin Transactions
-- =================================================================
INSERT INTO "CoinTransaction" ("id", "volunteerId", "amount", "transactionType", "referenceId", "description", "balanceAfter", "createdAt") VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 25, 'scan_completed', '770e8400-e29b-41d4-a716-446655440001', 'Scan completed for rice disease', 1250, NOW() - INTERVAL '2 days'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 20, 'scan_completed', '770e8400-e29b-41d4-a716-446655440002', 'Scan completed for rice disease', 1225, NOW() - INTERVAL '5 days'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 25, 'scan_completed', '770e8400-e29b-41d4-a716-446655440003', 'Scan completed for wheat disease', 890, NOW() - INTERVAL '1 day'),
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 20, 'scan_completed', '770e8400-e29b-41d4-a716-446655440004', 'Scan completed for tomato disease', 2100, NOW() - INTERVAL '3 days'),
('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 15, 'scan_completed', '770e8400-e29b-41d4-a716-446655440005', 'Scan completed for brinjal disease', 650, NOW());

-- =================================================================
-- Insert Sample Leaderboard Cache
-- =================================================================
INSERT INTO "LeaderboardCache" ("volunteerId", "name", "district", "state", "totalCoins", "totalScans", "avgRating", "nationalRank", "stateRank", "districtRank", "lastUpdated") VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Rahul Kumar', 'Patna', 'Bihar', 1250, 45, 4.5, 3, 1, 1, NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Priya Singh', 'Lucknow', 'Uttar Pradesh', 890, 32, 4.2, 5, 1, 1, NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Amit Patel', 'Ahmedabad', 'Gujarat', 2100, 78, 4.8, 1, 1, 1, NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Sneha Reddy', 'Hyderabad', 'Telangana', 650, 22, 4.0, 8, 2, 1, NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Vikram Sharma', 'Jaipur', 'Rajasthan', 1750, 58, 4.6, 2, 1, 1, NOW());

-- =================================================================
-- Insert Sample Devices
-- =================================================================
INSERT INTO "DroneDevice" ("id", "deviceId", "deviceToken", "name", "isActive", "lastUsedAt", "createdAt", "volunteerId") VALUES
('990e8400-e29b-41d4-a716-446655440001', 'DRONE-001', 'token-drone-001-xyz123', 'Agriculture Drone 1', true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '30 days', '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440002', 'DRONE-002', 'token-drone-002-abc456', 'Agriculture Drone 2', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '45 days', '550e8400-e29b-41d4-a716-446655440003');

INSERT INTO "SoilDevice" ("id", "deviceId", "deviceToken", "name", "isActive", "lastUsedAt", "createdAt", "volunteerId") VALUES
('990e8400-e29b-41d4-a716-446655440003', 'SOIL-001', 'token-soil-001-xyz789', 'Soil Sensor 1', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '30 days', '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440004', 'SOIL-002', 'token-soil-002-abc012', 'Soil Sensor 2', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '45 days', '550e8400-e29b-41d4-a716-446655440002');

-- =================================================================
-- Insert Sample Soil Readings
-- =================================================================
INSERT INTO "SoilReading" ("id", "farmerId", "volunteerId", "deviceId", "nitrogen", "phosphorus", "potassium", "moisture", "temperature", "humidity", "ph", "rainfall", "selectedCrop", "recommendation", "coinsAwarded", "createdAt") VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'SOIL-001', 45.50, 32.20, 180.00, 45.50, 28.50, 65.00, 6.8, 120.00, 'Rice', '{"recommendation": "Increase nitrogen application", "fertilizer": "Urea - 50kg per acre"}'::jsonb, 30, NOW() - INTERVAL '1 day'),
('aa0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'SOIL-002', 52.30, 28.50, 195.00, 38.20, 31.00, 58.00, 7.2, 85.00, 'Wheat', '{"recommendation": "Add phosphorus fertilizer", "fertilizer": "DAP - 40kg per acre"}'::jsonb, 30, NOW() - INTERVAL '2 days');

-- =================================================================
-- Verification Query: Count records in each table
-- =================================================================
SELECT 'Volunteers' as table_name, COUNT(*) as record_count FROM "Volunteer"
UNION ALL
SELECT 'Farmers', COUNT(*) FROM "Farmer"
UNION ALL
SELECT 'Scans', COUNT(*) FROM "Scan"
UNION ALL
SELECT 'CoinTransactions', COUNT(*) FROM "CoinTransaction"
UNION ALL
SELECT 'LeaderboardCache', COUNT(*) FROM "LeaderboardCache"
UNION ALL
SELECT 'DroneDevices', COUNT(*) FROM "DroneDevice"
UNION ALL
SELECT 'SoilDevices', COUNT(*) FROM "SoilDevice"
UNION ALL
SELECT 'SoilReadings', COUNT(*) FROM "SoilReading"
ORDER BY table_name;

-- =================================================================
-- Seed Data Complete!
-- =================================================================
