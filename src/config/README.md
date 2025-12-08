# Configuration Package

This package provides **configuration helpers only** - no fixed configuration values.
Consuming projects use these utilities to build their own configuration.

## Key Features

- ✅ **Zod schemas as single source of truth** - Types are inferred, no duplication
- ✅ **Fluent builder API** - Chainable, type-safe configuration building
- ✅ **Environment presets** - Optional development/production/staging/test presets
- ✅ **Deep merge support** - Combine configs from multiple sources
- ✅ **Production validation** - Security checks for critical secrets
- ✅ **Secret masking** - Safe logging with automatic secret redaction

## Usage in Consuming Projects

### Basic Usage

```typescript
// config/app.config.ts (in your project, NOT in @core)
import { createConfigBuilder } from '@core/config';

export const appConfig = createConfigBuilder()
  .fromEnv()
  .build();
```

### With Preset and Overrides

```typescript
import { createConfigBuilder } from '@core/config';

export const appConfig = createConfigBuilder()
  .preset('production')
  .fromEnv()
  .override({
    logging: { level: 'debug' },
    database: { host: process.env.CUSTOM_DB_HOST }
  })
  .build();
```

### Advanced Builder Usage

```typescript
import { createConfigBuilder } from '@core/config';

const isDevelopment = process.env.NODE_ENV === 'development';

export const appConfig = createConfigBuilder()
  .forProduction()
  .fromEnv()
  .database({
    host: 'prod-db.example.com',
    port: 5432,
    ssl: true,
  })
  .redis({
    host: 'cache.example.com',
    ttl: 7200,
  })
  .when(isDevelopment, (builder) =>
    builder.logging({ level: 'debug', format: 'pretty' })
  )
  .whenEnv('test', (builder) =>
    builder.database({ dropSchema: true })
  )
  .build();
```

### Quick Helpers

```typescript
// Simple config from environment
import { createConfigFromEnv } from '@core/config';
const config = createConfigFromEnv();

// Config from preset with overrides
import { createConfigFromPreset } from '@core/config';
const config = createConfigFromPreset('production', {
  app: { port: 4000 }
});

// Test configuration
import { createTestConfig } from '@core/config';
const testConfig = createTestConfig();
```

## Builder API

### Configuration Sections

- `.app(config)` - Application settings (name, port, cors, etc.)
- `.database(config)` - Database connection settings
- `.auth(config)` - Authentication (JWT, OAuth, bcrypt)
- `.redis(config)` - Redis cache settings
- `.admin(config)` - Admin panel configuration
- `.email(config)` - Email service settings
- `.s3(config)` - S3 storage configuration
- `.rabbitmq(config)` - RabbitMQ settings
- `.logging(config)` - Logging configuration
- `.featureFlags(config)` - Feature toggles

### Loading Methods

- `.fromEnv(prefix?)` - Load from environment variables
- `.fromFile(path)` - Load from JSON file
- `.fromTest()` - Load test preset
- `.preset(name)` - Use environment preset (dev/prod/staging/test)
- `.merge(config)` - Merge with partial config
- `.override(config)` - Override specific values

### Shortcuts

- `.forDevelopment()` - Apply development preset
- `.forProduction()` - Apply production preset
- `.forTest()` - Apply test preset
- `.forStaging()` - Apply staging preset

### Conditional Methods

- `.when(condition, fn)` - Conditionally apply configuration
- `.whenEnv(env, fn)` - Apply if environment matches

### Build Methods

- `.build()` - Validate and return final config (throws on error)
- `.buildUnsafe()` - Return config without validation
- `.peek()` - Inspect current state without building

### Utilities

- `.clone()` - Clone builder state
- `.reset()` - Reset to empty state

## Validation and Logging

```typescript
import {
  validateConfig,
  safeValidateConfig,
  logConfigSafely,
  getConfigSummary
} from '@core/config';

// Validate config (throws on error)
const validated = validateConfig(myConfig);

// Safe validation (returns result object)
const result = safeValidateConfig(myConfig);
if (result.success) {
  console.log('Config is valid:', result.data);
} else {
  console.error('Validation errors:', result.errors);
}

// Log config safely (secrets masked)
logConfigSafely(config);

// Get safe summary for logging
const summary = getConfigSummary(config);
console.log('App started:', summary);
```

## Presets

Available presets: `development`, `production`, `staging`, `test`

```typescript
import { DEVELOPMENT_PRESET, PRODUCTION_PRESET } from '@core/config';

// Use directly
const config = createConfigBuilder()
  .merge(PRODUCTION_PRESET)
  .fromEnv()
  .build();

// Or use preset() method
const config = createConfigBuilder()
  .preset('production')
  .fromEnv()
  .build();
```

## Environment Variables

**IMPORTANT**: Environment variable names are **case-sensitive** and **must match exactly** as shown below. The `loadFromEnv()` function expects these specific names and cannot be customized without modifying the config loader.

See `.env.example` in the project root for a complete template with detailed comments, types, and default values.

### Quick Reference

#### Application
- `APP_NAME` - Application name (string, default: "NestJS Boilerplate")
- `APP_URL` - Backend URL (string, default: "http://localhost:3000")
- `FRONTEND_URL` - Frontend URL (string, default: "http://localhost:3001")
- `PORT` - Server port (number, default: 3000)
- `NODE_ENV` - Environment (string, default: "development")
- `CORS_ORIGIN` - CORS origins (string, default: "*")
- `RATE_LIMIT_MAX` - Max requests per window (number, default: 100)
- `RATE_LIMIT_TTL` - Rate limit window in seconds (number, default: 60)

#### Database
- `DATABASE_HOST` - Database host (string, default: "localhost")
- `DATABASE_PORT` - Database port (number, default: 5432)
- `DATABASE_USERNAME` - Database user (string, default: "postgres")
- `DATABASE_PASSWORD` - Database password (string, default: "postgres")
- `DATABASE_NAME` - Database name (string, default: "nestjs_boilerplate")
- `DATABASE_SSL` - Enable SSL (boolean, default: false)
- `DATABASE_LOGGING` - Enable SQL logging (boolean, default: false)
- `USE_MIGRATIONS` - Use migrations (boolean, default: false) - When true: synchronize=false, migrationsRun=true
- `DATABASE_DROP_SCHEMA` - Drop schema on startup (boolean, default: false) **WARNING: Deletes all data!**
- `RLS_ENABLED` - Enable Row-Level Security (boolean, default: false)

#### Authentication
- `JWT_SECRET` - JWT secret key (string, **required in production**, min 32 chars)
- `JWT_REFRESH_SECRET` - JWT refresh secret (string, **required in production**, min 32 chars)
- `JWT_EXPIRES_IN` - Token expiration (string, default: "15m")
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration (string, default: "7d")
- `BCRYPT_ROUNDS` - Password hashing rounds (number, default: 12)
- `AUTH_MAX_FAILED_ATTEMPTS` - Max failed login attempts (number, default: 5)
- `AUTH_LOCKOUT_DURATION_MINUTES` - Lockout duration (number, default: 30)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (string, optional)
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret (string, optional)
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID (string, optional)
- `GITHUB_CLIENT_SECRET` - GitHub OAuth secret (string, optional)

#### Redis
- `REDIS_HOST` - Redis host (string, default: "localhost")
- `REDIS_PORT` - Redis port (number, default: 6379)
- `REDIS_PASSWORD` - Redis password (string, optional)
- `REDIS_DB` - Redis database number (number, default: 0)
- `CACHE_TTL` - Cache TTL in seconds (number, default: 3600)
- `REDIS_KEY_PREFIX` - Redis key prefix (string, default: "cache:")

#### Admin
- `ADMIN_EMAIL` - Admin email (string, default: "admin@example.com")
- `ADMIN_PASSWORD` - Admin password (string, **required in production**)
- `ADMIN_ALLOWED_IPS` - Allowed IP addresses (comma-separated, optional)

#### Email
- `EMAIL_STATUS` - Enable email sending (string, "enabled" or other, default: disabled)
- `EMAIL_FROM` - From email address (string, default: "noreply@example.com")
- `BREVO_API_KEY` - Brevo API key (string, optional)
- `SMTP_HOST` - SMTP host (string, optional)
- `SMTP_PORT` - SMTP port (number, default: 587)
- `SMTP_SECURE` - Use TLS (boolean, default: true)
- `SMTP_USER` - SMTP username (string, optional)
- `SMTP_PASS` - SMTP password (string, optional)

#### S3 Storage
- `S3_ENDPOINT` - S3 endpoint (string, default: "s3.amazonaws.com")
- `S3_PORT` - S3 port (number, default: 443)
- `S3_USE_SSL` - Use SSL (boolean, default: true)
- `S3_REGION` - S3 region (string, default: "eu-west-3")
- `S3_ACCESS_KEY` - S3 access key (string, default: "")
- `S3_SECRET_KEY` - S3 secret key (string, default: "")
- `S3_BUCKET_NAME` - S3 bucket name (string, default: "nestjs-boilerplate-files")

#### RabbitMQ
- `RABBITMQ_URI` - Full connection URI (string, optional - overrides individual settings)
- `RABBITMQ_USER` - RabbitMQ user (string, default: "guest")
- `RABBITMQ_PASSWORD` - RabbitMQ password (string, default: "guest")
- `RABBITMQ_HOST` - RabbitMQ host (string, default: "localhost")
- `RABBITMQ_PORT` - RabbitMQ port (string, default: "5672")
- `RABBITMQ_VHOST` - RabbitMQ virtual host (string, default: "/")
- `RABBITMQ_EXCHANGE` - Exchange name (string, default: "app.notifications")
- `RABBITMQ_DLX_EXCHANGE` - Dead-letter exchange (string, default: "app.notifications.dlx")

#### Logging
- `LOG_LEVEL` - Log level (string, default: "info") - Values: error, warn, info, debug, verbose
- `LOG_FORMAT` - Log format (string, default: "json") - Values: json, pretty
- `LOG_TRANSPORTS` - Transports (comma-separated, default: "console") - Values: console, file
- `LOG_FILE` - Log file path (string, optional)
- `LOG_MAX_SIZE` - Max log file size (string, default: "10m")
- `LOG_MAX_FILES` - Max log files to keep (number, default: 5)

#### Feature Flags
- `FEATURE_NEW_UI` - Enable new UI (boolean, default: false)
- `FEATURE_BETA` - Enable beta features (boolean, default: false)
- `FEATURE_ANALYTICS` - Enable analytics (boolean, default: true)
- `MAINTENANCE_MODE` - Maintenance mode (boolean, default: false)

### Type Parsing

The config loader automatically parses types:
- **Boolean**: "true", "1", "yes" → true; "false", "0", "no" → false
- **Number**: Parsed with parseInt/parseFloat
- **Array**: Comma-separated values → string array
- **String**: Used as-is

## Architecture

This package exports **helpers only**:
- ✅ Schemas (Zod)
- ✅ Types (inferred from schemas)
- ✅ Builders (fluent API)
- ✅ Loaders (environment, file)
- ✅ Validators (with error messages)
- ✅ Utilities (merge, mask, parse)
- ✅ Presets (optional, not auto-applied)

This package does NOT export:
- ❌ Fixed configuration instances
- ❌ Singleton patterns
- ❌ Auto-initialized configs
- ❌ Module-level side effects

**Configuration values live in the consuming project**, not in this package.
