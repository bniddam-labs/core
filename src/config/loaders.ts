import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { PartialConfiguration } from './types';
import { getEnv, parseArray, parseBoolean, parseNumber } from './utils';

/**
 * Configuration loaders - functions to load configuration from various sources
 * These are helpers that DON'T create fixed config, but provide utilities
 * for consuming projects to use when building their config
 */

/**
 * Load .env file into process.env
 * @param envFilePath - Path to .env file (defaults to .env in current directory)
 * @param override - Whether to override existing environment variables
 */
export function loadDotEnv(envFilePath = '.env', override = false): void {
  const resolvedPath = path.resolve(process.cwd(), envFilePath);
  
  if (fs.existsSync(resolvedPath)) {
    dotenv.config({ path: resolvedPath, override });
  }
}

/**
 * Load configuration from environment variables
 * @param prefix - Optional prefix for environment variables (e.g., 'APP_')
 * @returns Partial configuration loaded from environment
 */
export function loadFromEnv(prefix = ''): PartialConfiguration {
  const prefixKey = (key: string) => `${prefix}${key}`;

  return {
    app: {
      name: getEnv(prefixKey('APP_NAME'), 'NestJS Boilerplate'),
      url: getEnv(prefixKey('APP_URL'), 'http://localhost:3000'),
      frontendUrl: getEnv(prefixKey('FRONTEND_URL'), 'http://localhost:3001'),
      port: parseNumber(process.env[prefixKey('PORT')], 3000),
      nodeEnv: (process.env[prefixKey('NODE_ENV')] || 'development') as any,
      corsOrigin: getEnv(prefixKey('CORS_ORIGIN'), '*'),
      rateLimitMax: parseNumber(process.env[prefixKey('RATE_LIMIT_MAX')], 100),
      rateLimitTtl: parseNumber(process.env[prefixKey('RATE_LIMIT_TTL')], 60),
    },
    database: {
      type: 'postgres' as const,
      host: getEnv(prefixKey('DATABASE_HOST'), 'localhost'),
      port: parseNumber(process.env[prefixKey('DATABASE_PORT')], 5432),
      username: getEnv(prefixKey('DATABASE_USERNAME'), 'postgres'),
      password: getEnv(prefixKey('DATABASE_PASSWORD'), 'postgres'),
      database: getEnv(prefixKey('DATABASE_NAME'), 'nestjs_boilerplate'),
      synchronize: !parseBoolean(process.env[prefixKey('USE_MIGRATIONS')], false),
      dropSchema: false,
      logging: parseBoolean(process.env[prefixKey('DATABASE_LOGGING')], false),
      ssl: parseBoolean(process.env[prefixKey('DATABASE_SSL')], false),
      autoLoadEntities: true,
      migrationsRun: parseBoolean(process.env[prefixKey('USE_MIGRATIONS')], false),
      rlsEnabled: parseBoolean(process.env[prefixKey('RLS_ENABLED')], false),
    },
    auth: {
      jwtSecret: getEnv(prefixKey('JWT_SECRET'), 'jwt-secret-key-DEVELOPMENT-ONLY'),
      jwtRefreshSecret: getEnv(prefixKey('JWT_REFRESH_SECRET'), 'jwt-refresh-secret-key-DEVELOPMENT-ONLY'),
      jwtExpiresIn: getEnv(prefixKey('JWT_EXPIRES_IN'), '15m'),
      jwtRefreshExpiresIn: getEnv(prefixKey('JWT_REFRESH_EXPIRES_IN'), '7d'),
      bcryptRounds: parseNumber(process.env[prefixKey('BCRYPT_ROUNDS')], 12),
      maxFailedAttempts: parseNumber(process.env[prefixKey('AUTH_MAX_FAILED_ATTEMPTS')], 5),
      lockoutDurationMinutes: parseNumber(process.env[prefixKey('AUTH_LOCKOUT_DURATION_MINUTES')], 30),
      ...(process.env[prefixKey('GOOGLE_CLIENT_ID')] && process.env[prefixKey('GOOGLE_CLIENT_SECRET')]
        ? {
            google: {
              clientId: process.env[prefixKey('GOOGLE_CLIENT_ID')] as string,
              clientSecret: process.env[prefixKey('GOOGLE_CLIENT_SECRET')] as string,
            },
          }
        : {}),
      ...(process.env[prefixKey('GITHUB_CLIENT_ID')] && process.env[prefixKey('GITHUB_CLIENT_SECRET')]
        ? {
            github: {
              clientId: process.env[prefixKey('GITHUB_CLIENT_ID')] as string,
              clientSecret: process.env[prefixKey('GITHUB_CLIENT_SECRET')] as string,
            },
          }
        : {}),
    },
    redis: {
      host: getEnv(prefixKey('REDIS_HOST'), 'localhost'),
      port: parseNumber(process.env[prefixKey('REDIS_PORT')], 6379),
      password: process.env[prefixKey('REDIS_PASSWORD')],
      db: parseNumber(process.env[prefixKey('REDIS_DB')], 0),
      ttl: parseNumber(process.env[prefixKey('CACHE_TTL')], 3600),
      keyPrefix: getEnv(prefixKey('REDIS_KEY_PREFIX'), 'cache:'),
    },
    admin: {
      email: getEnv(prefixKey('ADMIN_EMAIL'), 'admin@example.com'),
      password: getEnv(prefixKey('ADMIN_PASSWORD'), 'change-me-in-production'),
      allowedIps: process.env[prefixKey('ADMIN_ALLOWED_IPS')]
        ? parseArray(process.env[prefixKey('ADMIN_ALLOWED_IPS')])
        : undefined,
    },
    email: {
      enabled: process.env[prefixKey('EMAIL_STATUS')] === 'enabled',
      from: getEnv(prefixKey('EMAIL_FROM'), 'noreply@example.com'),
      brevoApiKey: process.env[prefixKey('BREVO_API_KEY')],
      ...(process.env[prefixKey('SMTP_HOST')]
        ? {
            smtp: {
              host: process.env[prefixKey('SMTP_HOST')] as string,
              port: parseNumber(process.env[prefixKey('SMTP_PORT')], 587),
              secure: parseBoolean(process.env[prefixKey('SMTP_SECURE')], true),
              auth: {
                user: getEnv(prefixKey('SMTP_USER'), ''),
                pass: getEnv(prefixKey('SMTP_PASS'), ''),
              },
            },
          }
        : {}),
    },
    s3: {
      endpoint: getEnv(prefixKey('S3_ENDPOINT'), 's3.amazonaws.com'),
      port: parseNumber(process.env[prefixKey('S3_PORT')], 443),
      useSSL: parseBoolean(process.env[prefixKey('S3_USE_SSL')], true),
      region: getEnv(prefixKey('S3_REGION'), 'eu-west-3'),
      accessKey: getEnv(prefixKey('S3_ACCESS_KEY'), ''),
      secretKey: getEnv(prefixKey('S3_SECRET_KEY'), ''),
      bucketName: getEnv(prefixKey('S3_BUCKET_NAME'), 'nestjs-boilerplate-files'),
    },
    rabbitmq: {
      uri:
        process.env[prefixKey('RABBITMQ_URI')] ||
        `amqp://${getEnv(prefixKey('RABBITMQ_USER'), 'guest')}:${getEnv(prefixKey('RABBITMQ_PASSWORD'), 'guest')}@${getEnv(prefixKey('RABBITMQ_HOST'), 'localhost')}:${getEnv(prefixKey('RABBITMQ_PORT'), '5672')}${
          process.env[prefixKey('RABBITMQ_VHOST')] && process.env[prefixKey('RABBITMQ_VHOST')] !== '/'
            ? `/${process.env[prefixKey('RABBITMQ_VHOST')]}`
            : ''
        }`,
      exchange: getEnv(prefixKey('RABBITMQ_EXCHANGE'), 'app.notifications'),
      dlxExchange: getEnv(prefixKey('RABBITMQ_DLX_EXCHANGE'), 'app.notifications.dlx'),
      connectionInitOptions: {
        wait: process.env[prefixKey('NODE_ENV')] !== 'test',
        timeout: 10000,
        reject: true,
      },
    },
    logging: {
      level: (getEnv(prefixKey('LOG_LEVEL'), 'info') as any) || 'info',
      format: (getEnv(prefixKey('LOG_FORMAT'), 'json') as any) || 'json',
      transports: parseArray(process.env[prefixKey('LOG_TRANSPORTS')], ['console']) as any,
      ...(process.env[prefixKey('LOG_FILE')]
        ? {
            fileConfig: {
              filename: process.env[prefixKey('LOG_FILE')] as string,
              maxSize: getEnv(prefixKey('LOG_MAX_SIZE'), '10m'),
              maxFiles: parseNumber(process.env[prefixKey('LOG_MAX_FILES')], 5),
            },
          }
        : {}),
    },
    featureFlags: {
      enableNewUI: parseBoolean(process.env[prefixKey('FEATURE_NEW_UI')], false),
      enableBetaFeatures: parseBoolean(process.env[prefixKey('FEATURE_BETA')], false),
      enableAnalytics: parseBoolean(process.env[prefixKey('FEATURE_ANALYTICS')], true),
      maintenanceMode: parseBoolean(process.env[prefixKey('MAINTENANCE_MODE')], false),
    },
  };
}

/**
 * Load configuration from a JSON file
 * @param filePath - Path to JSON config file
 * @returns Partial configuration loaded from file
 */
export function loadFromFile(filePath: string): PartialConfiguration {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fileContent = require(filePath);
    return fileContent as PartialConfiguration;
  } catch (error) {
    throw new Error(`Failed to load configuration from file ${filePath}: ${error}`);
  }
}

/**
 * Load minimal configuration for testing
 * @returns Minimal configuration for test environment
 */
export function loadTestConfig(): PartialConfiguration {
  return {
    app: {
      name: 'Test App',
      url: 'http://localhost:3000',
      frontendUrl: 'http://localhost:3001',
      port: 3000,
      nodeEnv: 'test',
      corsOrigin: '*',
      rateLimitMax: 1000,
      rateLimitTtl: 60,
    },
    database: {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test_db',
      synchronize: true,
      dropSchema: true,
      logging: false,
      autoLoadEntities: true,
      migrationsRun: false,
      rlsEnabled: false,
    },
    auth: {
      jwtSecret: 'test-jwt-secret-32-characters-long-for-testing',
      jwtRefreshSecret: 'test-refresh-secret-32-characters-long-for-testing',
      jwtExpiresIn: '15m',
      jwtRefreshExpiresIn: '7d',
      bcryptRounds: 10,
      maxFailedAttempts: 5,
      lockoutDurationMinutes: 30,
    },
    redis: {
      host: 'localhost',
      port: 6379,
      db: 1,
      ttl: 3600,
      keyPrefix: 'test:',
    },
    admin: {
      email: 'admin@test.com',
      password: 'test-admin-password-secure',
    },
    email: {
      enabled: false,
      from: 'test@example.com',
    },
    s3: {
      endpoint: 's3.amazonaws.com',
      port: 443,
      useSSL: true,
      region: 'eu-west-3',
      accessKey: 'test-access-key',
      secretKey: 'test-secret-key',
      bucketName: 'test-bucket',
    },
    rabbitmq: {
      uri: 'amqp://guest:guest@localhost:5672',
      exchange: 'test.exchange',
      dlxExchange: 'test.exchange.dlx',
      connectionInitOptions: {
        wait: false,
        timeout: 10000,
        reject: true,
      },
    },
    logging: {
      level: 'error',
      format: 'json',
      transports: ['console'],
    },
    featureFlags: {
      enableNewUI: false,
      enableBetaFeatures: false,
      enableAnalytics: false,
      maintenanceMode: false,
    },
  };
}
