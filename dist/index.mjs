import { z, ZodError } from 'zod';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var DatabaseConfigSchema = z.object({
  type: z.literal("postgres").default("postgres"),
  host: z.string(),
  port: z.number().int().positive(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
  synchronize: z.boolean().default(false),
  dropSchema: z.boolean().optional(),
  logging: z.boolean().default(false),
  ssl: z.boolean().optional(),
  autoLoadEntities: z.boolean().default(true),
  migrationsRun: z.boolean().default(false),
  rlsEnabled: z.boolean().default(false)
});
var OAuthProviderSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string()
});
var AuthConfigSchema = z.object({
  jwtSecret: z.string().min(32, "JWT secret must be at least 32 characters"),
  jwtRefreshSecret: z.string().min(32, "JWT refresh secret must be at least 32 characters"),
  jwtExpiresIn: z.string().default("15m"),
  jwtRefreshExpiresIn: z.string().default("7d"),
  bcryptRounds: z.number().int().min(10).max(20).default(12),
  maxFailedAttempts: z.number().int().positive().default(5),
  lockoutDurationMinutes: z.number().int().positive().default(30),
  google: OAuthProviderSchema.optional(),
  github: OAuthProviderSchema.optional()
});
var RedisConfigSchema = z.object({
  host: z.string(),
  port: z.number().int().positive(),
  password: z.string().optional(),
  db: z.number().int().nonnegative().default(0),
  ttl: z.number().int().positive().default(3600),
  keyPrefix: z.string().default("cache:")
});
var AppConfigSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  port: z.number().int().positive(),
  nodeEnv: z.enum(["development", "production", "test", "staging"]).default("development"),
  corsOrigin: z.string().default("*"),
  frontendUrl: z.string().url(),
  rateLimitMax: z.number().int().positive().default(100),
  rateLimitTtl: z.number().int().positive().default(60)
});
var AdminConfigSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12, "Admin password must be at least 12 characters"),
  allowedIps: z.array(z.string()).optional()
});
var EmailConfigSchema = z.object({
  enabled: z.boolean().default(false),
  from: z.string().email(),
  brevoApiKey: z.string().optional(),
  smtp: z.object({
    host: z.string(),
    port: z.number().int(),
    secure: z.boolean().default(true),
    auth: z.object({
      user: z.string(),
      pass: z.string()
    })
  }).optional()
});
var S3ConfigSchema = z.object({
  endpoint: z.string(),
  port: z.number().int().positive(),
  useSSL: z.boolean().default(true),
  region: z.string(),
  accessKey: z.string(),
  secretKey: z.string(),
  bucketName: z.string()
});
var RabbitMQConfigSchema = z.object({
  uri: z.string().url(),
  exchange: z.string(),
  dlxExchange: z.string(),
  connectionInitOptions: z.object({
    wait: z.boolean().default(true),
    timeout: z.number().int().positive().default(1e4),
    reject: z.boolean().default(true)
  }).optional()
});
var LoggingConfigSchema = z.object({
  level: z.enum(["debug", "info", "warn", "error"]).default("info"),
  format: z.enum(["json", "pretty"]).default("json"),
  transports: z.array(z.enum(["console", "file"])).default(["console"]),
  fileConfig: z.object({
    filename: z.string(),
    maxSize: z.string().default("10m"),
    maxFiles: z.number().int().default(5)
  }).optional()
});
var FeatureFlagsConfigSchema = z.object({
  enableNewUI: z.boolean().default(false),
  enableBetaFeatures: z.boolean().default(false),
  enableAnalytics: z.boolean().default(true),
  maintenanceMode: z.boolean().default(false)
});
var ConfigurationSchema = z.object({
  app: AppConfigSchema,
  database: DatabaseConfigSchema,
  auth: AuthConfigSchema,
  redis: RedisConfigSchema,
  admin: AdminConfigSchema,
  email: EmailConfigSchema,
  s3: S3ConfigSchema,
  rabbitmq: RabbitMQConfigSchema,
  logging: LoggingConfigSchema.optional(),
  featureFlags: FeatureFlagsConfigSchema.optional()
});

// src/config/defaults.ts
var DEVELOPMENT_PRESET = {
  app: {
    nodeEnv: "development",
    corsOrigin: "*",
    rateLimitMax: 1e3,
    rateLimitTtl: 60
  },
  database: {
    synchronize: true,
    dropSchema: false,
    // Don't drop schema by default, let user decide
    logging: true,
    ssl: false,
    migrationsRun: false,
    rlsEnabled: false
  },
  logging: {
    level: "debug",
    format: "pretty",
    transports: ["console"]
  },
  featureFlags: {
    enableNewUI: true,
    enableBetaFeatures: true,
    enableAnalytics: false,
    maintenanceMode: false
  }
};
var PRODUCTION_PRESET = {
  app: {
    nodeEnv: "production",
    corsOrigin: "",
    // Should be overridden with specific domains
    rateLimitMax: 100,
    rateLimitTtl: 60
  },
  database: {
    synchronize: false,
    // Never auto-sync in production
    dropSchema: false,
    logging: false,
    ssl: true,
    migrationsRun: true,
    rlsEnabled: true
  },
  logging: {
    level: "info",
    format: "json",
    transports: ["console", "file"]
  },
  featureFlags: {
    enableNewUI: false,
    enableBetaFeatures: false,
    enableAnalytics: true,
    maintenanceMode: false
  }
};
var STAGING_PRESET = {
  app: {
    nodeEnv: "staging",
    corsOrigin: "*",
    rateLimitMax: 200,
    rateLimitTtl: 60
  },
  database: {
    synchronize: false,
    dropSchema: false,
    logging: true,
    ssl: true,
    migrationsRun: true,
    rlsEnabled: true
  },
  logging: {
    level: "debug",
    format: "json",
    transports: ["console"]
  },
  featureFlags: {
    enableNewUI: true,
    enableBetaFeatures: true,
    enableAnalytics: true,
    maintenanceMode: false
  }
};
var TEST_PRESET = {
  app: {
    nodeEnv: "test",
    corsOrigin: "*",
    rateLimitMax: 1e4,
    rateLimitTtl: 60
  },
  database: {
    synchronize: true,
    dropSchema: true,
    logging: false,
    ssl: false,
    migrationsRun: false,
    rlsEnabled: false
  },
  logging: {
    level: "error",
    format: "json",
    transports: ["console"]
  },
  featureFlags: {
    enableNewUI: false,
    enableBetaFeatures: false,
    enableAnalytics: false,
    maintenanceMode: false
  }
};
function getPreset(preset) {
  switch (preset) {
    case "development":
      return DEVELOPMENT_PRESET;
    case "production":
      return PRODUCTION_PRESET;
    case "staging":
      return STAGING_PRESET;
    case "test":
      return TEST_PRESET;
    default:
      throw new Error(`Unknown preset: ${preset}`);
  }
}
var DEFAULT_DATABASE_CONFIG = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "app",
  synchronize: false,
  logging: false,
  autoLoadEntities: true,
  migrationsRun: false,
  rlsEnabled: false
};
var DEFAULT_REDIS_CONFIG = {
  host: "localhost",
  port: 6379,
  db: 0,
  ttl: 3600,
  keyPrefix: "cache:"
};
var DEFAULT_JWT_CONFIG = {
  jwtExpiresIn: "15m",
  jwtRefreshExpiresIn: "7d",
  bcryptRounds: 12,
  maxFailedAttempts: 5,
  lockoutDurationMinutes: 30
};
var DEFAULT_RATE_LIMIT = {
  max: 100,
  ttl: 60
};
var DEFAULT_LOGGING_CONFIG = {
  level: "info",
  format: "json",
  transports: ["console"]
};

// src/config/utils.ts
function deepMerge(target, source) {
  const output = __spreadValues({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
function maskSecrets(config2) {
  const sensitiveKeys = [
    "password",
    "secret",
    "apikey",
    "token",
    "secretkey",
    "accesskey",
    "clientsecret",
    "auth"
  ];
  const mask = (obj) => {
    if (!isObject(obj)) return obj;
    const masked = __spreadValues({}, obj);
    Object.keys(masked).forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
        masked[key] = "***REDACTED***";
      } else if (isObject(masked[key])) {
        masked[key] = mask(masked[key]);
      }
    });
    return masked;
  };
  return mask(config2);
}
function parseBoolean(value, defaultValue = false) {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase().trim();
  if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
  if (normalized === "false" || normalized === "0" || normalized === "no") return false;
  return defaultValue;
}
function parseNumber(value, defaultValue) {
  if (!value) return defaultValue;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}
function parseArray(value, defaultValue = []) {
  if (!value) return defaultValue;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
function requireEnv(key, errorMessage) {
  const value = process.env[key];
  if (!value) {
    throw new Error(errorMessage || `Required environment variable ${key} is not set`);
  }
  return value;
}
function getEnv(key, defaultValue) {
  return process.env[key] || defaultValue;
}
function validateProductionSecrets(config2) {
  var _a, _b, _c, _d, _e;
  if (((_a = config2.app) == null ? void 0 : _a.nodeEnv) !== "production") {
    return;
  }
  if (!((_b = config2.auth) == null ? void 0 : _b.jwtSecret) || config2.auth.jwtSecret.length < 32) {
    throw new Error("SECURITY ERROR: JWT_SECRET must be set with at least 32 characters in production");
  }
  if (!((_c = config2.auth) == null ? void 0 : _c.jwtRefreshSecret) || config2.auth.jwtRefreshSecret.length < 32) {
    throw new Error(
      "SECURITY ERROR: JWT_REFRESH_SECRET must be set with at least 32 characters in production"
    );
  }
  if (!((_d = config2.admin) == null ? void 0 : _d.password) || config2.admin.password === "change-me-in-production" || config2.admin.password.length < 12) {
    throw new Error(
      "SECURITY ERROR: ADMIN_PASSWORD must be set to a strong password (at least 12 characters) in production"
    );
  }
  if (!((_e = config2.database) == null ? void 0 : _e.password) || config2.database.password === "postgres") {
    throw new Error("SECURITY ERROR: DATABASE_PASSWORD must be set to a strong password in production");
  }
}

// src/config/loaders.ts
function loadDotEnv(envFilePath = ".env", override = false) {
  const resolvedPath = path.resolve(process.cwd(), envFilePath);
  if (fs.existsSync(resolvedPath)) {
    dotenv.config({ path: resolvedPath, override });
  }
}
function loadFromEnv(prefix = "") {
  const prefixKey = (key) => `${prefix}${key}`;
  return {
    app: {
      name: getEnv(prefixKey("APP_NAME"), "NestJS Boilerplate"),
      url: getEnv(prefixKey("APP_URL"), "http://localhost:3000"),
      frontendUrl: getEnv(prefixKey("FRONTEND_URL"), "http://localhost:3001"),
      port: parseNumber(process.env[prefixKey("PORT")], 3e3),
      nodeEnv: process.env[prefixKey("NODE_ENV")] || "development",
      corsOrigin: getEnv(prefixKey("CORS_ORIGIN"), "*"),
      rateLimitMax: parseNumber(process.env[prefixKey("RATE_LIMIT_MAX")], 100),
      rateLimitTtl: parseNumber(process.env[prefixKey("RATE_LIMIT_TTL")], 60)
    },
    database: {
      type: "postgres",
      host: getEnv(prefixKey("DATABASE_HOST"), "localhost"),
      port: parseNumber(process.env[prefixKey("DATABASE_PORT")], 5432),
      username: getEnv(prefixKey("DATABASE_USERNAME"), "postgres"),
      password: getEnv(prefixKey("DATABASE_PASSWORD"), "postgres"),
      database: getEnv(prefixKey("DATABASE_NAME"), "nestjs_boilerplate"),
      synchronize: !parseBoolean(process.env[prefixKey("USE_MIGRATIONS")], false),
      dropSchema: parseBoolean(process.env[prefixKey("DATABASE_DROP_SCHEMA")], false),
      logging: parseBoolean(process.env[prefixKey("DATABASE_LOGGING")], false),
      ssl: parseBoolean(process.env[prefixKey("DATABASE_SSL")], false),
      autoLoadEntities: true,
      migrationsRun: parseBoolean(process.env[prefixKey("USE_MIGRATIONS")], false),
      rlsEnabled: parseBoolean(process.env[prefixKey("RLS_ENABLED")], false)
    },
    auth: __spreadValues(__spreadValues({
      jwtSecret: getEnv(prefixKey("JWT_SECRET"), "jwt-secret-key-DEVELOPMENT-ONLY"),
      jwtRefreshSecret: getEnv(prefixKey("JWT_REFRESH_SECRET"), "jwt-refresh-secret-key-DEVELOPMENT-ONLY"),
      jwtExpiresIn: getEnv(prefixKey("JWT_EXPIRES_IN"), "15m"),
      jwtRefreshExpiresIn: getEnv(prefixKey("JWT_REFRESH_EXPIRES_IN"), "7d"),
      bcryptRounds: parseNumber(process.env[prefixKey("BCRYPT_ROUNDS")], 12),
      maxFailedAttempts: parseNumber(process.env[prefixKey("AUTH_MAX_FAILED_ATTEMPTS")], 5),
      lockoutDurationMinutes: parseNumber(process.env[prefixKey("AUTH_LOCKOUT_DURATION_MINUTES")], 30)
    }, process.env[prefixKey("GOOGLE_CLIENT_ID")] && process.env[prefixKey("GOOGLE_CLIENT_SECRET")] ? {
      google: {
        clientId: process.env[prefixKey("GOOGLE_CLIENT_ID")],
        clientSecret: process.env[prefixKey("GOOGLE_CLIENT_SECRET")]
      }
    } : {}), process.env[prefixKey("GITHUB_CLIENT_ID")] && process.env[prefixKey("GITHUB_CLIENT_SECRET")] ? {
      github: {
        clientId: process.env[prefixKey("GITHUB_CLIENT_ID")],
        clientSecret: process.env[prefixKey("GITHUB_CLIENT_SECRET")]
      }
    } : {}),
    redis: {
      host: getEnv(prefixKey("REDIS_HOST"), "localhost"),
      port: parseNumber(process.env[prefixKey("REDIS_PORT")], 6379),
      password: process.env[prefixKey("REDIS_PASSWORD")],
      db: parseNumber(process.env[prefixKey("REDIS_DB")], 0),
      ttl: parseNumber(process.env[prefixKey("CACHE_TTL")], 3600),
      keyPrefix: getEnv(prefixKey("REDIS_KEY_PREFIX"), "cache:")
    },
    admin: {
      email: getEnv(prefixKey("ADMIN_EMAIL"), "admin@example.com"),
      password: getEnv(prefixKey("ADMIN_PASSWORD"), "change-me-in-production"),
      allowedIps: process.env[prefixKey("ADMIN_ALLOWED_IPS")] ? parseArray(process.env[prefixKey("ADMIN_ALLOWED_IPS")]) : void 0
    },
    email: __spreadValues({
      enabled: process.env[prefixKey("EMAIL_STATUS")] === "enabled",
      from: getEnv(prefixKey("EMAIL_FROM"), "noreply@example.com"),
      brevoApiKey: process.env[prefixKey("BREVO_API_KEY")]
    }, process.env[prefixKey("SMTP_HOST")] ? {
      smtp: {
        host: process.env[prefixKey("SMTP_HOST")],
        port: parseNumber(process.env[prefixKey("SMTP_PORT")], 587),
        secure: parseBoolean(process.env[prefixKey("SMTP_SECURE")], true),
        auth: {
          user: getEnv(prefixKey("SMTP_USER"), ""),
          pass: getEnv(prefixKey("SMTP_PASS"), "")
        }
      }
    } : {}),
    s3: {
      endpoint: getEnv(prefixKey("S3_ENDPOINT"), "s3.amazonaws.com"),
      port: parseNumber(process.env[prefixKey("S3_PORT")], 443),
      useSSL: parseBoolean(process.env[prefixKey("S3_USE_SSL")], true),
      region: getEnv(prefixKey("S3_REGION"), "eu-west-3"),
      accessKey: getEnv(prefixKey("S3_ACCESS_KEY"), ""),
      secretKey: getEnv(prefixKey("S3_SECRET_KEY"), ""),
      bucketName: getEnv(prefixKey("S3_BUCKET_NAME"), "nestjs-boilerplate-files")
    },
    rabbitmq: {
      uri: process.env[prefixKey("RABBITMQ_URI")] || `amqp://${getEnv(prefixKey("RABBITMQ_USER"), "guest")}:${getEnv(prefixKey("RABBITMQ_PASSWORD"), "guest")}@${getEnv(prefixKey("RABBITMQ_HOST"), "localhost")}:${getEnv(prefixKey("RABBITMQ_PORT"), "5672")}${process.env[prefixKey("RABBITMQ_VHOST")] && process.env[prefixKey("RABBITMQ_VHOST")] !== "/" ? `/${process.env[prefixKey("RABBITMQ_VHOST")]}` : ""}`,
      exchange: getEnv(prefixKey("RABBITMQ_EXCHANGE"), "app.notifications"),
      dlxExchange: getEnv(prefixKey("RABBITMQ_DLX_EXCHANGE"), "app.notifications.dlx"),
      connectionInitOptions: {
        wait: process.env[prefixKey("NODE_ENV")] !== "test",
        timeout: 1e4,
        reject: true
      }
    },
    logging: __spreadValues({
      level: getEnv(prefixKey("LOG_LEVEL"), "info") || "info",
      format: getEnv(prefixKey("LOG_FORMAT"), "json") || "json",
      transports: parseArray(process.env[prefixKey("LOG_TRANSPORTS")], ["console"])
    }, process.env[prefixKey("LOG_FILE")] ? {
      fileConfig: {
        filename: process.env[prefixKey("LOG_FILE")],
        maxSize: getEnv(prefixKey("LOG_MAX_SIZE"), "10m"),
        maxFiles: parseNumber(process.env[prefixKey("LOG_MAX_FILES")], 5)
      }
    } : {}),
    featureFlags: {
      enableNewUI: parseBoolean(process.env[prefixKey("FEATURE_NEW_UI")], false),
      enableBetaFeatures: parseBoolean(process.env[prefixKey("FEATURE_BETA")], false),
      enableAnalytics: parseBoolean(process.env[prefixKey("FEATURE_ANALYTICS")], true),
      maintenanceMode: parseBoolean(process.env[prefixKey("MAINTENANCE_MODE")], false)
    }
  };
}
function loadFromFile(filePath) {
  try {
    const fileContent = __require(filePath);
    return fileContent;
  } catch (error) {
    throw new Error(`Failed to load configuration from file ${filePath}: ${error}`);
  }
}
function loadTestConfig() {
  return {
    app: {
      name: "Test App",
      url: "http://localhost:3000",
      frontendUrl: "http://localhost:3001",
      port: 3e3,
      nodeEnv: "test",
      corsOrigin: "*",
      rateLimitMax: 1e3,
      rateLimitTtl: 60
    },
    database: {
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "test",
      password: "test",
      database: "test_db",
      synchronize: true,
      dropSchema: true,
      logging: false,
      autoLoadEntities: true,
      migrationsRun: false,
      rlsEnabled: false
    },
    auth: {
      jwtSecret: "test-jwt-secret-32-characters-long-for-testing",
      jwtRefreshSecret: "test-refresh-secret-32-characters-long-for-testing",
      jwtExpiresIn: "15m",
      jwtRefreshExpiresIn: "7d",
      bcryptRounds: 10,
      maxFailedAttempts: 5,
      lockoutDurationMinutes: 30
    },
    redis: {
      host: "localhost",
      port: 6379,
      db: 1,
      ttl: 3600,
      keyPrefix: "test:"
    },
    admin: {
      email: "admin@test.com",
      password: "test-admin-password-secure"
    },
    email: {
      enabled: false,
      from: "test@example.com"
    },
    s3: {
      endpoint: "s3.amazonaws.com",
      port: 443,
      useSSL: true,
      region: "eu-west-3",
      accessKey: "test-access-key",
      secretKey: "test-secret-key",
      bucketName: "test-bucket"
    },
    rabbitmq: {
      uri: "amqp://guest:guest@localhost:5672",
      exchange: "test.exchange",
      dlxExchange: "test.exchange.dlx",
      connectionInitOptions: {
        wait: false,
        timeout: 1e4,
        reject: true
      }
    },
    logging: {
      level: "error",
      format: "json",
      transports: ["console"]
    },
    featureFlags: {
      enableNewUI: false,
      enableBetaFeatures: false,
      enableAnalytics: false,
      maintenanceMode: false
    }
  };
}
function validateConfig(config2) {
  try {
    const validated = ConfigurationSchema.parse(config2);
    validateProductionSecrets(validated);
    return validated;
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((err) => `  - ${err.path.join(".")}: ${err.message}`).join("\n");
      throw new Error(`Configuration validation failed:
${errorMessages}`);
    }
    throw error;
  }
}
function safeValidateConfig(config2) {
  try {
    const validated = validateConfig(config2);
    return {
      success: true,
      data: validated
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        errors: error.message.split("\n").filter(Boolean)
      };
    }
    return {
      success: false,
      errors: ["Unknown validation error"]
    };
  }
}
function validatePartialConfig(config2) {
  const result = ConfigurationSchema.partial().safeParse(config2);
  if (!result.success) {
    const errorMessages = result.error.errors.map((err) => `  - ${err.path.join(".")}: ${err.message}`).join("\n");
    throw new Error(`Partial configuration validation failed:
${errorMessages}`);
  }
  return true;
}
function logConfigSafely(config2, logger = console.log) {
  const masked = maskSecrets(config2);
  logger(`Configuration loaded:
${JSON.stringify(masked, null, 2)}`);
}
function getConfigSummary(config2) {
  return {
    environment: config2.app.nodeEnv,
    appName: config2.app.name,
    port: config2.app.port,
    database: {
      host: config2.database.host,
      port: config2.database.port,
      database: config2.database.database,
      ssl: config2.database.ssl
    },
    redis: {
      host: config2.redis.host,
      port: config2.redis.port,
      db: config2.redis.db
    },
    features: config2.featureFlags,
    logging: config2.logging
  };
}

// src/config/builder.ts
var ConfigBuilder = class _ConfigBuilder {
  constructor() {
    this.config = {};
  }
  /**
   * Set environment (development, staging, production, test)
   */
  environment(env) {
    if (!this.config.app) {
      this.config.app = {};
    }
    this.config.app.nodeEnv = env;
    return this;
  }
  /**
   * Configure application settings
   */
  app(config2) {
    this.config.app = deepMerge(this.config.app || {}, config2);
    return this;
  }
  /**
   * Configure database connection
   */
  database(config2) {
    this.config.database = deepMerge(this.config.database || {}, config2);
    return this;
  }
  /**
   * Configure authentication
   */
  auth(config2) {
    this.config.auth = deepMerge(this.config.auth || {}, config2);
    return this;
  }
  /**
   * Configure Redis cache
   */
  redis(config2) {
    this.config.redis = deepMerge(this.config.redis || {}, config2);
    return this;
  }
  /**
   * Configure admin panel
   */
  admin(config2) {
    this.config.admin = deepMerge(this.config.admin || {}, config2);
    return this;
  }
  /**
   * Configure email service
   */
  email(config2) {
    this.config.email = deepMerge(this.config.email || {}, config2);
    return this;
  }
  /**
   * Configure S3 storage
   */
  s3(config2) {
    this.config.s3 = deepMerge(this.config.s3 || {}, config2);
    return this;
  }
  /**
   * Configure RabbitMQ
   */
  rabbitmq(config2) {
    this.config.rabbitmq = deepMerge(this.config.rabbitmq || {}, config2);
    return this;
  }
  /**
   * Configure logging
   */
  logging(config2) {
    this.config.logging = deepMerge(this.config.logging || {}, config2);
    return this;
  }
  /**
   * Configure feature flags
   */
  featureFlags(config2) {
    this.config.featureFlags = deepMerge(this.config.featureFlags || {}, config2);
    return this;
  }
  /**
   * Load .env file and then load configuration from environment variables
   * @param envFilePath - Path to .env file (defaults to .env in current directory)
   * @param prefix - Optional prefix for environment variables (e.g., 'APP_')
   * @param override - Whether to override existing environment variables
   */
  fromDotEnv(envFilePath = ".env", prefix = "", override = false) {
    loadDotEnv(envFilePath, override);
    return this.fromEnv(prefix);
  }
  /**
   * Load configuration from environment variables
   * @param prefix - Optional prefix for environment variables (e.g., 'APP_')
   */
  fromEnv(prefix = "") {
    const envConfig = loadFromEnv(prefix);
    this.config = deepMerge(this.config, envConfig);
    return this;
  }
  /**
   * Load configuration from a JSON file
   * @param filePath - Path to JSON config file
   */
  fromFile(filePath) {
    const fileConfig = loadFromFile(filePath);
    this.config = deepMerge(this.config, fileConfig);
    return this;
  }
  /**
   * Load test configuration preset
   */
  fromTest() {
    const testConfig = loadTestConfig();
    this.config = deepMerge(this.config, testConfig);
    return this;
  }
  /**
   * Merge with another configuration object
   * @param config - Configuration to merge
   */
  merge(config2) {
    this.config = deepMerge(this.config, config2);
    return this;
  }
  /**
   * Override specific values (alias for merge)
   * @param config - Configuration to override
   */
  override(config2) {
    this.config = deepMerge(this.config, config2);
    return this;
  }
  /**
   * Use a preset configuration (development, production, test, staging)
   * @param preset - Preset name
   */
  preset(preset) {
    const presetConfig = getPreset(preset);
    this.config = deepMerge(this.config, presetConfig);
    return this;
  }
  /**
   * Conditionally apply configuration
   * @param condition - Boolean condition
   * @param fn - Function to apply if condition is true
   */
  when(condition, fn) {
    if (condition) {
      fn(this);
    }
    return this;
  }
  /**
   * Conditionally apply configuration based on environment
   * @param env - Environment to check
   * @param fn - Function to apply if environment matches
   */
  whenEnv(env, fn) {
    var _a;
    if (((_a = this.config.app) == null ? void 0 : _a.nodeEnv) === env) {
      fn(this);
    }
    return this;
  }
  /**
   * Enable development mode optimizations
   */
  forDevelopment() {
    return this.preset("development");
  }
  /**
   * Enable production mode optimizations
   */
  forProduction() {
    return this.preset("production");
  }
  /**
   * Enable test mode optimizations
   */
  forTest() {
    return this.preset("test");
  }
  /**
   * Enable staging mode optimizations
   */
  forStaging() {
    return this.preset("staging");
  }
  /**
   * Build and validate the final configuration
   * @returns Validated configuration
   * @throws Error if validation fails
   */
  build() {
    return validateConfig(this.config);
  }
  /**
   * Build without validation (unsafe, use for debugging)
   * @returns Partial configuration without validation
   */
  buildUnsafe() {
    return this.config;
  }
  /**
   * Get current config state (for inspection)
   * @returns Copy of current configuration state
   */
  peek() {
    return __spreadValues({}, this.config);
  }
  /**
   * Reset builder to empty state
   */
  reset() {
    this.config = {};
    return this;
  }
  /**
   * Clone the current builder state
   * @returns New builder with same configuration
   */
  clone() {
    const newBuilder = new _ConfigBuilder();
    newBuilder.config = __spreadValues({}, this.config);
    return newBuilder;
  }
};
function createConfigBuilder() {
  return new ConfigBuilder();
}
function createConfigFromDotEnv(envFilePath = ".env", prefix = "", override = false) {
  return createConfigBuilder().fromDotEnv(envFilePath, prefix, override).build();
}
function createConfigFromEnv(prefix = "") {
  return createConfigBuilder().fromEnv(prefix).build();
}
function createConfigFromPreset(preset, overrides) {
  const builder = createConfigBuilder().preset(preset);
  if (overrides) {
    builder.merge(overrides);
  }
  return builder.build();
}
function createTestConfig() {
  return createConfigBuilder().fromTest().build();
}

// src/logging/console-logger.ts
var COLORS = {
  reset: "\x1B[0m",
  log: "\x1B[32m",
  // Green
  error: "\x1B[31m",
  // Red
  warn: "\x1B[33m",
  // Yellow
  debug: "\x1B[35m",
  // Magenta
  verbose: "\x1B[36m",
  // Cyan
  context: "\x1B[34m"
  // Blue
};
var ConsoleLogger = class _ConsoleLogger {
  constructor(context, config2) {
    this.context = "App";
    var _a, _b, _c, _d, _e;
    if (context) {
      this.context = context;
    }
    this.config = {
      json: (_a = config2 == null ? void 0 : config2.json) != null ? _a : false,
      timestampFormat: (_b = config2 == null ? void 0 : config2.timestampFormat) != null ? _b : "ISO",
      levels: (_c = config2 == null ? void 0 : config2.levels) != null ? _c : ["log", "error", "warn", "debug", "verbose"],
      colors: (_d = config2 == null ? void 0 : config2.colors) != null ? _d : true,
      includeTimestamp: (_e = config2 == null ? void 0 : config2.includeTimestamp) != null ? _e : true
    };
  }
  /**
   * Set context for all subsequent logs
   */
  setContext(context) {
    this.context = context;
  }
  /**
   * Get current context
   */
  getContext() {
    return this.context;
  }
  /**
   * Log informational message
   */
  log(message, metadata) {
    this.writeLog("log", message, metadata);
  }
  /**
   * Log error message
   */
  error(message, trace, metadata) {
    const meta = trace ? __spreadProps(__spreadValues({}, metadata), { trace }) : metadata;
    this.writeLog("error", message, meta);
  }
  /**
   * Log warning message
   */
  warn(message, metadata) {
    this.writeLog("warn", message, metadata);
  }
  /**
   * Log debug message
   */
  debug(message, metadata) {
    this.writeLog("debug", message, metadata);
  }
  /**
   * Log verbose message
   */
  verbose(message, metadata) {
    this.writeLog("verbose", message, metadata);
  }
  /**
   * Log business event with structured data
   */
  logEvent(event, data) {
    this.log(`Event: ${event}`, __spreadValues({ event }, data));
  }
  /**
   * Log database query execution
   */
  logQuery(query, duration, params) {
    this.debug("Database query executed", {
      type: "database",
      query,
      duration,
      params
    });
  }
  /**
   * Log HTTP request
   */
  logHttpRequest(method, url, statusCode, duration) {
    const level = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "log";
    this.writeLog(level, `HTTP ${method} ${url} ${statusCode}`, {
      type: "http",
      method,
      url,
      statusCode,
      duration
    });
  }
  /**
   * Log authentication event
   */
  logAuth(event, userId, metadata) {
    this.log(`Auth event: ${event}`, __spreadValues({
      type: "auth",
      event,
      userId
    }, metadata));
  }
  /**
   * Log security event
   */
  logSecurity(event, severity, metadata) {
    const level = severity === "critical" || severity === "high" ? "error" : "warn";
    this.writeLog(level, `Security event: ${event}`, __spreadValues({
      type: "security",
      event,
      severity
    }, metadata));
  }
  /**
   * Core logging method that handles formatting and output
   */
  writeLog(level, message, metadata) {
    if (!this.config.levels.includes(level)) {
      return;
    }
    if (this.config.json) {
      this.writeJsonLog(level, message, metadata);
    } else {
      this.writeTextLog(level, message, metadata);
    }
  }
  /**
   * Write log in JSON format
   */
  writeJsonLog(level, message, metadata) {
    const logEntry = __spreadValues({
      timestamp: this.getTimestamp(),
      level,
      context: this.context,
      message
    }, metadata && { metadata });
    const output = JSON.stringify(logEntry);
    this.writeToConsole(level, output);
  }
  /**
   * Write log in text format
   */
  writeTextLog(level, message, metadata) {
    const timestamp = this.config.includeTimestamp ? `[${this.getTimestamp()}] ` : "";
    const contextStr = `[${this.context}]`;
    const levelStr = level.toUpperCase().padEnd(7);
    const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : "";
    let output;
    if (this.config.colors && !this.config.json) {
      const levelColor = COLORS[level] || COLORS.reset;
      output = `${timestamp}${levelColor}${levelStr}${COLORS.reset} ${COLORS.context}${contextStr}${COLORS.reset} ${message}${metadataStr}`;
    } else {
      output = `${timestamp}${levelStr} ${contextStr} ${message}${metadataStr}`;
    }
    this.writeToConsole(level, output);
  }
  /**
   * Write to appropriate console stream based on level
   */
  writeToConsole(level, message) {
    switch (level) {
      case "error":
        console.error(message);
        break;
      case "warn":
        console.warn(message);
        break;
      case "debug":
      case "verbose":
        console.debug(message);
        break;
      default:
        console.log(message);
    }
  }
  /**
   * Get formatted timestamp based on config
   */
  getTimestamp() {
    const now = /* @__PURE__ */ new Date();
    switch (this.config.timestampFormat) {
      case "unix":
        return now.getTime().toString();
      case "locale":
        return now.toLocaleString();
      case "ISO":
      default:
        return now.toISOString();
    }
  }
  /**
   * Create a child logger with a new context
   * Useful for creating scoped loggers while sharing the same configuration
   */
  createChild(context) {
    return new _ConsoleLogger(context, this.config);
  }
  /**
   * Update logger configuration
   */
  updateConfig(config2) {
    var _a;
    this.config = __spreadProps(__spreadValues(__spreadValues({}, this.config), config2), {
      levels: (_a = config2.levels) != null ? _a : this.config.levels
    });
  }
};

export { AdminConfigSchema, AppConfigSchema, AuthConfigSchema, ConfigBuilder, ConfigurationSchema, ConsoleLogger, DEFAULT_DATABASE_CONFIG, DEFAULT_JWT_CONFIG, DEFAULT_LOGGING_CONFIG, DEFAULT_RATE_LIMIT, DEFAULT_REDIS_CONFIG, DEVELOPMENT_PRESET, DatabaseConfigSchema, EmailConfigSchema, FeatureFlagsConfigSchema, LoggingConfigSchema, OAuthProviderSchema, PRODUCTION_PRESET, RabbitMQConfigSchema, RedisConfigSchema, S3ConfigSchema, STAGING_PRESET, TEST_PRESET, createConfigBuilder, createConfigFromDotEnv, createConfigFromEnv, createConfigFromPreset, createTestConfig, deepMerge, getConfigSummary, getEnv, getPreset, loadDotEnv, loadFromEnv, loadFromFile, loadTestConfig, logConfigSafely, maskSecrets, parseArray, parseBoolean, parseNumber, requireEnv, safeValidateConfig, validateConfig, validatePartialConfig, validateProductionSecrets };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map