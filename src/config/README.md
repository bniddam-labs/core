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

The `loadFromEnv()` function maps these environment variables:

### Application
- `APP_NAME`, `APP_URL`, `FRONTEND_URL`, `PORT`, `NODE_ENV`
- `CORS_ORIGIN`, `RATE_LIMIT_MAX`, `RATE_LIMIT_TTL`

### Database
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- `DATABASE_NAME`, `DATABASE_SSL`, `DATABASE_LOGGING`, `RUN_MIGRATIONS`, `RLS_ENABLED`

### Authentication
- `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`
- `BCRYPT_ROUNDS`, `AUTH_MAX_FAILED_ATTEMPTS`, `AUTH_LOCKOUT_DURATION_MINUTES`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

### Redis
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`, `CACHE_TTL`

### Admin
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_ALLOWED_IPS`

### Email
- `EMAIL_STATUS`, `EMAIL_FROM`, `BREVO_API_KEY`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`

### S3 Storage
- `S3_ENDPOINT`, `S3_PORT`, `S3_USE_SSL`, `S3_REGION`
- `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET_NAME`

### RabbitMQ
- `RABBITMQ_URI`, `RABBITMQ_USER`, `RABBITMQ_PASSWORD`, `RABBITMQ_HOST`
- `RABBITMQ_PORT`, `RABBITMQ_VHOST`, `RABBITMQ_EXCHANGE`, `RABBITMQ_DLX_EXCHANGE`

### Logging
- `LOG_LEVEL`, `LOG_FORMAT`, `LOG_TRANSPORTS`, `LOG_FILE`
- `LOG_MAX_SIZE`, `LOG_MAX_FILES`

### Feature Flags
- `FEATURE_NEW_UI`, `FEATURE_BETA`, `FEATURE_ANALYTICS`, `MAINTENANCE_MODE`

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
