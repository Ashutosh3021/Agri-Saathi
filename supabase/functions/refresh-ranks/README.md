# Supabase Edge Function: refresh-ranks

This Edge Function recalculates leaderboard rankings (national, state, and district) for the Agri Sathi platform.

## Deployment

```bash
# Login to Supabase CLI
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy refresh-ranks

# Set environment variables
supabase secrets set CRON_SECRET=your-secure-cron-secret
supabase secrets set SUPABASE_URL=https://your-project-ref.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Usage

### Via Cron Job (Vercel)
```javascript
// Call from Vercel cron job
fetch('https://your-project-ref.supabase.co/functions/v1/refresh-ranks', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-cron-secret',
    'Content-Type': 'application/json'
  }
})
```

### Via Direct Invocation
```bash
curl -X POST \
  https://your-project-ref.supabase.co/functions/v1/refresh-ranks \
  -H "Authorization: Bearer your-cron-secret"
```

## How It Works

1. The function calls the `refresh_all_leaderboard_ranks()` RPC function
2. This PostgreSQL function:
   - Recalculates national ranks using `ROW_NUMBER() OVER (ORDER BY totalCoins DESC)`
   - Recalculates state ranks using `ROW_NUMBER() OVER (PARTITION BY state ...)`
   - Recalculates district ranks using `ROW_NUMBER() OVER (PARTITION BY district ...)`
   - Updates the `lastUpdated` timestamp
3. Returns the count of updated records

## Required Database Functions

Make sure these SQL functions are created in your database (see `supabase/functions/rpc_leaderboard.sql`):
- `recalculate_national_ranks()`
- `recalculate_state_ranks()`
- `recalculate_district_ranks()`
- `refresh_all_leaderboard_ranks()` (recommended - updates all at once)

## Security

- The function requires a `CRON_SECRET` environment variable
- Only requests with matching `Authorization: Bearer {CRON_SECRET}` header are accepted
- Uses service role key for database access
