import type {
  AdminConfig,
  AppConfig,
  AuthConfig,
  Configuration,
  DatabaseConfig,
  EmailConfig,
  FeatureFlagsConfig,
  LoggingConfig,
  PartialConfiguration,
  RabbitMQConfig,
  RedisConfig,
  S3Config,
} from './types.js';
import { getPreset } from './defaults.js';
import { loadDotEnv, loadFromEnv, loadFromFile, loadTestConfig } from './loaders.js';
import { deepMerge } from './utils.js';
import { validateConfig } from './validators.js';

/**
 * Fluent configuration builder
 * Helps construct configuration objects in a type-safe, chainable way
 */
export class ConfigBuilder {
  private config: PartialConfiguration = {};

  /**
   * Set environment (development, staging, production, test)
   */
  environment(env: AppConfig['nodeEnv']): this {
    if (!this.config.app) {
      this.config.app = {};
    }
    this.config.app.nodeEnv = env;
    return this;
  }

  /**
   * Configure application settings
   */
  app(config: Partial<AppConfig>): this {
    this.config.app = deepMerge(this.config.app || {}, config);
    return this;
  }

  /**
   * Configure database connection
   */
  database(config: Partial<DatabaseConfig>): this {
    this.config.database = deepMerge(this.config.database || {}, config);
    return this;
  }

  /**
   * Configure authentication
   */
  auth(config: Partial<AuthConfig>): this {
    this.config.auth = deepMerge(this.config.auth || {}, config);
    return this;
  }

  /**
   * Configure Redis cache
   */
  redis(config: Partial<RedisConfig>): this {
    this.config.redis = deepMerge(this.config.redis || {}, config);
    return this;
  }

  /**
   * Configure admin panel
   */
  admin(config: Partial<AdminConfig>): this {
    this.config.admin = deepMerge(this.config.admin || {}, config);
    return this;
  }

  /**
   * Configure email service
   */
  email(config: Partial<EmailConfig>): this {
    this.config.email = deepMerge(this.config.email || {}, config);
    return this;
  }

  /**
   * Configure S3 storage
   */
  s3(config: Partial<S3Config>): this {
    this.config.s3 = deepMerge(this.config.s3 || {}, config);
    return this;
  }

  /**
   * Configure RabbitMQ
   */
  rabbitmq(config: Partial<RabbitMQConfig>): this {
    this.config.rabbitmq = deepMerge(this.config.rabbitmq || {}, config);
    return this;
  }

  /**
   * Configure logging
   */
  logging(config: Partial<LoggingConfig>): this {
    this.config.logging = deepMerge(this.config.logging || {}, config);
    return this;
  }

  /**
   * Configure feature flags
   */
  featureFlags(config: Partial<FeatureFlagsConfig>): this {
    this.config.featureFlags = deepMerge(this.config.featureFlags || {}, config);
    return this;
  }

  /**
   * Load .env file and then load configuration from environment variables
   * @param envFilePath - Path to .env file (defaults to .env in current directory)
   * @param prefix - Optional prefix for environment variables (e.g., 'APP_')
   * @param override - Whether to override existing environment variables
   */
  fromDotEnv(envFilePath = '.env', prefix = '', override = false): this {
    loadDotEnv(envFilePath, override);
    return this.fromEnv(prefix);
  }

  /**
   * Load configuration from environment variables
   * @param prefix - Optional prefix for environment variables (e.g., 'APP_')
   */
  fromEnv(prefix = ''): this {
    const envConfig = loadFromEnv(prefix);
    this.config = deepMerge(this.config, envConfig);
    return this;
  }

  /**
   * Load configuration from a JSON file
   * @param filePath - Path to JSON config file
   */
  fromFile(filePath: string): this {
    const fileConfig = loadFromFile(filePath);
    this.config = deepMerge(this.config, fileConfig);
    return this;
  }

  /**
   * Load test configuration preset
   */
  fromTest(): this {
    const testConfig = loadTestConfig();
    this.config = deepMerge(this.config, testConfig);
    return this;
  }

  /**
   * Merge with another configuration object
   * @param config - Configuration to merge
   */
  merge(config: PartialConfiguration): this {
    this.config = deepMerge(this.config, config);
    return this;
  }

  /**
   * Override specific values (alias for merge)
   * @param config - Configuration to override
   */
  override(config: PartialConfiguration): this {
    this.config = deepMerge(this.config, config);
    return this;
  }

  /**
   * Use a preset configuration (development, production, test, staging)
   * @param preset - Preset name
   */
  preset(preset: 'development' | 'production' | 'test' | 'staging'): this {
    const presetConfig = getPreset(preset);
    this.config = deepMerge(this.config, presetConfig);
    return this;
  }

  /**
   * Conditionally apply configuration
   * @param condition - Boolean condition
   * @param fn - Function to apply if condition is true
   */
  when(condition: boolean, fn: (builder: ConfigBuilder) => void): this {
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
  whenEnv(env: AppConfig['nodeEnv'], fn: (builder: ConfigBuilder) => void): this {
    if (this.config.app?.nodeEnv === env) {
      fn(this);
    }
    return this;
  }

  /**
   * Enable development mode optimizations
   */
  forDevelopment(): this {
    return this.preset('development');
  }

  /**
   * Enable production mode optimizations
   */
  forProduction(): this {
    return this.preset('production');
  }

  /**
   * Enable test mode optimizations
   */
  forTest(): this {
    return this.preset('test');
  }

  /**
   * Enable staging mode optimizations
   */
  forStaging(): this {
    return this.preset('staging');
  }

  /**
   * Build and validate the final configuration
   * @returns Validated configuration
   * @throws Error if validation fails
   */
  build(): Configuration {
    return validateConfig(this.config);
  }

  /**
   * Build without validation (unsafe, use for debugging)
   * @returns Partial configuration without validation
   */
  buildUnsafe(): PartialConfiguration {
    return this.config;
  }

  /**
   * Get current config state (for inspection)
   * @returns Copy of current configuration state
   */
  peek(): PartialConfiguration {
    return { ...this.config };
  }

  /**
   * Reset builder to empty state
   */
  reset(): this {
    this.config = {};
    return this;
  }

  /**
   * Clone the current builder state
   * @returns New builder with same configuration
   */
  clone(): ConfigBuilder {
    const newBuilder = new ConfigBuilder();
    newBuilder.config = { ...this.config };
    return newBuilder;
  }
}

/**
 * Create a new config builder instance
 * @returns New ConfigBuilder instance
 */
export function createConfigBuilder(): ConfigBuilder {
  return new ConfigBuilder();
}

/**
 * Quick helper to create config from .env file
 * @param envFilePath - Path to .env file (defaults to .env in current directory)
 * @param prefix - Optional prefix for environment variables
 * @param override - Whether to override existing environment variables
 * @returns Validated configuration
 */
export function createConfigFromDotEnv(envFilePath = '.env', prefix = '', override = false): Configuration {
  return createConfigBuilder().fromDotEnv(envFilePath, prefix, override).build();
}

/**
 * Quick helper to create config from environment
 * @param prefix - Optional prefix for environment variables
 * @returns Validated configuration
 */
export function createConfigFromEnv(prefix = ''): Configuration {
  return createConfigBuilder().fromEnv(prefix).build();
}

/**
 * Quick helper to create config from preset
 * @param preset - Preset name
 * @param overrides - Optional configuration overrides
 * @returns Validated configuration
 */
export function createConfigFromPreset(
  preset: 'development' | 'production' | 'test' | 'staging',
  overrides?: PartialConfiguration,
): Configuration {
  const builder = createConfigBuilder().preset(preset);

  if (overrides) {
    builder.merge(overrides);
  }

  return builder.build();
}

/**
 * Quick helper to create test configuration
 * @returns Validated test configuration
 */
export function createTestConfig(): Configuration {
  return createConfigBuilder().fromTest().build();
}
