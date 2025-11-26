/**
 * Database configuration types
 */
export interface DatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  dropSchema?: boolean;
  logging: boolean;
  ssl?: boolean;
  autoLoadEntities: boolean;
  migrationsRun: boolean;
  rlsEnabled: boolean;
}

/**
 * Authentication configuration types
 */
export interface AuthConfig {
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;
  bcryptRounds: number;
  maxFailedAttempts: number;
  lockoutDurationMinutes: number;
  google?: {
    clientId: string;
    clientSecret: string;
  };
  github?: {
    clientId: string;
    clientSecret: string;
  };
}

/**
 * Redis cache configuration types
 */
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  ttl: number;
}

/**
 * Application configuration types
 */
export interface AppConfig {
  name: string;
  url: string;
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  frontendUrl: string;
  rateLimitMax: number;
  rateLimitTtl: number;
}

/**
 * Admin panel configuration types
 */
export interface AdminConfig {
  email: string;
  password: string;
  allowedIps?: string[];
}

/**
 * Email service configuration types
 */
export interface EmailConfig {
  enabled: boolean;
  from: string;
  brevoApiKey?: string;
}

/**
 * S3-compatible storage configuration types
 */
export interface S3Config {
  endpoint: string;
  port: number;
  useSSL: boolean;
  region: string;
  accessKey: string;
  secretKey: string;
  bucketName: string;
}

/**
 * RabbitMQ message queue configuration types
 */
export interface RabbitMQConfig {
  uri: string;
  exchange: string;
  dlxExchange: string;
  connectionInitOptions?: {
    wait: boolean;
    timeout?: number;
    reject?: boolean;
  };
}

/**
 * Complete application configuration
 */
export interface Configuration {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  redis: RedisConfig;
  admin: AdminConfig;
  email: EmailConfig;
  s3: S3Config;
  rabbitmq: RabbitMQConfig;
}
