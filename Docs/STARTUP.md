# Agri Sathi - Startup Guide

A comprehensive guide to running Agri Sathi locally and deploying to production.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [ML Service Setup](#ml-service-setup)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Project Overview

Agri Sathi is an AI-powered agricultural assistance platform consisting of:
- **Next.js Frontend** - Dashboard and admin interface
- **Prisma + PostgreSQL** - Database layer
- **Supabase** - Authentication and storage
- **Python ML Service** - Pest detection and soil analysis models
- **Supabase Edge Functions** - Leaderboard ranking

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** 18+ and **pnpm** (or npm/yarn)
- **Python** 3.9+ (for ML service)
- **Git**
- **Supabase Account** (free tier available)
- **Vercel Account** (for deployment)
- **OpenWeather API Key** (free tier available)
- **WhatsApp Business API** (AiSensy or Meta)

### Install pnpm (recommended)
```bash
npm install -g pnpm
```

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd agri-sathi
```

### 2. Install Frontend Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials (see [Environment Variables](#environment-variables) section).

### 4. Database Setup

#### Option A: Using Supabase (Recommended for Production-like setup)

1. Go to [Supabase](https://supabase.com) and create a new project
2. Get your database connection string from Settings > Database
3. Update `DATABASE_URL` and `DIRECT_URL` in `.env.local`
4. Get your Supabase URL and Anon Key from Settings > API
5. Update `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Option B: Using Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb agri_sathi`
3. Update connection strings in `.env.local`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/agri_sathi"
   DIRECT_URL="postgresql://user:password@localhost:5432/agri_sathi"
   ```

### 5. Initialize Database

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations (creates tables)
pnpm db:migrate

# Seed database with sample data
pnpm db:seed
```

### 6. Set Up Supabase Storage

1. Go to Supabase Dashboard > Storage
2. Create a new bucket called `scan-images`
3. Set bucket permissions to public (or configure RLS policies)
4. Enable CORS if needed for local development

### 7. Set Up Supabase Edge Functions (Optional)

For leaderboard ranking:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy edge functions
supabase functions deploy refresh-ranks
```

Run the SQL functions from `supabase/functions/rpc_leaderboard.sql` in Supabase SQL Editor.

---

## Environment Variables

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `DATABASE_URL` | PostgreSQL connection string | Supabase Dashboard |
| `DIRECT_URL` | Direct PostgreSQL connection | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Supabase Settings > API |
| `INTERNAL_API_KEY` | Secret for internal API calls | Generate random string |
| `CRON_SECRET` | Secret for cron job security | Generate random string |

### ML Service Variables

| Variable | Description |
|----------|-------------|
| `ML_SERVICE_URL` | URL of ML service (http://localhost:8000 locally) |
| `ML_INTERNAL_KEY` | Secret key for ML service communication |

### WhatsApp Integration (Optional)

| Variable | Description |
|----------|-------------|
| `WHATSAPP_API_KEY` | AiSensy API key |
| `WHATSAPP_VERIFY_TOKEN` | Webhook verification token |
| `WHATSAPP_APP_SECRET` | Meta/Facebook app secret |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp access token |

### Weather API (Optional)

| Variable | Description |
|----------|-------------|
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key |

---

## Running the Application

### Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Start ML Service (Optional)

```bash
cd ml-service

# Create Python virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate
# Activate (Mac/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the service
python main.py
```

ML Service will be available at `http://localhost:8000`

Test it:
```bash
curl http://localhost:8000/health
```

---

## ML Service Setup

### Prerequisites

- Python 3.9+
- TensorFlow 2.x
- FastAPI
- Other dependencies in `ml-service/requirements.txt`

### Training Models (Optional)

If you need to train the ML models:

1. Prepare your datasets in the appropriate format
2. Use the training notebooks (if available)
3. Save models to `ml-service/weights/`

### Running with Docker (Alternative)

```bash
cd ml-service

# Build image
docker build -t agri-sathi-ml .

# Run container
docker run -p 8000:8000 --env-file .env agri-sathi-ml
```

---

## Production Deployment

### Deploying to Vercel (Free Tier)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Select "Next.js" framework preset

3. **Configure Environment Variables**
   - Add all variables from `.env.local` to Vercel Environment Variables
   - Set `NODE_ENV=production`

4. **Deploy**
   - Vercel will auto-deploy on every push
   - Get your production URL

5. **Update Supabase**
   - Add your Vercel domain to Supabase Auth > URL Configuration
   - Add to allowed CORS origins in Supabase

### Deploying ML Service

#### Option A: Railway (Free Tier Available)

1. Push ML service to a separate repo or use the same repo
2. Connect to [Railway](https://railway.app)
3. Add environment variables
4. Deploy

#### Option B: Render (Free Tier)

1. Create a Web Service on [Render](https://render.com)
2. Connect your repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python main.py`
5. Add environment variables
6. Deploy

#### Option C: Fly.io (Free Tier)

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch
cd ml-service
fly launch

# Deploy
fly deploy
```

### Database (Production)

Continue using Supabase free tier or upgrade:

- **Supabase** - $25/month for Pro (recommended for ease)
- **Railway PostgreSQL** - Pay-as-you-go
- **AWS RDS** - Free tier for 12 months

### Setting Up Cron Jobs

For leaderboard refresh:

1. In Vercel Dashboard, go to your project
2. Settings > Cron Jobs
3. Add: `*/5 * * * *` pointing to `/api/cron/refresh-leaderboard`
4. Or use the included `vercel.json` config

---

## Free Deployment Summary

| Service | Provider | Cost | Purpose |
|---------|----------|------|---------|
| Frontend | Vercel | Free | Next.js hosting |
| Database | Supabase | Free (500MB) | PostgreSQL + Auth |
| ML Service | Railway/Render/Fly.io | Free tier | Python API |
| Storage | Supabase | Free (1GB) | Image storage |
| Edge Functions | Supabase | Free | Leaderboard logic |
| WhatsApp | AiSensy | Freemium | Messaging |
| Weather | OpenWeather | Free tier | Weather data |

---

## Troubleshooting

### Common Issues

**"Prisma Client not found"**
```bash
pnpm db:generate
```

**"Database connection failed"**
- Check `DATABASE_URL` format
- Ensure IP is whitelisted in Supabase
- Try connection pooling URL for serverless

**"Module not found" errors**
```bash
rm -rf node_modules
pnpm install
```

**"ML Service not responding"**
- Check if ML service is running: `curl http://localhost:8000/health`
- Verify `ML_SERVICE_URL` in environment
- Check ML service logs

**"Images not uploading"**
- Verify Supabase Storage bucket exists
- Check bucket permissions
- Verify Supabase credentials

**"WhatsApp webhook not working"**
- Ensure webhook URL is publicly accessible
- Verify `WHATSAPP_VERIFY_TOKEN` matches
- Check Meta/AiSensy webhook settings

### Getting Help

- Check console logs in browser and server
- Review Vercel function logs
- Check Supabase logs in Dashboard
- Review ML service logs

---

## Development Workflow

1. Make changes locally
2. Test with `pnpm dev`
3. Run database migrations if schema changed: `pnpm db:migrate`
4. Commit and push
5. Vercel auto-deploys

---

## Security Checklist

Before going live:

- [ ] Change all default/placeholder secrets
- [ ] Enable RLS policies in Supabase
- [ ] Configure CORS properly
- [ ] Set up webhook signature verification
- [ ] Enable HTTPS only
- [ ] Remove debug logging
- [ ] Set up monitoring/alerts

---

## Support

For issues or questions:
- Check the troubleshooting section above
- Review environment variable configuration
- Ensure all services are properly connected

---

**Happy Farming! 🌾**
