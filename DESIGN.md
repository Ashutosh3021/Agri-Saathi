# 🎨 Agri Volunteer - Design Document

## Document Information
- **Project**: Agri Volunteer Platform
- **Version**: 1.0.0
- **Last Updated**: February 15, 2026
- **Status**: In Development

---

## 📋 Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [System Architecture](#system-architecture)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [Database Design](#database-design)
5. [Component Architecture](#component-architecture)
6. [UI/UX Design](#uiux-design)
7. [Security Architecture](#security-architecture)
8. [Deployment Architecture](#deployment-architecture)
9. [Integration Patterns](#integration-patterns)

---

## 1. Design Philosophy

### 1.1 Core Principles

```mermaid
graph TB
    subgraph "Design Principles"
        P1["🎯 Simplicity<br/>Zero friction for farmers"]
        P2["🌍 Accessibility<br/>Works on any phone"]
        P3["🤝 Community-First<br/>Local volunteers earn income"]
        P4["⚡ Performance<br/>Under 10 second response"]
        P5["🔒 Trust<br/>Transparent, reliable results"]
    end
    
    P1 --> UX["UX Design"]
    P2 --> TECH["Technology Choices"]
    P3 --> ECON["Economic Model"]
    P4 --> ARCH["Architecture"]
    P5 --> SEC["Security"]
```

### 1.2 User-Centric Design

```mermaid
mindmap
  root((Agri Volunteer<br/>User-Centric Design))
    Farmers
      WhatsApp Interface
        No downloads needed
        Works on 2G/3G
        Voice messages
        Image sharing
      Trust Factors
        Local language
        Expert validation
        Product recommendations
        Market prices
    Volunteers
      Income Opportunity
        Earn per scan
        Leaderboard recognition
        Flexible schedule
      Tools
        Mobile dashboard
        GPS navigation
        Offline capability
    Admins
      Real-time monitoring
        Live statistics
        Model health
        Quality control
      Data insights
        Heatmaps
        Trend analysis
        ROI tracking
```

---

## 2. System Architecture

### 2.1 High-Level Architecture

```mermaid
flowchart TB
    subgraph "Users"
        F["👨‍🌾 Farmer<br/>(WhatsApp)"]
        V["🤝 Volunteer<br/>(Mobile/Web)"]
        A["👨‍💼 Admin<br/>(Dashboard)"]
    end
    
    subgraph "Interface Layer"
        WA["WhatsApp Bot<br/>AiSensy/Interakt"]
        WEB["Next.js Web App<br/>Volunteer Dashboard"]
        ADMIN["Admin Panel<br/>Analytics & Management"]
    end
    
    subgraph "Application Layer"
        API["Next.js API Routes<br/>Business Logic"]
        ML["FastAPI ML Service<br/>Python + TensorFlow"]
        WEBHOOK["Webhook Handlers<br/>WhatsApp, IoT"]
    end
    
    subgraph "Data Layer"
        DB["(Supabase PostgreSQL)<br/>Primary Database"]
        STORAGE["(Supabase Storage)<br/>Images & Files"]
        CACHE["(Redis)<br/>Session & Cache"]
        RT["(Supabase Realtime)<br/>Live Updates"]
    end
    
    subgraph "ML Models"
        PEST["🐛 Pest Detection<br/>MobileNetV2<br/>91.2% accuracy"]
        SOIL["🌱 Soil Analysis<br/>XGBoost<br/>98.7% accuracy"]
    end
    
    subgraph "External APIs"
        AG["Agmarknet API<br/>Mandi Prices"]
        OW["OpenWeather API<br/>Weather Data"]
        PAY["Payment Gateway<br/>UPI/Paytm/Bank"]
    end
    
    F --> WA
    V --> WEB
    A --> ADMIN
    
    WA --> WEBHOOK
    WEB --> API
    ADMIN --> API
    
    API --> DB
    API --> STORAGE
    API --> CACHE
    API --> RT
    
    WEBHOOK --> API
    API --> ML
    
    ML --> PEST
    ML --> SOIL
    
    API --> AG
    API --> OW
    API --> PAY
    
    style F fill:#16a34a,color:#fff
    style V fill:#f59e0b,color:#fff
    style A fill:#6366f1,color:#fff
    style DB fill:#3ECF8E,color:#fff
    style PEST fill:#3b82f6,color:#fff
    style SOIL fill:#10b981,color:#fff
```

### 2.2 Microservices Architecture

```mermaid
graph TB
    subgraph "API Gateway<br/>Next.js"
        AUTH["Authentication<br/>Middleware"]
        RATE["Rate Limiter"]
        ROUTE["Request Router"]
    end
    
    subgraph "Core Services"
        USER["User Service<br/>Farmers & Volunteers"]
        SCAN["Scan Service<br/>Disease Detection"]
        SOIL["Soil Service<br/>NPK Analysis"]
        COIN["Coin Service<br/>Economy Engine"]
        NOTIF["Notification Service<br/>SMS, Email, WhatsApp"]
    end
    
    subgraph "ML Services"
        ML_PEST["Pest ML Service<br/>Port 8001"]
        ML_SOIL["Soil ML Service<br/>Port 8002"]
    end
    
    subgraph "Data Stores"
        DB_USER[(Users DB)]
        DB_SCAN[(Scans DB)]
        DB_COIN[(Coins DB)]
        REDIS[(Redis Cache)]
    end
    
    AUTH --> RATE --> ROUTE
    
    ROUTE --> USER
    ROUTE --> SCAN
    ROUTE --> SOIL
    ROUTE --> COIN
    ROUTE --> NOTIF
    
    SCAN --> ML_PEST
    SOIL --> ML_SOIL
    
    USER --> DB_USER
    SCAN --> DB_SCAN
    SOIL --> DB_SCAN
    COIN --> DB_COIN
    
    USER --> REDIS
    SCAN --> REDIS
    COIN --> REDIS
```

### 2.3 Layered Architecture

```mermaid
graph LR
    subgraph "Presentation Layer"
        UI1["WhatsApp UI"]
        UI2["Web Dashboard"]
        UI3["Mobile Responsive"]
    end
    
    subgraph "Application Layer"
        APP1["API Controllers"]
        APP2["Business Logic"]
        APP3["Webhook Handlers"]
    end
    
    subgraph "Service Layer"
        SVC1["Authentication"]
        SVC2["ML Inference"]
        SVC3["Payment Processing"]
        SVC4["Notification"]
    end
    
    subgraph "Data Access Layer"
        DAO1["Prisma ORM"]
        DAO2["Supabase Client"]
        DAO3["Storage Client"]
    end
    
    subgraph "Infrastructure Layer"
        INF1["Database"]
        INF2["File Storage"]
        INF3["Cache"]
        INF4["ML Models"]
    end
    
    UI1 --> APP1
    UI2 --> APP1
    UI3 --> APP1
    
    APP1 --> APP2
    APP2 --> SVC1
    APP2 --> SVC2
    APP2 --> SVC3
    APP2 --> SVC4
    
    SVC1 --> DAO1
    SVC2 --> DAO2
    SVC3 --> DAO2
    SVC4 --> DAO2
    
    DAO1 --> INF1
    DAO2 --> INF1
    DAO3 --> INF2
    DAO2 --> INF3
    SVC2 --> INF4
```

---

## 3. Data Flow Diagrams

### 3.1 Farmer Disease Detection Flow

```mermaid
sequenceDiagram
    autonumber
    actor F as 👨‍🌾 Farmer
    participant WA as WhatsApp
    participant WH as Webhook Handler
    participant S3 as Image Storage
    participant ML as ML Service
    participant DB as Database
    participant PROD as Product Lookup
    participant SMS as SMS/WhatsApp

    F->>WA: Sends crop photo
    WA->>WH: POST webhook with media_id
    activate WH
    
    WH->>WH: Validate phone number
    WH->>WH: Get or create farmer record
    
    WH->>WA: GET image by media_id
    WA-->>WH: Return image binary
    
    WH->>S3: Upload image
    S3-->>WH: Return public URL
    
    WH->>ML: POST /predict/pest {image_url}
    activate ML
    ML->>ML: Preprocess: resize 224x224
    ML->>ML: Normalize pixel values
    ML->>ML: MobileNetV2 inference
    ML-->>WH: {disease, confidence, fixes}
    deactivate ML
    
    WH->>DB: Save scan record
    
    WH->>PROD: Get products for disease
    PROD-->>WH: Product recommendations
    
    WH->>SMS: Send diagnosis message
    SMS-->>F: "Your tomato has Late Blight (94% confidence)..."
    
    WH->>SMS: Send product list
    SMS-->>F: "Recommended: Copper Fungicide ₹180..."
    
    WH->>SMS: Send rating request
    SMS-->>F: "Rate this scan: ⭐⭐⭐⭐⭐"
    
    deactivate WH
    
    Note over F,SMS: Total time: 6-10 seconds
```

### 3.2 Volunteer Scanning & Coin Flow

```mermaid
sequenceDiagram
    autonumber
    actor V as 🤝 Volunteer
    participant APP as Mobile App
    participant API as API Gateway
    participant SCAN as Scan Service
    participant COIN as Coin Service
    participant DB as Database
    participant F as 👨‍🌾 Farmer

    V->>APP: Opens app, navigates to farm
    APP->>API: GET /api/farmer/{id}
    API->>DB: Fetch farmer details
    DB-->>API: Return farmer data
    API-->>APP: Display farmer info
    
    V->>APP: Takes crop photos
    APP->>API: POST /api/scan/upload
    API->>SCAN: Process images
    SCAN->>API: Return scan results
    
    alt Scan Successful
        API->>COIN: Award coins (10 coins)
        COIN->>DB: Create transaction
        COIN->>DB: Update volunteer balance
        COIN-->>API: Transaction confirmed
        API-->>APP: Show success + coins earned
        APP-->>V: "+10 coins earned!"
        
        API->>DB: Save scan record
        API->>F: Send results via WhatsApp
    else Scan Failed
        API-->>APP: Return error
        APP-->>V: Show error message
    end
    
    V->>APP: Views dashboard
    APP->>API: GET /api/volunteer/stats
    API->>DB: Fetch stats
    DB-->>API: Return stats
    API-->>APP: Display updated stats
    APP-->>V: Shows: Total coins, scans, rank
```

### 3.3 IoT Soil Sensor Flow

```mermaid
sequenceDiagram
    autonumber
    participant IOT as 🌱 IoT Device<br/>ESP32
    participant API as API Endpoint
    participant WEATHER as OpenWeather
    participant ML as ML Service
    participant DB as Database
    participant VOL as Volunteer App
    participant F as 👨‍🌾 Farmer

    IOT->>IOT: Read DHT22 sensors
    IOT->>IOT: Read NPK sensors (simulated)
    IOT->>IOT: Read moisture sensor
    
    IOT->>API: POST /api/soil/reading
    Note right of IOT: {N, P, K, moisture,<br/>temp, humidity, pH, crop}
    
    activate API
    API->>DB: Get farmer location (lat/lng)
    DB-->>API: Return coordinates
    
    API->>WEATHER: GET weather for location
    WEATHER-->>API: {temp, humidity, rainfall}
    
    API->>ML: POST /predict/soil
    Note right of API: Enriched data with weather
    
    activate ML
    ML->>ML: XGBoost inference
    ML-->>API: {recommended_crops, analysis}
    deactivate ML
    
    API->>DB: Save soil reading
    API->>DB: Award coins to volunteer
    
    API->>VOL: Return JSON response
    VOL->>IOT: Display on OLED screen
    
    API->>F: Send WhatsApp message
    Note left of F: "Soil Analysis Complete:<br/>N: 45, P: 32, K: 38<br/>Recommended: Rice, Wheat"
    
    deactivate API
```

### 3.4 Coin Redemption Flow

```mermaid
sequenceDiagram
    autonumber
    actor V as 🤝 Volunteer
    participant DASH as Dashboard
    participant API as API Gateway
    participant COIN as Coin Service
    participant DB as Database
    participant ADMIN as Admin Panel
    participant PAY as Payment Gateway

    V->>DASH: Navigate to Redeem
    DASH->>API: GET /api/volunteer/balance
    API->>DB: Fetch coin balance
    DB-->>API: Return balance: 1,240
    API-->>DASH: Display balance
    
    V->>DASH: Select redemption method
    DASH->>V: Show form (UPI/Paytm/Bank)
    
    V->>DASH: Enter amount (1,000 coins)
    DASH->>DASH: Validate amount >= 500
    DASH->>DASH: Calculate value: ₹100
    
    V->>DASH: Enter UPI ID
    V->>DASH: Submit redemption request
    
    DASH->>API: POST /api/redeem/create
    API->>COIN: Validate balance
    COIN->>DB: Check available coins
    DB-->>COIN: Balance: 1,240 ✓
    
    COIN->>DB: Create redemption record
    COIN->>DB: Deduct coins (pending)
    
    API-->>DASH: Return success
    DASH-->>V: Show "Pending approval"
    
    Note right of ADMIN: Admin reviews within 24h
    
    ADMIN->>API: GET /api/redeem/pending
    API->>DB: Fetch pending redemptions
    DB-->>API: Return list
    API-->>ADMIN: Display for review
    
    ADMIN->>API: POST /api/redeem/approve/{id}
    API->>COIN: Process payment
    COIN->>PAY: Initiate UPI transfer
    PAY-->>COIN: Payment successful
    
    COIN->>DB: Update redemption status
    COIN->>DB: Finalize coin deduction
    
    API->>V: Send confirmation email
    API-->>ADMIN: Success response
    
    V->>DASH: Views history
    DASH->>API: GET /api/redeem/history
    API-->>DASH: Return transactions
    DASH-->>V: Show completed redemption
```

---

## 4. Database Design

### 4.1 Entity Relationship Diagram

```mermaid
erDiagram
    FARMER ||--o{ SCAN : "submits"
    FARMER ||--o{ SOIL_READING : "requests"
    VOLUNTEER ||--o{ SCAN : "performs"
    VOLUNTEER ||--o{ SOIL_READING : "performs"
    VOLUNTEER ||--o{ COIN_TRANSACTION : "receives"
    VOLUNTEER ||--o{ REDEMPTION : "requests"
    SCAN ||--|| RATING : "receives"
    SCAN ||--o{ SCAN_IMAGE : "contains"
    
    FARMER {
        uuid id PK
        string phone UK
        string name
        string district
        string state
        decimal lat
        decimal lng
        string language "default: hi"
        datetime created_at
        datetime updated_at
    }
    
    VOLUNTEER {
        uuid id PK
        string auth_user_id UK
        string email UK
        string name
        string phone UK
        string district
        string state
        string motivation
        int total_coins "default: 0"
        int total_scans "default: 0"
        decimal avg_rating "default: 0"
        boolean is_active "default: false"
        string status "default: pending"
        datetime last_login
        datetime created_at
        datetime updated_at
    }
    
    SCAN {
        uuid id PK
        uuid farmer_id FK
        uuid volunteer_id FK
        string type "enum: Drone, WhatsApp, Soil"
        string image_url
        string disease
        decimal confidence
        string result
        string quick_fix
        string permanent_fix
        int coins_earned
        string status "default: completed"
        datetime created_at
        datetime updated_at
    }
    
    SCAN_IMAGE {
        uuid id PK
        uuid scan_id FK
        string url
        string type "original/processed"
        datetime created_at
    }
    
    SOIL_READING {
        uuid id PK
        uuid farmer_id FK
        uuid volunteer_id FK
        float nitrogen
        float phosphorus
        float potassium
        float moisture
        float temperature
        float humidity
        float ph
        string selected_crop
        string recommended_crops
        string analysis
        string soil_health
        int coins_earned
        datetime created_at
    }
    
    COIN_TRANSACTION {
        uuid id PK
        uuid volunteer_id FK
        int amount
        string type "enum: earned, redeemed, bonus"
        string description
        uuid reference_id
        string reference_type
        datetime created_at
    }
    
    REDEMPTION {
        uuid id PK
        uuid volunteer_id FK
        int coins
        decimal amount
        string method "enum: upi, paytm, bank"
        string details
        string status "enum: pending, approved, rejected, completed"
        string transaction_id
        datetime processed_at
        datetime created_at
    }
    
    RATING {
        uuid id PK
        uuid scan_id FK
        int rating "1-5"
        string comment
        datetime created_at
    }
```

### 4.2 Database Schema Diagram

```mermaid
flowchart TB
    subgraph "Core Tables"
        T1["Farmers<br/>uuid, phone, name,<br/>district, state,<br/>lat, lng, lang"]
        T2["Volunteers<br/>uuid, email, name,<br/>phone, coins, scans,<br/>rating, status"]
    end
    
    subgraph "Activity Tables"
        T3["Scans<br/>uuid, farmer_id,<br/>volunteer_id, type,<br/>disease, confidence"]
        T4["SoilReadings<br/>uuid, farmer_id,<br/>volunteer_id, NPK,<br/>moisture, temp"]
    end
    
    subgraph "Economy Tables"
        T5["CoinTransactions<br/>uuid, volunteer_id,<br/>amount, type,<br/>description"]
        T6["Redemptions<br/>uuid, volunteer_id,<br/>coins, amount,<br/>method, status"]
    end
    
    subgraph "Metadata Tables"
        T7["Ratings<br/>uuid, scan_id,<br/>rating, comment"]
        T8["Products<br/>id, name, category,<br/>price, diseases"]
    end
    
    T1 --> T3
    T2 --> T3
    T1 --> T4
    T2 --> T4
    T2 --> T5
    T2 --> T6
    T3 --> T7
```

---

## 5. Component Architecture

### 5.1 Frontend Component Hierarchy

```mermaid
graph TD
    subgraph "App Root"
        A["Next.js App"]
    end
    
    subgraph "Layout Components"
        L1["DashboardLayout<br/>Sidebar + Header"]
        L2["AuthLayout<br/>Login/Register"]
        L3["LandingLayout<br/>Marketing pages"]
    end
    
    subgraph "Page Components"
        P1["DashboardPage<br/>Stats + Recent Scans"]
        P2["LeaderboardPage<br/>Rankings"]
        P3["ScansPage<br/>Scan history"]
        P4["RedeemPage<br/>Coin redemption"]
        P5["SettingsPage<br/>Profile + Config"]
    end
    
    subgraph "Shared Components"
        S1["Sidebar<br/>Navigation"]
        S2["Header<br/>User info"]
        S3["StatCard<br/>Metrics display"]
        S4["ScanCard<br/>Scan details"]
        S5["CoinWidget<br/>Balance display"]
    end
    
    subgraph "UI Components<br/>(shadcn/ui)"
        U1["Button"]
        U2["Input"]
        U3["Card"]
        U4["Dialog"]
        U5["Table"]
        U6["Tabs"]
    end
    
    A --> L1
    A --> L2
    A --> L3
    
    L1 --> P1
    L1 --> P2
    L1 --> P3
    L1 --> P4
    L1 --> P5
    
    L1 --> S1
    L1 --> S2
    
    P1 --> S3
    P1 --> S5
    P3 --> S4
    
    P1 --> U1
    P1 --> U3
    P2 --> U5
    P5 --> U6
```

### 5.2 Backend API Structure

```mermaid
graph LR
    subgraph "API Routes"
        API1["/api/auth/*<br/>Authentication"]
        API2["/api/volunteer/*<br/>Volunteer APIs"]
        API3["/api/farmer/*<br/>Farmer APIs"]
        API4["/api/scan/*<br/>Scan APIs"]
        API5["/api/soil/*<br/>Soil APIs"]
        API6["/api/whatsapp/*<br/>WhatsApp Webhook"]
        API7["/api/ml/*<br/>ML Proxy"]
    end
    
    subgraph "API Endpoints"
        E1["POST /login"]
        E2["GET /me"]
        E3["GET /leaderboard"]
        E4["POST /scan"]
        E5["POST /redeem"]
        E6["POST /webhook"]
        E7["POST /predict/pest"]
    end
    
    API1 --> E1
    API1 --> E2
    API2 --> E3
    API4 --> E4
    API2 --> E5
    API6 --> E6
    API7 --> E7
```

---

## 6. UI/UX Design

### 6.1 Design System

```mermaid
graph TB
    subgraph "Color Palette"
        C1["Primary: #d97706<br/>Amber"]
        C2["Accent: #ea580c<br/>Orange"]
        C3["Success: #16a34a<br/>Green"]
        C4["Error: #dc2626<br/>Red"]
        C5["Dark: #1a1a1a<br/>Background"]
        C6["Light: #f9fafb<br/>Surface"]
    end
    
    subgraph "Typography"
        T1["Font: Inter"]
        T2["Headings: 600 weight"]
        T3["Body: 400 weight"]
        T4["Small: 12px"]
    end
    
    subgraph "Components"
        COM1["Buttons<br/>Primary, Secondary, Ghost"]
        COM2["Cards<br/>Elevated, Outlined"]
        COM3["Inputs<br/>Text, Select, Date"]
        COM4["Feedback<br/>Toast, Alert, Progress"]
    end
    
    C1 --> COM1
    C2 --> COM1
    T1 --> COM1
    T1 --> COM2
    T1 --> COM3
```

### 6.2 Page Wireframes - Dashboard

```mermaid
graph TB
    subgraph "Dashboard Layout"
        direction LR
        
        SIDEBAR["Sidebar (260px)<br/>┌─────────────────┐<br/>│ 🤝 Logo         │<br/>│ ─────────────── │<br/>│ 👤 User Profile │<br/>│ ─────────────── │<br/>│ 📊 Dashboard    │<br/>│ 🏆 Leaderboard  │<br/>│ 📸 My Scans     │<br/>│ 💰 Redeem       │<br/>│ ⚙️ Settings     │<br/>│ ─────────────── │<br/>│ 💰 Coin Widget  │<br/>│ ─────────────── │<br/>│ 🚪 Logout       │<br/>└─────────────────┘"]
        
        MAIN["Main Content Area<br/>┌─────────────────────────────────────┐<br/>│ Welcome back! 👋         [Logout] │<br/>├─────────────────────────────────────┤<br/>│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │<br/>│ │Coins │ │Scans │ │ Rank │ │Rating│ │<br/>│ │ 1,240│ │  112 │ │  #8  │ │ 4.7★ │ │<br/>│ └──────┘ └──────┘ └──────┘ └──────┘ │<br/>├─────────────────────────────────────┤<br/>│ Recent Scans          │ Coin Mile  │<br/>│ ┌───────────────────┐ │ ┌────────┐ │<br/>│ │ 🟢 Drone          │ │ │ 1,240  │ │<br/>│ │ Patna, Bihar      │ │ │ ██████░│ │<br/>│ │ +80 coins ⭐⭐⭐⭐⭐ │ │ │ 260 more│ │
│ └───────────────────┘ │ └────────┘ │<br/>├─────────────────────────────────────┤<br/>│ Quick Actions                       │<br/>│ [📱 New Scan] [🚁 Drone] [💸 Redeem]│<br/>└─────────────────────────────────────┘"]
    end
    
    SIDEBAR --> MAIN
```

---

## 7. Security Architecture

### 7.1 Security Layers

```mermaid
flowchart TB
    subgraph "Security Architecture"
        L1["Layer 1: Network<br/>HTTPS/TLS 1.3<br/>WAF Protection"]
        L2["Layer 2: API Gateway<br/>Rate Limiting<br/>IP Whitelisting"]
        L3["Layer 3: Authentication<br/>JWT Tokens<br/>Session Management"]
        L4["Layer 4: Authorization<br/>RBAC<br/>Resource Permissions"]
        L5["Layer 5: Data<br/>Encryption at Rest<br/>Encryption in Transit"]
    end
    
    CLIENT["Client"] --> L1
    L1 --> L2
    L2 --> L3
    L3 --> L4
    L4 --> L5
    L5 --> DB[(Database)]
```

### 7.2 Authentication Flow

```mermaid
sequenceDiagram
    actor U as User
    participant C as Client
    participant API as API Gateway
    participant AUTH as Auth Service
    participant DB as Database

    U->>C: Enter credentials
    C->>API: POST /api/auth/login
    API->>AUTH: Validate credentials
    AUTH->>DB: Check user exists
    DB-->>AUTH: Return user hash
    AUTH->>AUTH: Verify password
    
    alt Valid Credentials
        AUTH->>AUTH: Generate JWT
        AUTH-->>API: Return {token, user}
        API-->>C: Set HTTP-only cookie
        C-->>U: Redirect to dashboard
    else Invalid Credentials
        AUTH-->>API: Error: Invalid credentials
        API-->>C: 401 Unauthorized
        C-->>U: Show error message
    end
```

---

## 8. Deployment Architecture

### 8.1 Production Deployment

```mermaid
graph TB
    subgraph "CDN Layer"
        CF["Cloudflare<br/>DDoS Protection<br/>CDN Caching"]
    end
    
    subgraph "Frontend<br/>Vercel Edge Network"
        FE1["Edge Node<br/>Asia-Pacific"]
        FE2["Edge Node<br/>Europe"]
        FE3["Edge Node<br/>US East"]
    end
    
    subgraph "API Layer<br/>Vercel Serverless"
        API["Next.js API<br/>Serverless Functions"]
    end
    
    subgraph "ML Service<br/>Railway/DigitalOcean"
        ML1["ML Instance 1<br/>GPU Enabled"]
        ML2["ML Instance 2<br/>GPU Enabled"]
        LB["Load Balancer"]
    end
    
    subgraph "Database Layer<br/>Supabase"
        DB1["Primary DB<br/>PostgreSQL"]
        DB2["Read Replica<br/>PostgreSQL"]
        STORAGE["Object Storage<br/>Images/Files"]
        CACHE["Redis Cache<br/>Sessions"]
    end
    
    CF --> FE1
    CF --> FE2
    CF --> FE3
    
    FE1 --> API
    FE2 --> API
    FE3 --> API
    
    API --> LB
    LB --> ML1
    LB --> ML2
    
    API --> DB1
    API --> DB2
    API --> STORAGE
    API --> CACHE
    
    ML1 --> DB1
    ML2 --> DB1
```

### 8.2 CI/CD Pipeline

```mermaid
graph LR
    DEV["Developer<br/>Push to GitHub"] --> PR["Pull Request"]
    PR --> CI["CI Pipeline<br/>GitHub Actions"]
    
    CI --> TEST["Run Tests<br/>Unit, Integration"]
    TEST --> LINT["Lint & Type Check"]
    LINT --> BUILD["Build Application"]
    
    BUILD --> STAGING["Deploy to Staging<br/>Vercel Preview"]
    STAGING --> E2E["E2E Tests<br/>Playwright"]
    
    E2E --> REVIEW["Code Review<br/>Team Approval"]
    REVIEW --> MERGE["Merge to Main"]
    
    MERGE --> CD["CD Pipeline"]
    CD --> DEPLOY_PROD["Deploy to Production<br/>Vercel + Railway"]
    CD --> DEPLOY_DB["Run Migrations<br/>Prisma Migrate"]
    
    DEPLOY_PROD --> MONITOR["Monitor<br/>Vercel Analytics"]
```

---

## 9. Integration Patterns

### 9.1 Event-Driven Architecture

```mermaid
graph TB
    subgraph "Event Bus"
        EB["Event Bus<br/>Supabase Realtime"]
    end
    
    subgraph "Publishers"
        P1["Scan Completed"]
        P2["Coins Awarded"]
        P3["Redemption Requested"]
        P4["Rating Submitted"]
    end
    
    subgraph "Subscribers"
        S1["Notification Service<br/>Send WhatsApp"]
        S2["Analytics Service<br/>Update Metrics"]
        S3["Leaderboard Service<br/>Update Rankings"]
        S4["Audit Service<br/>Log Events"]
    end
    
    P1 --> EB
    P2 --> EB
    P3 --> EB
    P4 --> EB
    
    EB --> S1
    EB --> S2
    EB --> S3
    EB --> S4
```

### 9.2 API Gateway Pattern

```mermaid
flowchart LR
    subgraph "Clients"
        C1["WhatsApp Bot"]
        C2["Web Dashboard"]
        C3["Mobile Browser"]
    end
    
    subgraph "API Gateway"
        GW["Gateway<br/>Next.js Middleware"]
        AUTH["Auth Filter"]
        RATE["Rate Limiter"]
        ROUTE["Router"]
    end
    
    subgraph "Microservices"
        S1["User Service"]
        S2["Scan Service"]
        S3["Coin Service"]
        S4["ML Service"]
    end
    
    C1 --> GW
    C2 --> GW
    C3 --> GW
    
    GW --> AUTH
    AUTH --> RATE
    RATE --> ROUTE
    
    ROUTE --> S1
    ROUTE --> S2
    ROUTE --> S3
    ROUTE --> S4
```

---

## 10. Performance & Scaling

### 10.1 Caching Strategy

```mermaid
flowchart TB
    subgraph "Cache Layers"
        L1["Browser Cache<br/>Static Assets"]
        L2["CDN Cache<br/>Vercel Edge"]
        L3["API Cache<br/>Redis"]
        L4["Database Cache<br/>Supabase Pool"]
    end
    
    subgraph "Cache Policies"
        P1["Static Assets<br/>1 year TTL"]
        P2["API Responses<br/>5 min TTL"]
        P3["User Sessions<br/>24 hour TTL"]
        P4["Leaderboard<br/>1 min TTL"]
    end
    
    L1 --> P1
    L2 --> P1
    L3 --> P2
    L3 --> P3
    L3 --> P4
    L4 --> P2
```

### 10.2 Auto-Scaling Configuration

```mermaid
graph TB
    subgraph "Metrics"
        M1["CPU Usage"]
        M2["Memory Usage"]
        M3["Request Queue"]
        M4["Response Time"]
    end
    
    subgraph "Triggers"
        T1["> 70% CPU"]
        T2["> 80% Memory"]
        T3["> 100 queued"]
        T4["> 2s response"]
    end
    
    subgraph "Actions"
        A1["Scale Up<br/>+2 instances"]
        A2["Scale Down<br/>-1 instance"]
        A3["Alert Team"]
    end
    
    M1 --> T1
    M2 --> T2
    M3 --> T3
    M4 --> T4
    
    T1 --> A1
    T2 --> A1
    T3 --> A1
    T4 --> A1
    
    T1 -.-> A3
    T4 -.-> A3
```

---

## 11. Monitoring & Observability

### 11.1 Observability Stack

```mermaid
graph TB
    subgraph "Application"
        A1["Next.js App"]
        A2["ML Service"]
        A3["Database"]
    end
    
    subgraph "Telemetry"
        T1["Logs<br/>Vercel + Winston"]
        T2["Metrics<br/>Vercel Analytics"]
        T3["Traces<br/>OpenTelemetry"]
    end
    
    subgraph "Monitoring Tools"
        M1["Dashboard<br/>Grafana"]
        M2["Alerts<br/>PagerDuty"]
        M3["Error Tracking<br/>Sentry"]
    end
    
    A1 --> T1
    A1 --> T2
    A2 --> T1
    A2 --> T2
    A3 --> T2
    
    T1 --> M3
    T2 --> M1
    T3 --> M1
    
    M1 --> M2
```

---

## 12. Appendix

### 12.1 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS | Web application |
| **Backend** | Next.js API Routes, Prisma | REST API |
| **ML Service** | FastAPI, Python, TensorFlow | AI inference |
| **Database** | Supabase PostgreSQL | Primary data store |
| **Storage** | Supabase Storage | File storage |
| **Cache** | Redis | Session & API caching |
| **Auth** | Supabase Auth | Authentication |
| **Deployment** | Vercel, Railway | Hosting |
| **Monitoring** | Vercel Analytics, Sentry | Observability |

### 12.2 API Versioning Strategy

```mermaid
graph LR
    V1["/api/v1/*<br/>Current Version"] --> S["Stable<br/>Supported"]
    V2["/api/v2/*<br/>Next Version"] --> D["Development<br/>Beta"]
    
    style V1 fill:#16a34a,color:#fff
    style V2 fill:#f59e0b,color:#fff
```

### 12.3 Backup & Disaster Recovery

```mermaid
flowchart TB
    subgraph "Primary"
        P[(Supabase<br/>Primary DB)]
    end
    
    subgraph "Backup Strategy"
        B1["Hourly<br/>Point-in-time"]
        B2["Daily<br/>Full Backup"]
        B3["Weekly<br/>Archive"]
    end
    
    subgraph "Recovery"
        R1["RPO: 1 hour"]
        R2["RTO: 4 hours"]
    end
    
    P --> B1
    P --> B2
    P --> B3
    
    B1 --> R1
    B2 --> R2
```

---

**Document Owner**: Agri Volunteer Development Team  
**Review Cycle**: Bi-weekly  
**Next Review Date**: 2026-03-01
