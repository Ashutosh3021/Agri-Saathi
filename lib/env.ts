/**
 * Environment Variable Validation
 * Ensures all required environment variables are set before app startup
 */

const requiredEnvVars = {
  // Database
  DATABASE_URL: 'PostgreSQL database connection string',
  DIRECT_URL: 'Direct PostgreSQL connection string (for migrations)',
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: 'Supabase project URL',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'Supabase anonymous/public key',
  
  // Internal
  INTERNAL_API_KEY: 'Secret key for internal API calls',
  CRON_SECRET: 'Secret for securing cron endpoints',
} as const

const optionalEnvVars = {
  // ML Service
  ML_SERVICE_URL: 'ML service URL (default: http://localhost:8000)',
  ML_INTERNAL_KEY: 'ML service authentication key',
  
  // WhatsApp Integration
  WHATSAPP_API_KEY: 'AiSensy API key',
  WHATSAPP_VERIFY_TOKEN: 'Webhook verification token',
  WHATSAPP_APP_SECRET: 'Facebook/Meta app secret',
  WHATSAPP_ACCESS_TOKEN: 'WhatsApp access token',
  
  // Weather API
  OPENWEATHER_API_KEY: 'OpenWeatherMap API key',
  
  // Development
  NODE_ENV: 'Environment (development/production)',
} as const

export function validateEnv(): { valid: boolean; missing: string[]; warnings: string[] } {
  const missing: string[] = []
  const warnings: string[] = []

  // Check required variables
  for (const [key, description] of Object.entries(requiredEnvVars)) {
    if (!process.env[key]) {
      missing.push(`${key} (${description})`)
    }
  }

  // Check optional variables (warn but don't fail)
  for (const [key, description] of Object.entries(optionalEnvVars)) {
    if (!process.env[key]) {
      warnings.push(`${key} is not set (${description})`)
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  }
}

export function logEnvStatus(): void {
  const { valid, missing, warnings } = validateEnv()

  if (!valid) {
    console.error('❌ Missing required environment variables:')
    missing.forEach((key) => console.error(`  - ${key}`))
    console.error('\nPlease set these variables in your .env.local file')
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Missing optional environment variables:')
    warnings.forEach((key) => console.warn(`  - ${key}`))
  }

  if (valid && warnings.length === 0) {
    console.log('✅ All environment variables are set')
  }
}

// Export for use in components that need to check specific vars
export function getEnvVar(key: keyof typeof requiredEnvVars | keyof typeof optionalEnvVars): string {
  const value = process.env[key]
  if (!value && key in requiredEnvVars) {
    throw new Error(`Required environment variable ${key} is not set`)
  }
  return value || ''
}
