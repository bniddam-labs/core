import type {
  AdminConfig,
  AppConfig,
  AuthConfig,
  Configuration,
  DatabaseConfig,
  EmailConfig,
  RabbitMQConfig,
  RedisConfig,
  S3Config,
} from './app-config.types';

/**
 * Loads and validates application configuration from environment variables
 * This function performs fail-fast validation for critical secrets in production
 *
 * @returns Complete application configuration
 * @throws Error if validation fails or critical environment variables are missing
 */
export function loadAppConfig(): Configuration {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const isProduction = nodeEnv === 'production';

  // Validate critical secrets in production
  if (isProduction) {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!jwtSecret || jwtSecret.length < 32) {
      throw new Error(
        'SECURITY ERROR: JWT_SECRET must be set with at least 32 characters in production',
      );
    }

    if (!jwtRefreshSecret || jwtRefreshSecret.length < 32) {
      throw new Error(
        'SECURITY ERROR: JWT_REFRESH_SECRET must be set with at least 32 characters in production',
      );
    }

    if (!adminPassword || adminPassword === 'change-me-in-production') {
      throw new Error(
        'SECURITY ERROR: ADMIN_PASSWORD must be set to a strong password in production (not the default value)',
      );
    }

    if (adminPassword.length < 12) {
      throw new Error(
        'SECURITY ERROR: ADMIN_PASSWORD must be at least 12 characters long in production',
      );
    }
  }

  const config: Configuration = {
    app: loadAppConfigSection(),
    database: loadDatabaseConfig(),
    auth: loadAuthConfig(),
    redis: loadRedisConfig(),
    admin: loadAdminConfig(),
    email: loadEmailConfig(),
    s3: loadS3Config(),
    rabbitmq: loadRabbitMQConfig(),
  };

  // Only log basic config info in development (without sensitive data)
  if (process.env.NODE_ENV === 'development') {
    console.log('Configuration loaded:', {
      name: config.app.name,
      port: config.app.port,
      nodeEnv: config.app.nodeEnv,
    });
  }

  return config;
}

function loadAppConfigSection(): AppConfig {
  return {
    name: process.env.APP_NAME ?? 'NestJS Boilerplate',
    url: process.env.APP_URL ?? 'http://localhost:3000',
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3001',
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    corsOrigin: process.env.CORS_ORIGIN ?? '*',
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX ?? '100', 10),
    rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL ?? '60', 10),
  };
}

function loadDatabaseConfig(): DatabaseConfig {
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USERNAME ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? 'postgres',
    database: process.env.DATABASE_NAME ?? 'nestjs_boilerplate',
    synchronize: process.env.NODE_ENV === 'development',
    dropSchema: process.env.NODE_ENV === 'development',
    logging: process.env.DATABASE_LOGGING === '1',
    ssl: process.env.DATABASE_SSL === '1',
    autoLoadEntities: true,
    migrationsRun: process.env.NODE_ENV === 'production' || process.env.RUN_MIGRATIONS === 'true',
    rlsEnabled: process.env.RLS_ENABLED === 'true',
  };
}

function loadAuthConfig(): AuthConfig {
  return {
    jwtSecret: process.env.JWT_SECRET ?? 'jwt-secret-key-DEVELOPMENT-ONLY',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'jwt-refresh-secret-key-DEVELOPMENT-ONLY',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS ?? '12', 10),
    maxFailedAttempts: parseInt(process.env.AUTH_MAX_FAILED_ATTEMPTS ?? '5', 10),
    lockoutDurationMinutes: parseInt(process.env.AUTH_LOCKOUT_DURATION_MINUTES ?? '30', 10),
    google:
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }
        : undefined,
    github:
      process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
        ? {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }
        : undefined,
  };
}

function loadRedisConfig(): RedisConfig {
  return {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB ?? '0', 10),
    ttl: parseInt(process.env.CACHE_TTL ?? '3600', 10),
  };
}

function loadAdminConfig(): AdminConfig {
  return {
    email: process.env.ADMIN_EMAIL ?? 'admin@example.com',
    password: process.env.ADMIN_PASSWORD ?? 'change-me-in-production',
    allowedIps: process.env.ADMIN_ALLOWED_IPS?.split(','),
  };
}

function loadEmailConfig(): EmailConfig {
  return {
    enabled: process.env.EMAIL_STATUS === 'enabled',
    from: process.env.EMAIL_FROM ?? 'noreply@example.com',
    brevoApiKey: process.env.BREVO_API_KEY,
  };
}

function loadS3Config(): S3Config {
  return {
    endpoint: process.env.S3_ENDPOINT ?? 's3.amazonaws.com',
    port: parseInt(process.env.S3_PORT ?? '443', 10),
    useSSL: process.env.S3_USE_SSL !== 'false',
    region: process.env.S3_REGION ?? 'eu-west-3',
    accessKey: process.env.S3_ACCESS_KEY ?? '',
    secretKey: process.env.S3_SECRET_KEY ?? '',
    bucketName: process.env.S3_BUCKET_NAME ?? 'nestjs-boilerplate-files',
  };
}

function loadRabbitMQConfig(): RabbitMQConfig {
  return {
    uri:
      process.env.RABBITMQ_URI ??
      `amqp://${process.env.RABBITMQ_USER ?? 'guest'}:${process.env.RABBITMQ_PASSWORD ?? 'guest'}@${process.env.RABBITMQ_HOST ?? 'localhost'}:${
        process.env.RABBITMQ_PORT ?? '5672'
      }${process.env.RABBITMQ_VHOST && process.env.RABBITMQ_VHOST !== '/' ? `/${process.env.RABBITMQ_VHOST}` : ''}`,
    exchange: process.env.RABBITMQ_EXCHANGE ?? 'app.notifications',
    dlxExchange: process.env.RABBITMQ_DLX_EXCHANGE ?? 'app.notifications.dlx',
    connectionInitOptions: {
      wait: process.env.NODE_ENV !== 'test',
      timeout: 10000,
      reject: true,
    },
  };
}
