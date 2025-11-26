# @bniddam/core

Core infrastructure package for NestJS backend applications, providing configuration management, logging, error handling, and HTTP filters/interceptors.

## Features

- **Configuration**: Type-safe environment configuration with Zod validation
- **Logging**: Structured logging service with customizable log levels
- **Error Handling**: Global exception filters for HTTP and all exceptions
- **HTTP Interceptors**: Logging interceptor for request/response tracking
- **NestJS Integration**: Seamless integration with NestJS framework
- **TypeScript**: Full type safety and IntelliSense support

## Installation

### Using pnpm link (local development)

```bash
# Make sure @bniddam/utils is linked first
cd /path/to/@bniddam/utils
pnpm install && pnpm build && pnpm link --global

# In @bniddam/core directory
pnpm install
pnpm link --global @bniddam/utils
pnpm build
pnpm link --global

# In your project
pnpm link --global @bniddam/core @bniddam/utils
```

### Using npm/pnpm (when published)

```bash
pnpm add @bniddam/core @bniddam/utils
# or
npm install @bniddam/core @bniddam/utils
```

## Usage

### Configuration

```typescript
import { ConfigModule } from '@nestjs/config';
import { loadAppConfig, validateEnv } from '@bniddam/core/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadAppConfig],
      validate: validateEnv,
    }),
  ],
})
export class AppModule {}
```

Define your configuration schema:

```typescript
import { z } from 'zod';
import { createConfigLoader } from '@bniddam/core/config';

const AppConfigSchema = z.object({
  port: z.number().default(3000),
  database: z.object({
    host: z.string(),
    port: z.number(),
    name: z.string(),
  }),
  jwt: z.object({
    secret: z.string(),
    expiresIn: z.string().default('15m'),
  }),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
export const loadAppConfig = createConfigLoader('app', AppConfigSchema);
```

### Logging

```typescript
import { AppLoggerService } from '@bniddam/core/logging';

@Injectable()
export class UserService {
  constructor(private readonly logger: AppLoggerService) {
    this.logger.setContext(UserService.name);
  }

  async createUser(data: CreateUserDto) {
    this.logger.log('Creating user', { email: data.email });

    try {
      // ... create user logic
      this.logger.log('User created successfully', { userId: user.id });
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error.stack, {
        email: data.email
      });
      throw error;
    }
  }
}
```

### HTTP Filters

```typescript
import {
  AllExceptionsFilter,
  HttpExceptionFilter
} from '@bniddam/core/http';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

### HTTP Interceptors

```typescript
import { LoggingInterceptor } from '@bniddam/core/http';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```

## API Reference

### Configuration (`@bniddam/core/config`)

- `createConfigLoader(namespace, schema)` - Create a configuration loader with validation
- `validateEnv(config)` - Validate environment variables
- `AppConfigType` - Base configuration type interface

### Logging (`@bniddam/core/logging`)

- `AppLoggerService` - Main logger service
  - `log(message, metadata?)` - Log info message
  - `error(message, trace?, metadata?)` - Log error message
  - `warn(message, metadata?)` - Log warning message
  - `debug(message, metadata?)` - Log debug message
  - `verbose(message, metadata?)` - Log verbose message
  - `setContext(context)` - Set logger context

### HTTP Filters (`@bniddam/core/http`)

- `AllExceptionsFilter` - Catches all exceptions and formats responses
- `HttpExceptionFilter` - Catches HTTP exceptions and formats responses

### HTTP Interceptors (`@bniddam/core/http`)

- `LoggingInterceptor` - Logs all HTTP requests and responses with timing

## Peer Dependencies

This package requires the following peer dependencies:

- `@nestjs/common`: ^11.0.0
- `@nestjs/core`: ^11.0.0

Make sure to install them in your project:

```bash
pnpm add @nestjs/common @nestjs/core
```

## Development

```bash
# Install dependencies
pnpm install

# Link @bniddam/utils (required)
pnpm link --global @bniddam/utils

# Build the package
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format
```

## Requirements

- Node.js >= 20
- pnpm >= 9
- NestJS >= 11

## License

MIT © bniddam
