import { describe, expect, it } from 'vitest';
import { validateEnvironment } from './env-validation';

describe('validateEnvironment', () => {
  const validEnv = {
    JWT_SECRET: 'test-jwt-secret',
    JWT_REFRESH_SECRET: 'test-refresh-secret',
  };

  describe('with valid configuration', () => {
    it('should return validated environment with defaults', () => {
      const result = validateEnvironment(validEnv);

      expect(result.JWT_SECRET).toBe('test-jwt-secret');
      expect(result.JWT_REFRESH_SECRET).toBe('test-refresh-secret');
      expect(result.PORT).toBe(3000);
      expect(result.NODE_ENV).toBe('development');
      expect(result.DATABASE_HOST).toBe('localhost');
      expect(result.DATABASE_PORT).toBe(5432);
    });

    it('should coerce string numbers to numbers', () => {
      const result = validateEnvironment({
        ...validEnv,
        PORT: '8080',
        DATABASE_PORT: '5433',
      });

      expect(result.PORT).toBe(8080);
      expect(result.DATABASE_PORT).toBe(5433);
    });

    it('should accept valid NODE_ENV values', () => {
      expect(validateEnvironment({ ...validEnv, NODE_ENV: 'development' }).NODE_ENV).toBe(
        'development',
      );
      expect(validateEnvironment({ ...validEnv, NODE_ENV: 'production' }).NODE_ENV).toBe(
        'production',
      );
      expect(validateEnvironment({ ...validEnv, NODE_ENV: 'test' }).NODE_ENV).toBe('test');
    });

    it('should handle boolean coercion', () => {
      const result = validateEnvironment({
        ...validEnv,
        DATABASE_SSL: 'true',
        DATABASE_LOGGING: '',
        RUN_MIGRATIONS: '1',
      });

      expect(result.DATABASE_SSL).toBe(true);
      // Empty string coerces to false, non-empty strings coerce to true
      expect(result.DATABASE_LOGGING).toBe(false);
      expect(result.RUN_MIGRATIONS).toBe(true);
    });
  });

  describe('with invalid configuration', () => {
    it('should throw when JWT_SECRET is missing', () => {
      expect(() => validateEnvironment({ JWT_REFRESH_SECRET: 'secret' })).toThrow(
        'Environment validation failed',
      );
    });

    it('should throw when JWT_REFRESH_SECRET is missing', () => {
      expect(() => validateEnvironment({ JWT_SECRET: 'secret' })).toThrow(
        'Environment validation failed',
      );
    });

    it('should throw when JWT_SECRET is empty', () => {
      expect(() => validateEnvironment({ JWT_SECRET: '', JWT_REFRESH_SECRET: 'secret' })).toThrow(
        'Environment validation failed',
      );
    });

    it('should throw for invalid NODE_ENV', () => {
      expect(() => validateEnvironment({ ...validEnv, NODE_ENV: 'invalid' })).toThrow(
        'Environment validation failed',
      );
    });

    it('should throw for invalid PORT (negative)', () => {
      expect(() => validateEnvironment({ ...validEnv, PORT: '-1' })).toThrow(
        'Environment validation failed',
      );
    });

    it('should throw for invalid BCRYPT_ROUNDS (too low)', () => {
      expect(() => validateEnvironment({ ...validEnv, BCRYPT_ROUNDS: '5' })).toThrow(
        'Environment validation failed',
      );
    });

    it('should throw for invalid BCRYPT_ROUNDS (too high)', () => {
      expect(() => validateEnvironment({ ...validEnv, BCRYPT_ROUNDS: '25' })).toThrow(
        'Environment validation failed',
      );
    });

    it('should throw for invalid ADMIN_EMAIL format', () => {
      expect(() => validateEnvironment({ ...validEnv, ADMIN_EMAIL: 'not-an-email' })).toThrow(
        'Environment validation failed',
      );
    });
  });

  describe('optional fields', () => {
    it('should allow optional OAuth credentials to be undefined', () => {
      const result = validateEnvironment(validEnv);

      expect(result.GOOGLE_CLIENT_ID).toBeUndefined();
      expect(result.GOOGLE_CLIENT_SECRET).toBeUndefined();
      expect(result.GITHUB_CLIENT_ID).toBeUndefined();
      expect(result.GITHUB_CLIENT_SECRET).toBeUndefined();
      expect(result.REDIS_PASSWORD).toBeUndefined();
    });

    it('should accept optional OAuth credentials when provided', () => {
      const result = validateEnvironment({
        ...validEnv,
        GOOGLE_CLIENT_ID: 'google-id',
        GOOGLE_CLIENT_SECRET: 'google-secret',
      });

      expect(result.GOOGLE_CLIENT_ID).toBe('google-id');
      expect(result.GOOGLE_CLIENT_SECRET).toBe('google-secret');
    });
  });
});
