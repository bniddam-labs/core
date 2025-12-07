/**
 * Configuration module - provides type-safe configuration helpers
 *
 * This module exports HELPERS ONLY - no fixed configuration values.
 * Consuming projects should use these utilities to build their own config.
 *
 * @example
 * ```typescript
 * // In your consuming project
 * import { createConfigBuilder, validateConfig } from '@core/config';
 *
 * const config = createConfigBuilder()
 *   .fromEnv()
 *   .override({ logging: { level: 'debug' } })
 *   .build();
 * ```
 */

// Schemas (source of truth)
export * from './schema';

// Types (derived from schemas)
export * from './types';

// Builder (fluent configuration builder)
export {
  ConfigBuilder,
  createConfigBuilder,
  createConfigFromDotEnv,
  createConfigFromEnv,
  createConfigFromPreset,
  createTestConfig,
} from './builder';

// Loaders (environment, file, test)
export { loadDotEnv, loadFromEnv, loadFromFile, loadTestConfig } from './loaders';

// Validators (validation and logging helpers)
export {
  validateConfig,
  safeValidateConfig,
  validatePartialConfig,
  logConfigSafely,
  getConfigSummary,
} from './validators';

// Utils (deep merge, secret masking, parsing)
export {
  deepMerge,
  maskSecrets,
  parseBoolean,
  parseNumber,
  parseArray,
  requireEnv,
  getEnv,
  validateProductionSecrets,
} from './utils';

// Defaults (optional presets - NOT auto-applied)
export {
  DEVELOPMENT_PRESET,
  PRODUCTION_PRESET,
  STAGING_PRESET,
  TEST_PRESET,
  getPreset,
  DEFAULT_DATABASE_CONFIG,
  DEFAULT_REDIS_CONFIG,
  DEFAULT_JWT_CONFIG,
  DEFAULT_RATE_LIMIT,
  DEFAULT_LOGGING_CONFIG,
} from './defaults';
