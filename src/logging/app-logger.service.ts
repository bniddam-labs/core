import { Injectable, Logger, type LoggerService as NestLoggerService } from '@nestjs/common';

/**
 * Custom logger service that wraps NestJS built-in Logger
 * Provides structured logging with context and metadata support
 *
 * This service can be used as a drop-in replacement for the default NestJS logger
 * and provides additional methods for logging specific event types (auth, security, HTTP, etc.)
 */
@Injectable()
export class AppLoggerService implements NestLoggerService {
  private logger = new Logger('App');
  private context = 'App';

  /**
   * Set context for all subsequent logs
   * @param context - Context name (e.g., module name, class name)
   */
  setContext(context: string): void {
    this.context = context;
    this.logger = new Logger(context);
  }

  /**
   * Log informational message
   */
  log(message: string, context?: string): void;
  log(message: string, ...optionalParams: any[]): void {
    this.logger.log(message, ...optionalParams);
  }

  /**
   * Log error message
   */
  error(message: string, trace?: string, context?: string): void;
  error(message: string, ...optionalParams: any[]): void {
    this.logger.error(message, ...optionalParams);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: string): void;
  warn(message: string, ...optionalParams: any[]): void {
    this.logger.warn(message, ...optionalParams);
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: string): void;
  debug(message: string, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }

  /**
   * Log verbose message
   */
  verbose(message: string, context?: string): void;
  verbose(message: string, ...optionalParams: any[]): void {
    this.logger.verbose(message, ...optionalParams);
  }

  /**
   * Log with custom level and additional structured data
   * @param level - Log level
   * @param message - Log message
   * @param data - Additional structured data
   */
  logWithData(
    level: 'log' | 'warn' | 'error' | 'debug',
    message: string,
    data: Record<string, any>,
  ): void {
    this.logger[level](message, data);
  }

  /**
   * Log business event with structured data
   * @param event - Event name
   * @param data - Event metadata
   */
  logEvent(event: string, data: Record<string, any>): void {
    this.logger.log(`Event: ${event}`, { event, ...data });
  }

  /**
   * Log database query execution
   * @param query - SQL query or operation name
   * @param duration - Execution duration in ms
   * @param params - Query parameters (optional)
   */
  logQuery(query: string, duration: number, params?: any[]): void {
    this.logger.debug('Database query executed', {
      type: 'database',
      query,
      duration,
      params,
    });
  }

  /**
   * Log HTTP request
   * @param method - HTTP method
   * @param url - Request URL
   * @param statusCode - Response status code
   * @param duration - Request duration in ms
   */
  logHttpRequest(method: string, url: string, statusCode: number, duration: number): void {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'log';
    this.logger[level](`HTTP ${method} ${url} ${statusCode}`, {
      type: 'http',
      method,
      url,
      statusCode,
      duration,
    });
  }

  /**
   * Log authentication event
   * @param event - Auth event type
   * @param userId - User ID (optional)
   * @param metadata - Additional metadata
   */
  logAuth(
    event: 'login' | 'logout' | 'register' | 'failed',
    userId?: string,
    metadata?: Record<string, any>,
  ): void {
    this.logger.log(`Auth event: ${event}`, {
      type: 'auth',
      event,
      userId,
      ...metadata,
    });
  }

  /**
   * Log security event
   * @param event - Security event description
   * @param severity - Event severity level
   * @param metadata - Additional metadata
   */
  logSecurity(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    metadata?: Record<string, any>,
  ): void {
    const level = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
    this.logger[level](`Security event: ${event}`, {
      type: 'security',
      event,
      severity,
      ...metadata,
    });
  }
}
