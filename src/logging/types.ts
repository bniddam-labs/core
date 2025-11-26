/**
 * Log levels supported by the logger
 */
export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

/**
 * Severity levels for security events
 */
export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Authentication event types
 */
export type AuthEvent = 'login' | 'logout' | 'register' | 'failed';

/**
 * Metadata object for structured logging
 */
export type LogMetadata = Record<string, any>;

/**
 * Logger configuration options
 */
export interface LoggerConfig {
  /**
   * Enable JSON output format
   * @default false
   */
  json?: boolean;

  /**
   * Timestamp format for logs
   * @default 'ISO'
   */
  timestampFormat?: 'ISO' | 'locale' | 'unix';

  /**
   * Enable log levels
   * @default ['log', 'error', 'warn', 'debug', 'verbose']
   */
  levels?: LogLevel[];

  /**
   * Enable colored output (only for non-JSON mode)
   * @default true
   */
  colors?: boolean;

  /**
   * Include timestamp in logs
   * @default true
   */
  includeTimestamp?: boolean;
}

/**
 * Core logger interface - framework agnostic
 * Can be used in any TypeScript/JavaScript project
 */
export interface ILogger {
  /**
   * Set context for all subsequent logs
   * @param context - Context name (e.g., module name, class name)
   */
  setContext(context: string): void;

  /**
   * Get current context
   */
  getContext(): string;

  /**
   * Log informational message
   * @param message - Log message
   * @param metadata - Optional structured data
   */
  log(message: string, metadata?: LogMetadata): void;

  /**
   * Log error message
   * @param message - Error message
   * @param trace - Stack trace (optional)
   * @param metadata - Optional structured data
   */
  error(message: string, trace?: string, metadata?: LogMetadata): void;

  /**
   * Log warning message
   * @param message - Warning message
   * @param metadata - Optional structured data
   */
  warn(message: string, metadata?: LogMetadata): void;

  /**
   * Log debug message
   * @param message - Debug message
   * @param metadata - Optional structured data
   */
  debug(message: string, metadata?: LogMetadata): void;

  /**
   * Log verbose message
   * @param message - Verbose message
   * @param metadata - Optional structured data
   */
  verbose(message: string, metadata?: LogMetadata): void;

  /**
   * Log business event with structured data
   * @param event - Event name
   * @param data - Event metadata
   */
  logEvent(event: string, data: LogMetadata): void;

  /**
   * Log database query execution
   * @param query - SQL query or operation name
   * @param duration - Execution duration in ms
   * @param params - Query parameters (optional)
   */
  logQuery(query: string, duration: number, params?: any[]): void;

  /**
   * Log HTTP request
   * @param method - HTTP method
   * @param url - Request URL
   * @param statusCode - Response status code
   * @param duration - Request duration in ms
   */
  logHttpRequest(method: string, url: string, statusCode: number, duration: number): void;

  /**
   * Log authentication event
   * @param event - Auth event type
   * @param userId - User ID (optional)
   * @param metadata - Additional metadata
   */
  logAuth(event: AuthEvent, userId?: string, metadata?: LogMetadata): void;

  /**
   * Log security event
   * @param event - Security event description
   * @param severity - Event severity level
   * @param metadata - Additional metadata
   */
  logSecurity(event: string, severity: SecuritySeverity, metadata?: LogMetadata): void;
}
