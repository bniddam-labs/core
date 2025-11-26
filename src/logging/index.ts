/**
 * Logging module - framework-agnostic structured logging
 *
 * This module provides a framework-free logger that can be used in any TypeScript/JavaScript project.
 *
 * @example Framework-free usage
 * ```typescript
 * import { ConsoleLogger } from '@core/logging';
 *
 * const logger = new ConsoleLogger('MyApp', { json: true });
 * logger.log('Application started');
 * logger.error('An error occurred', stackTrace);
 * logger.logHttpRequest('GET', '/api/users', 200, 45);
 * ```
 *
 * @example With metadata
 * ```typescript
 * logger.log('User action', { userId: '123', action: 'login' });
 * logger.logAuth('login', 'user-123', { ip: '192.168.1.1' });
 * ```
 */

export * from './types';
export * from './console-logger';
