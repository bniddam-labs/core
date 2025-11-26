import { z } from 'zod';

/**
 * Environment variables validation schema using Zod
 */
const envSchema = z.object({
  // Server
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('*'),

  // Rate limiting
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_TTL: z.coerce.number().int().positive().default(60),

  // Database
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_PORT: z.coerce.number().int().positive().default(5432),
  DATABASE_USERNAME: z.string().default('postgres'),
  DATABASE_PASSWORD: z.string().default('postgres'),
  DATABASE_NAME: z.string().default('nestjs_boilerplate'),
  DATABASE_SSL: z.coerce.boolean().default(false),
  DATABASE_LOGGING: z.coerce.boolean().default(false),

  // Migration Configuration
  RUN_MIGRATIONS: z.coerce.boolean().default(false),

  // JWT
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Security
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(20).default(12),

  // OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().int().nonnegative().default(0),

  // Cache
  CACHE_TTL: z.coerce.number().int().positive().default(3600),

  // Admin
  ADMIN_EMAIL: z.string().email().default('admin@example.com'),
  ADMIN_PASSWORD: z.string().default('change-me-in-production'),
  ADMIN_ALLOWED_IPS: z.string().optional(),
});

export type EnvironmentVariables = z.infer<typeof envSchema>;

/**
 * Validates environment variables using Zod schema
 * @param config - Raw environment configuration object
 * @returns Validated and typed environment variables
 * @throws Error if validation fails
 */
export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  try {
    return envSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      throw new Error(`Environment validation failed:\n${errorMessages}`);
    }
    throw error;
  }
}
