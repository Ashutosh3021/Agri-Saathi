import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Clear existing data (optional - be careful in production)
  await prisma.$transaction([
    prisma.leaderboardCache.deleteMany(),
    prisma.coinTransaction.deleteMany(),
    prisma.redemption.deleteMany(),
    prisma.soilReading.deleteMany(),
    prisma.scan.deleteMany(),
    prisma.volunteer.deleteMany(),
    prisma.farmer.deleteMany(),
    prisma.diseaseTreatment.deleteMany(),
  ])

  console.log('Creating disease treatments...')
  
  // Create Disease Treatments
  const diseases = await prisma.$transaction([
    prisma.diseaseTreatment.create({
      data: {
        id: 'TLB_001',
        diseaseName: 'Tomato Late Blight',
        cropType: 'Tomato',
        quickFix: 'Prabhaavit pattiyaan hata dein aur jala dein. Bakhar daaru ka chhidkaav karein.',
        permanentFix: 'Mancozeb ya Chlorothalonil ka upayog karein. Proper drainage banayein aur beejon ko Bavistin se treat karein.',
        severityGuide: 'High - Quick action needed',
        pesticideName: 'Mancozeb 75% WP',
        organicFix: 'Neem ark ka chhidkaav karein. Gobar ki khaad upayog karein.',
      }
    }),
    prisma.diseaseTreatment.create({
      data: {
        id: 'RB_001',
        diseaseName: 'Rice Blast',
        cropType: 'Rice',
        quickFix: 'Prabhaavit paudhe hata dein. Paani nikaal dein aur Tricyclazole chhidkein.',
        permanentFix: 'Resistant varieties lagayein. Seed treatment with Carbendazim. Balanced fertilization rakhein.',
        severityGuide: 'Very High - Epidemic potential',
        pesticideName: 'Tricyclazole 75% WP',
        organicFix: 'Bij ke upachaar ke liye gomutra ark ka upayog karein.',
      }
    }),
    prisma.diseaseTreatment.create({
      data: {
        id: 'WR_001',
        diseaseName: 'Wheat Rust',
        cropType: 'Wheat',
        quickFix: 'Dhaani fungas udaan rokne ke liye Propiconazole lagayein.',
        permanentFix: 'Rust-resistant beej varieties lagayein. Early sowing karein aur Timely fungicide spray karein.',
        severityGuide: 'High - Yield loss up to 40%',
        pesticideName: 'Propiconazole 25% EC',
        organicFix: 'Compost tea spray karein aur biodiversity badhayein.',
      }
    }),
    prisma.diseaseTreatment.create({
      data: {
        id: 'CLB_001',
        diseaseName: 'Corn Leaf Blight',
        cropType: 'Corn',
        quickFix: 'Prabhaavit pattiyaan kaat dein. Mancozeb spray karein.',
        permanentFix: 'Rotating crops karein. Resistant varieties lagayein aur beej ko Thiram se treat karein.',
        severityGuide: 'Medium to High',
        pesticideName: 'Mancozeb 75% WP',
        organicFix: 'Biodiversity promotion aur crop rotation.',
      }
    }),
    prisma.diseaseTreatment.create({
      data: {
        id: 'CBW_001',
        diseaseName: 'Cotton Bollworm',
        cropType: 'Cotton',
        quickFix: 'Keede ko haath se pakadkar hata dein. NPV spray karein.',
        permanentFix: 'Bt cotton varieties lagayein. Pheromone traps lagayein. IPM practices adopt karein.',
        severityGuide: 'Very High - Major pest',
        pesticideName: 'Chlorpyriphos 20% EC',
        organicFix: 'Neem seed kernel extract spray karein.',
      }
    }),
    prisma.diseaseTreatment.create({
      data: {
        id: 'TLM_001',
        diseaseName: 'Tomato Leaf Mold',
        cropType: 'Tomato',
        quickFix: 'Hawa ka sanchar badhayein. Copper oxychloride spray karein.',
        permanentFix: 'Resistant varieties lagayein. Humidity control karein. Proper spacing rakhein.',
        severityGuide: 'Medium',
        pesticideName: 'Copper Oxychloride 50% WP',
        organicFix: 'Baking soda spray karein (1 tbsp per litre pani mein).',
      }
    }),
    prisma.diseaseTreatment.create({
      data: {
        id: 'RBS_001',
        diseaseName: 'Rice Brown Spot',
        cropType: 'Rice',
        quickFix: 'Mancozeb ya Carbendazim spray karein. Proper nutrition dein.',
        permanentFix: 'Balanced fertilization karein. Potash ki kami door karein. Resistant varieties lagayein.',
        severityGuide: 'Medium - Can cause significant loss',
        pesticideName: 'Carbendazim 50% WP',
        organicFix: 'Panchgavya ka upayog karein.',
      }
    }),
    prisma.diseaseTreatment.create({
      data: {
        id: 'WPM_001',
        diseaseName: 'Wheat Powdery Mildew',
        cropType: 'Wheat',
        quickFix: 'Sulfur based fungicide lagayein. Paani ka chhidkaav kam karein.',
        permanentFix: 'Resistant varieties lagayein. Proper spacing aur ventilation rakhein.',
        severityGuide: 'Medium',
        pesticideName: 'Sulfur 80% WP',
        organicFix: 'Neem oil spray karein (1% concentration).',
      }
    }),
    prisma.diseaseTreatment.create({
      data: {
        id: 'PEB_001',
        diseaseName: 'Potato Early Blight',
        cropType: 'Potato',
        quickFix: 'Prabhaavit pattiyaan hata dein. Mancozeb spray karein.',
        permanentFix: 'Crop rotation karein. Resistant varieties lagayein. Timely fungicide application.',
        severityGuide: 'Medium to High',
        pesticideName: 'Mancozeb 75% WP',
        organicFix: 'Compost tea aur neem based products ka upayog karein.',
      }
    }),
    prisma.diseaseTreatment.create({
      data: {
        id: 'SRR_001',
        diseaseName: 'Sugarcane Red Rot',
        cropType: 'Sugarcane',
        quickFix: 'Prabhaavit sette hata dein aur jala dein. Carbendazim se treat karein.',
        permanentFix: 'Disease-free sette lagayein. Resistant varieties lagayein. Field sanitation rakhein.',
        severityGuide: 'Very High - Can destroy entire crop',
        pesticideName: 'Carbendazim 50% WP',
        organicFix: 'Trichoderma viride ka upayog karein.',
      }
    }),
  ])

  console.log(`Created ${diseases.length} disease treatments`)

  // Create Farmers
  console.log('Creating farmers...')
  const farmers = await prisma.$transaction([
    prisma.farmer.create({
      data: {
        id: 'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
        phone: '919876543210',
        name: 'Ram Prasad',
        location: 'Gopalpur',
        district: 'Ahmednagar',
        state: 'Maharashtra',
        lat: 19.0948,
        lng: 74.7480,
      }
    }),
    prisma.farmer.create({
      data: {
        id: 'f2b3c4d5-e6f7-8901-bcde-f23456789012',
        phone: '919876543211',
        name: 'Balwinder Singh',
        location: 'Ludhiana Rural',
        district: 'Ludhiana',
        state: 'Punjab',
        lat: 30.9010,
        lng: 75.8573,
      }
    }),
    prisma.farmer.create({
      data: {
        id: 'f3c4d5e6-f7g8-9012-cdef-345678901234',
        phone: '919876543212',
        name: 'Muthu Lakshmi',
        location: 'Thanjavur',
        district: 'Thanjavur',
        state: 'Tamil Nadu',
        lat: 10.7860,
        lng: 79.1378,
      }
    }),
    prisma.farmer.create({
      data: {
        id: 'f4d5e6f7-g8h9-0123-defa-456789012345',
        phone: '919876543213',
        name: 'Ganesh Patil',
        location: 'Nashik Rural',
        district: 'Nashik',
        state: 'Maharashtra',
        lat: 19.9975,
        lng: 73.7898,
      }
    }),
    prisma.farmer.create({
      data: {
        id: 'f5e6f7g8-h9i0-1234-efab-567890123456',
        phone: '919876543214',
        name: 'Harpreet Kaur',
        location: 'Amritsar Rural',
        district: 'Amritsar',
        state: 'Punjab',
        lat: 31.6340,
        lng: 74.8723,
      }
    }),
  ])

  console.log(`Created ${farmers.length} farmers`)

  // Create Volunteers
  console.log('Creating volunteers...')
  const volunteers = await prisma.$transaction([
    prisma.volunteer.create({
      data: {
        id: 'v1a2b3c4-d5e6-7890-abcd-ef1234567890',
        userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Amit Deshmukh',
        phone: '919998877660',
        district: 'Ahmednagar',
        state: 'Maharashtra',
        totalCoins: 1250,
        totalScans: 45,
        avgRating: 4.50,
      }
    }),
    prisma.volunteer.create({
      data: {
        id: 'v2b3c4d5-e6f7-8901-bcde-f23456789012',
        userId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
        name: 'Priya Sharma',
        phone: '919998877661',
        district: 'Pune',
        state: 'Maharashtra',
        totalCoins: 980,
        totalScans: 32,
        avgRating: 4.20,
      }
    }),
    prisma.volunteer.create({
      data: {
        id: 'v3c4d5e6-f7g8-9012-cdef-345678901234',
        userId: 'c3d4e5f6-g7h8-9012-cdef-345678901234',
        name: 'Rajesh Kumar',
        phone: '919998877662',
        district: 'Ludhiana',
        state: 'Punjab',
        totalCoins: 1560,
        totalScans: 52,
        avgRating: 4.80,
      }
    }),
    prisma.volunteer.create({
      data: {
        id: 'v4d5e6f7-g8h9-0123-defa-456789012345',
        userId: 'd4e5f6g7-h8i9-0123-defa-456789012345',
        name: 'Simran Kaur',
        phone: '919998877663',
        district: 'Jalandhar',
        state: 'Punjab',
        totalCoins: 750,
        totalScans: 25,
        avgRating: 4.00,
      }
    }),
    prisma.volunteer.create({
      data: {
        id: 'v5e6f7g8-h9i0-1234-efab-567890123456',
        userId: 'e5f6g7h8-i9j0-1234-efab-567890123456',
        name: 'Karthik Subramanian',
        phone: '919998877664',
        district: 'Thanjavur',
        state: 'Tamil Nadu',
        totalCoins: 1100,
        totalScans: 38,
        avgRating: 4.40,
      }
    }),
    prisma.volunteer.create({
      data: {
        id: 'v6f7g8h9-i0j1-2345-fabc-678901234567',
        userId: 'f6g7h8i9-j0k1-2345-fabc-678901234567',
        name: 'Lakshmi Narayanan',
        phone: '919998877665',
        district: 'Madurai',
        state: 'Tamil Nadu',
        totalCoins: 620,
        totalScans: 20,
        avgRating: 3.90,
      }
    }),
    prisma.volunteer.create({
      data: {
        id: 'v7g8h9i0-j1k2-3456-abcd-789012345678',
        userId: 'g7h8i9j0-k1l2-3456-abcd-789012345678',
        name: 'Vikram Patil',
        phone: '919998877666',
        district: 'Nashik',
        state: 'Maharashtra',
        totalCoins: 890,
        totalScans: 29,
        avgRating: 4.30,
      }
    }),
    prisma.volunteer.create({
      data: {
        id: 'v8h9i0j1-k2l3-4567-bcde-890123456789',
        userId: 'h8i9j0k1-l2m3-4567-bcde-890123456789',
        name: 'Gurpreet Singh',
        phone: '919998877667',
        district: 'Amritsar',
        state: 'Punjab',
        totalCoins: 1340,
        totalScans: 47,
        avgRating: 4.60,
      }
    }),
    prisma.volunteer.create({
      data: {
        id: 'v9i0j1k2-l3m4-5678-cdef-901234567890',
        userId: 'i9j0k1l2-m3n4-5678-cdef-901234567890',
        name: 'Ananya Iyer',
        phone: '919998877668',
        district: 'Coimbatore',
        state: 'Tamil Nadu',
        totalCoins: 540,
        totalScans: 18,
        avgRating: 4.10,
      }
    }),
    prisma.volunteer.create({
      data: {
        id: 'v0j1k2l3-m4n5-6789-defa-012345678901',
        userId: 'j0k1l2m3-n4o5-6789-defa-012345678901',
        name: 'Suresh Jadhav',
        phone: '919998877669',
        district: 'Sangli',
        state: 'Maharashtra',
        totalCoins: 780,
        totalScans: 26,
        avgRating: 4.00,
      }
    }),
  ])

  console.log(`Created ${volunteers.length} volunteers`)

  // Create Scans
  console.log('Creating scans...')
  const scans = await prisma.$transaction([
    prisma.scan.create({
      data: {
        farmerId: farmers[0].id,
        volunteerId: volunteers[0].id,
        scanType: 'drone',
        imageUrl: 'https://example.com/scan1.jpg',
        diseaseDetected: 'Tomato Late Blight',
        confidence: 0.9423,
        cropType: 'Tomato',
        quickFix: 'Prabhaavit pattiyaan hata dein aur jala dein.',
        permanentFix: 'Mancozeb ya Chlorothalonil ka upayog karein.',
        severity: 'high',
        farmerRating: 5,
        coinsAwarded: 80,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[1].id,
        volunteerId: volunteers[2].id,
        scanType: 'whatsapp',
        imageUrl: 'https://example.com/scan2.jpg',
        diseaseDetected: 'Rice Blast',
        confidence: 0.8891,
        cropType: 'Rice',
        quickFix: 'Prabhaavit paudhe hata dein.',
        permanentFix: 'Resistant varieties lagayein.',
        severity: 'high',
        farmerRating: 4,
        coinsAwarded: 50,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[2].id,
        volunteerId: volunteers[4].id,
        scanType: 'soil_device',
        diseaseDetected: null,
        confidence: null,
        cropType: null,
        coinsAwarded: 60,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[3].id,
        volunteerId: volunteers[6].id,
        scanType: 'drone',
        imageUrl: 'https://example.com/scan4.jpg',
        diseaseDetected: 'Wheat Rust',
        confidence: 0.9123,
        cropType: 'Wheat',
        quickFix: 'Dhaani fungas udaan rokne ke liye spray karein.',
        permanentFix: 'Rust-resistant beej varieties lagayein.',
        severity: 'high',
        farmerRating: 5,
        coinsAwarded: 80,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[4].id,
        volunteerId: volunteers[3].id,
        scanType: 'whatsapp',
        imageUrl: 'https://example.com/scan5.jpg',
        diseaseDetected: 'Cotton Bollworm',
        confidence: 0.8734,
        cropType: 'Cotton',
        quickFix: 'Keede ko haath se pakadkar hata dein.',
        permanentFix: 'Bt cotton varieties lagayein.',
        severity: 'high',
        farmerRating: 3,
        coinsAwarded: 50,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[0].id,
        volunteerId: volunteers[1].id,
        scanType: 'drone',
        imageUrl: 'https://example.com/scan6.jpg',
        diseaseDetected: 'Tomato Leaf Mold',
        confidence: 0.8567,
        cropType: 'Tomato',
        quickFix: 'Hawa ka sanchar badhayein.',
        permanentFix: 'Resistant varieties lagayein.',
        severity: 'medium',
        farmerRating: 4,
        coinsAwarded: 80,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[1].id,
        volunteerId: volunteers[7].id,
        scanType: 'whatsapp',
        imageUrl: 'https://example.com/scan7.jpg',
        diseaseDetected: 'Rice Brown Spot',
        confidence: 0.9012,
        cropType: 'Rice',
        quickFix: 'Mancozeb spray karein.',
        permanentFix: 'Balanced fertilization karein.',
        severity: 'medium',
        farmerRating: 5,
        coinsAwarded: 50,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[2].id,
        volunteerId: volunteers[5].id,
        scanType: 'soil_device',
        diseaseDetected: null,
        confidence: null,
        coinsAwarded: 60,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[3].id,
        volunteerId: volunteers[8].id,
        scanType: 'drone',
        imageUrl: 'https://example.com/scan9.jpg',
        diseaseDetected: 'Corn Leaf Blight',
        confidence: 0.8345,
        cropType: 'Corn',
        quickFix: 'Prabhaavit pattiyaan kaat dein.',
        permanentFix: 'Rotating crops karein.',
        severity: 'medium',
        farmerRating: 4,
        coinsAwarded: 80,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[4].id,
        volunteerId: volunteers[9].id,
        scanType: 'whatsapp',
        imageUrl: 'https://example.com/scan10.jpg',
        diseaseDetected: 'Wheat Powdery Mildew',
        confidence: 0.8678,
        cropType: 'Wheat',
        quickFix: 'Sulfur based fungicide lagayein.',
        permanentFix: 'Resistant varieties lagayein.',
        severity: 'medium',
        farmerRating: 4,
        coinsAwarded: 50,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[0].id,
        volunteerId: volunteers[0].id,
        scanType: 'soil_device',
        diseaseDetected: null,
        confidence: null,
        coinsAwarded: 60,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[1].id,
        volunteerId: volunteers[2].id,
        scanType: 'drone',
        imageUrl: 'https://example.com/scan12.jpg',
        diseaseDetected: 'Potato Early Blight',
        confidence: 0.9234,
        cropType: 'Potato',
        quickFix: 'Prabhaavit pattiyaan hata dein.',
        permanentFix: 'Crop rotation karein.',
        severity: 'high',
        farmerRating: 5,
        coinsAwarded: 80,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[2].id,
        volunteerId: volunteers[4].id,
        scanType: 'whatsapp',
        imageUrl: 'https://example.com/scan13.jpg',
        diseaseDetected: 'Sugarcane Red Rot',
        confidence: 0.9456,
        cropType: 'Sugarcane',
        quickFix: 'Prabhaavit sette hata dein aur jala dein.',
        permanentFix: 'Disease-free sette lagayein.',
        severity: 'high',
        farmerRating: 5,
        coinsAwarded: 50,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[3].id,
        volunteerId: volunteers[6].id,
        scanType: 'soil_device',
        diseaseDetected: null,
        confidence: null,
        coinsAwarded: 60,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[4].id,
        volunteerId: volunteers[3].id,
        scanType: 'drone',
        imageUrl: 'https://example.com/scan15.jpg',
        diseaseDetected: 'Tomato Late Blight',
        confidence: 0.8912,
        cropType: 'Tomato',
        quickFix: 'Bakhar daaru ka chhidkaav karein.',
        permanentFix: 'Mancozeb ka upayog karein.',
        severity: 'high',
        farmerRating: 4,
        coinsAwarded: 80,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[0].id,
        volunteerId: volunteers[1].id,
        scanType: 'whatsapp',
        imageUrl: 'https://example.com/scan16.jpg',
        diseaseDetected: 'Rice Blast',
        confidence: 0.8789,
        cropType: 'Rice',
        quickFix: 'Tricyclazole chhidkein.',
        permanentFix: 'Resistant varieties lagayein.',
        severity: 'high',
        farmerRating: 5,
        coinsAwarded: 50,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[1].id,
        volunteerId: volunteers[7].id,
        scanType: 'soil_device',
        diseaseDetected: null,
        confidence: null,
        coinsAwarded: 60,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[2].id,
        volunteerId: volunteers[5].id,
        scanType: 'drone',
        imageUrl: 'https://example.com/scan18.jpg',
        diseaseDetected: 'Cotton Bollworm',
        confidence: 0.8567,
        cropType: 'Cotton',
        quickFix: 'NPV spray karein.',
        permanentFix: 'Bt cotton varieties lagayein.',
        severity: 'high',
        farmerRating: 3,
        coinsAwarded: 80,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[3].id,
        volunteerId: volunteers[8].id,
        scanType: 'whatsapp',
        imageUrl: 'https://example.com/scan19.jpg',
        diseaseDetected: 'Wheat Rust',
        confidence: 0.9234,
        cropType: 'Wheat',
        quickFix: 'Propiconazole lagayein.',
        permanentFix: 'Rust-resistant beej varieties lagayein.',
        severity: 'high',
        farmerRating: 5,
        coinsAwarded: 50,
      }
    }),
    prisma.scan.create({
      data: {
        farmerId: farmers[4].id,
        volunteerId: volunteers[9].id,
        scanType: 'soil_device',
        diseaseDetected: null,
        confidence: null,
        coinsAwarded: 60,
      }
    }),
  ])

  console.log(`Created ${scans.length} scans`)

  // Create Soil Readings
  console.log('Creating soil readings...')
  const soilReadings = await prisma.$transaction([
    prisma.soilReading.create({
      data: {
        farmerId: farmers[0].id,
        volunteerId: volunteers[0].id,
        deviceId: 'SOIL-001',
        nitrogen: 45.50,
        phosphorus: 23.75,
        potassium: 180.25,
        moisture: 35.50,
        temperature: 28.50,
        humidity: 65.00,
        ph: 6.80,
        rainfall: 120.00,
        selectedCrop: 'Tomato',
        recommendation: { crops: ['Tomato', 'Chili', 'Brinjal'], confidence: 0.89 },
        coinsAwarded: 60,
      }
    }),
    prisma.soilReading.create({
      data: {
        farmerId: farmers[1].id,
        volunteerId: volunteers[2].id,
        deviceId: 'SOIL-002',
        nitrogen: 52.30,
        phosphorus: 18.90,
        potassium: 165.40,
        moisture: 42.00,
        temperature: 26.80,
        humidity: 70.00,
        ph: 7.20,
        rainfall: 85.50,
        selectedCrop: 'Rice',
        recommendation: { crops: ['Rice', 'Wheat', 'Maize'], confidence: 0.92 },
        coinsAwarded: 60,
      }
    }),
    prisma.soilReading.create({
      data: {
        farmerId: farmers[2].id,
        volunteerId: volunteers[4].id,
        deviceId: 'SOIL-003',
        nitrogen: 38.75,
        phosphorus: 28.50,
        potassium: 195.60,
        moisture: 38.25,
        temperature: 29.20,
        humidity: 60.00,
        ph: 6.50,
        rainfall: 95.00,
        selectedCrop: 'Cotton',
        recommendation: { crops: ['Cotton', 'Groundnut', 'Soybean'], confidence: 0.87 },
        coinsAwarded: 60,
      }
    }),
    prisma.soilReading.create({
      data: {
        farmerId: farmers[3].id,
        volunteerId: volunteers[6].id,
        deviceId: 'SOIL-004',
        nitrogen: 41.20,
        phosphorus: 21.40,
        potassium: 175.80,
        moisture: 36.75,
        temperature: 27.90,
        humidity: 68.00,
        ph: 7.00,
        rainfall: 110.50,
        selectedCrop: 'Wheat',
        recommendation: { crops: ['Wheat', 'Barley', 'Mustard'], confidence: 0.91 },
        coinsAwarded: 60,
      }
    }),
    prisma.soilReading.create({
      data: {
        farmerId: farmers[4].id,
        volunteerId: volunteers[3].id,
        deviceId: 'SOIL-005',
        nitrogen: 48.90,
        phosphorus: 25.60,
        potassium: 188.30,
        moisture: 40.50,
        temperature: 28.10,
        humidity: 72.00,
        ph: 6.90,
        rainfall: 78.00,
        selectedCrop: 'Sugarcane',
        recommendation: { crops: ['Sugarcane', 'Maize', 'Cotton'], confidence: 0.88 },
        coinsAwarded: 60,
      }
    }),
    prisma.soilReading.create({
      data: {
        farmerId: farmers[0].id,
        volunteerId: volunteers[1].id,
        deviceId: 'SOIL-006',
        nitrogen: 44.60,
        phosphorus: 22.80,
        potassium: 182.40,
        moisture: 34.90,
        temperature: 29.50,
        humidity: 62.00,
        ph: 6.70,
        rainfall: 105.00,
        selectedCrop: 'Chili',
        recommendation: { crops: ['Chili', 'Tomato', 'Onion'], confidence: 0.85 },
        coinsAwarded: 60,
      }
    }),
    prisma.soilReading.create({
      data: {
        farmerId: farmers[1].id,
        volunteerId: volunteers[7].id,
        deviceId: 'SOIL-007',
        nitrogen: 51.80,
        phosphorus: 19.50,
        potassium: 168.90,
        moisture: 43.20,
        temperature: 26.50,
        humidity: 73.00,
        ph: 7.30,
        rainfall: 92.50,
        selectedCrop: 'Maize',
        recommendation: { crops: ['Maize', 'Rice', 'Wheat'], confidence: 0.90 },
        coinsAwarded: 60,
      }
    }),
    prisma.soilReading.create({
      data: {
        farmerId: farmers[2].id,
        volunteerId: volunteers[5].id,
        deviceId: 'SOIL-008',
        nitrogen: 37.90,
        phosphorus: 29.20,
        potassium: 198.70,
        moisture: 37.60,
        temperature: 30.10,
        humidity: 58.00,
        ph: 6.40,
        rainfall: 88.00,
        selectedCrop: 'Groundnut',
        recommendation: { crops: ['Groundnut', 'Cotton', 'Soybean'], confidence: 0.86 },
        coinsAwarded: 60,
      }
    }),
    prisma.soilReading.create({
      data: {
        farmerId: farmers[3].id,
        volunteerId: volunteers[8].id,
        deviceId: 'SOIL-009',
        nitrogen: 42.50,
        phosphorus: 20.70,
        potassium: 178.40,
        moisture: 35.80,
        temperature: 28.30,
        humidity: 66.00,
        ph: 6.95,
        rainfall: 115.00,
        selectedCrop: 'Barley',
        recommendation: { crops: ['Barley', 'Wheat', 'Mustard'], confidence: 0.89 },
        coinsAwarded: 60,
      }
    }),
    prisma.soilReading.create({
      data: {
        farmerId: farmers[4].id,
        volunteerId: volunteers[9].id,
        deviceId: 'SOIL-010',
        nitrogen: 47.30,
        phosphorus: 24.90,
        potassium: 186.50,
        moisture: 41.20,
        temperature: 27.80,
        humidity: 71.00,
        ph: 7.10,
        rainfall: 82.50,
        selectedCrop: 'Maize',
        recommendation: { crops: ['Maize', 'Sugarcane', 'Cotton'], confidence: 0.87 },
        coinsAwarded: 60,
      }
    }),
  ])

  console.log(`Created ${soilReadings.length} soil readings`)

  // Create Leaderboard Cache
  console.log('Creating leaderboard cache...')
  const leaderboardEntries = await prisma.$transaction([
    prisma.leaderboardCache.create({
      data: {
        volunteerId: volunteers[0].id,
        name: volunteers[0].name,
        district: volunteers[0].district || '',
        state: volunteers[0].state || '',
        totalCoins: volunteers[0].totalCoins,
        totalScans: volunteers[0].totalScans,
        avgRating: volunteers[0].avgRating,
        nationalRank: 3,
        stateRank: 1,
        districtRank: 1,
      }
    }),
    prisma.leaderboardCache.create({
      data: {
        volunteerId: volunteers[1].id,
        name: volunteers[1].name,
        district: volunteers[1].district || '',
        state: volunteers[1].state || '',
        totalCoins: volunteers[1].totalCoins,
        totalScans: volunteers[1].totalScans,
        avgRating: volunteers[1].avgRating,
        nationalRank: 5,
        stateRank: 2,
        districtRank: 1,
      }
    }),
    prisma.leaderboardCache.create({
      data: {
        volunteerId: volunteers[2].id,
        name: volunteers[2].name,
        district: volunteers[2].district || '',
        state: volunteers[2].state || '',
        totalCoins: volunteers[2].totalCoins,
        totalScans: volunteers[2].totalScans,
        avgRating: volunteers[2].avgRating,
        nationalRank: 1,
        stateRank: 1,
        districtRank: 1,
      }
    }),
    prisma.leaderboardCache.create({
      data: {
        volunteerId: volunteers[3].id,
        name: volunteers[3].name,
        district: volunteers[3].district || '',
        state: volunteers[3].state || '',
        totalCoins: volunteers[3].totalCoins,
        totalScans: volunteers[3].totalScans,
        avgRating: volunteers[3].avgRating,
        nationalRank: 9,
        stateRank: 3,
        districtRank: 1,
      }
    }),
    prisma.leaderboardCache.create({
      data: {
        volunteerId: volunteers[4].id,
        name: volunteers[4].name,
        district: volunteers[4].district || '',
        state: volunteers[4].state || '',
        totalCoins: volunteers[4].totalCoins,
        totalScans: volunteers[4].totalScans,
        avgRating: volunteers[4].avgRating,
        nationalRank: 4,
        stateRank: 1,
        districtRank: 1,
      }
    }),
    prisma.leaderboardCache.create({
      data: {
        volunteerId: volunteers[5].id,
        name: volunteers[5].name,
        district: volunteers[5].district || '',
        state: volunteers[5].state || '',
        totalCoins: volunteers[5].totalCoins,
        totalScans: volunteers[5].totalScans,
        avgRating: volunteers[5].avgRating,
        nationalRank: 10,
        stateRank: 3,
        districtRank: 1,
      }
    }),
    prisma.leaderboardCache.create({
      data: {
        volunteerId: volunteers[6].id,
        name: volunteers[6].name,
        district: volunteers[6].district || '',
        state: volunteers[6].state || '',
        totalCoins: volunteers[6].totalCoins,
        totalScans: volunteers[6].totalScans,
        avgRating: volunteers[6].avgRating,
        nationalRank: 6,
        stateRank: 3,
        districtRank: 1,
      }
    }),
    prisma.leaderboardCache.create({
      data: {
        volunteerId: volunteers[7].id,
        name: volunteers[7].name,
        district: volunteers[7].district || '',
        state: volunteers[7].state || '',
        totalCoins: volunteers[7].totalCoins,
        totalScans: volunteers[7].totalScans,
        avgRating: volunteers[7].avgRating,
        nationalRank: 2,
        stateRank: 2,
        districtRank: 1,
      }
    }),
    prisma.leaderboardCache.create({
      data: {
        volunteerId: volunteers[8].id,
        name: volunteers[8].name,
        district: volunteers[8].district || '',
        state: volunteers[8].state || '',
        totalCoins: volunteers[8].totalCoins,
        totalScans: volunteers[8].totalScans,
        avgRating: volunteers[8].avgRating,
        nationalRank: 8,
        stateRank: 2,
        districtRank: 1,
      }
    }),
    prisma.leaderboardCache.create({
      data: {
        volunteerId: volunteers[9].id,
        name: volunteers[9].name,
        district: volunteers[9].district || '',
        state: volunteers[9].state || '',
        totalCoins: volunteers[9].totalCoins,
        totalScans: volunteers[9].totalScans,
        avgRating: volunteers[9].avgRating,
        nationalRank: 7,
        stateRank: 4,
        districtRank: 1,
      }
    }),
  ])

  console.log(`Created ${leaderboardEntries.length} leaderboard entries`)

  // Create Coin Transactions for first 3 volunteers
  console.log('Creating coin transactions...')
  const transactions = await prisma.$transaction([
    // Volunteer 1 - Amit Deshmukh
    prisma.coinTransaction.create({
      data: {
        volunteerId: volunteers[0].id,
        amount: 80,
        transactionType: 'scan_complete',
        referenceId: scans[0].id,
        description: 'Drone scan completed - Tomato Late Blight detected',
        balanceAfter: 80,
      }
    }),
    prisma.coinTransaction.create({
      data: {
        volunteerId: volunteers[0].id,
        amount: 20,
        transactionType: 'rating_bonus',
        referenceId: scans[0].id,
        description: 'Bonus for 5-star rating',
        balanceAfter: 100,
      }
    }),
    prisma.coinTransaction.create({
      data: {
        volunteerId: volunteers[0].id,
        amount: 60,
        transactionType: 'scan_complete',
        referenceId: soilReadings[0].id,
        description: 'Soil scan completed',
        balanceAfter: 160,
      }
    }),
    prisma.coinTransaction.create({
      data: {
        volunteerId: volunteers[0].id,
        amount: 80,
        transactionType: 'scan_complete',
        referenceId: scans[10].id,
        description: 'Drone scan completed',
        balanceAfter: 240,
      }
    }),
    // Volunteer 2 - Priya Sharma
    prisma.coinTransaction.create({
      data: {
        volunteerId: volunteers[1].id,
        amount: 80,
        transactionType: 'scan_complete',
        referenceId: scans[5].id,
        description: 'Drone scan completed - Tomato Leaf Mold detected',
        balanceAfter: 80,
      }
    }),
    prisma.coinTransaction.create({
      data: {
        volunteerId: volunteers[1].id,
        amount: 10,
        transactionType: 'rating_bonus',
        referenceId: scans[5].id,
        description: 'Bonus for 4-star rating',
        balanceAfter: 90,
      }
    }),
    prisma.coinTransaction.create({
      data: {
        volunteerId: volunteers[1].id,
        amount: 50,
        transactionType: 'scan_complete',
        referenceId: scans[15].id,
        description: 'WhatsApp scan completed - Rice Blast detected',
        balanceAfter: 140,
      }
    }),
    prisma.coinTransaction.create({
      data: {
        volunteerId: volunteers[1].id,
        amount: 20,
        transactionType: 'rating_bonus',
        referenceId: scans[15].id,
        description: 'Bonus for 5-star rating',
        balanceAfter: 160,
      }
    }),
    // Volunteer 3 - Rajesh Kumar
    prisma.coinTransaction.create({
      data: {
        volunteerId: volunteers[2].id,
        amount: 50,
        transactionType: 'scan_complete',
        referenceId: scans[1].id,
        description: 'WhatsApp scan completed - Rice Blast detected',
        balanceAfter: 50,
      }
    }),
    prisma.coinTransaction.create({
      data: {
        volunteerId: volunteers[2].id,
        amount: 10,
        transactionType: 'rating_bonus',
        referenceId: scans[1].id,
        description: 'Bonus for 4-star rating',
        balanceAfter: 60,
      }
    }),
    prisma.coinTransaction.create({
      data: {
        volunteerId: volunteers[2].id,
        amount: 60,
        transactionType: 'scan_complete',
        referenceId: soilReadings[1].id,
        description: 'Soil scan completed',
        balanceAfter: 120,
      }
    }),
    prisma.coinTransaction.create({
      data: {
        volunteerId: volunteers[2].id,
        amount: 80,
        transactionType: 'scan_complete',
        referenceId: scans[11].id,
        description: 'Drone scan completed - Potato Early Blight detected',
        balanceAfter: 200,
      }
    }),
  ])

  console.log(`Created ${transactions.length} coin transactions`)

  console.log('✅ Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
