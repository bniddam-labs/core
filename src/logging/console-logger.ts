import type { AuthEvent, ILogger, LoggerConfig, LogLevel, LogMetadata, SecuritySeverity } from './types.js';

/**
 * ANSI color codes for terminal output
 */
const COLORS = {
	reset: '\x1b[0m',
	log: '\x1b[32m', // Green
	error: '\x1b[31m', // Red
	warn: '\x1b[33m', // Yellow
	debug: '\x1b[35m', // Magenta
	verbose: '\x1b[36m', // Cyan
	context: '\x1b[34m', // Blue
} as const;

/**
 * Framework-free console logger implementation
 * Can be used standalone or wrapped by framework-specific adapters
 */
export class ConsoleLogger implements ILogger {
	private context = 'App';
	private config: Required<LoggerConfig>;

	constructor(context?: string, config?: LoggerConfig) {
		if (context) {
			this.context = context;
		}

		this.config = {
			json: config?.json ?? false,
			timestampFormat: config?.timestampFormat ?? 'ISO',
			levels: config?.levels ?? ['log', 'error', 'warn', 'debug', 'verbose'],
			colors: config?.colors ?? true,
			includeTimestamp: config?.includeTimestamp ?? true,
		};
	}

	/**
	 * Set context for all subsequent logs
	 */
	setContext(context: string): void {
		this.context = context;
	}

	/**
	 * Get current context
	 */
	getContext(): string {
		return this.context;
	}

	/**
	 * Log informational message
	 */
	log(message: string, metadata?: LogMetadata): void {
		this.writeLog('log', message, metadata);
	}

	/**
	 * Log error message
	 */
	error(message: string, trace?: string, metadata?: LogMetadata): void {
		const meta = trace ? { ...metadata, trace } : metadata;
		this.writeLog('error', message, meta);
	}

	/**
	 * Log warning message
	 */
	warn(message: string, metadata?: LogMetadata): void {
		this.writeLog('warn', message, metadata);
	}

	/**
	 * Log debug message
	 */
	debug(message: string, metadata?: LogMetadata): void {
		this.writeLog('debug', message, metadata);
	}

	/**
	 * Log verbose message
	 */
	verbose(message: string, metadata?: LogMetadata): void {
		this.writeLog('verbose', message, metadata);
	}

	/**
	 * Log business event with structured data
	 */
	logEvent(event: string, data: LogMetadata): void {
		this.log(`Event: ${event}`, { event, ...data });
	}

	/**
	 * Log database query execution
	 */
	logQuery(query: string, duration: number, params?: any[]): void {
		this.debug('Database query executed', {
			type: 'database',
			query,
			duration,
			params,
		});
	}

	/**
	 * Log HTTP request
	 */
	logHttpRequest(method: string, url: string, statusCode: number, duration: number): void {
		const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'log';
		this.writeLog(level, `HTTP ${method} ${url} ${statusCode}`, {
			type: 'http',
			method,
			url,
			statusCode,
			duration,
		});
	}

	/**
	 * Log authentication event
	 */
	logAuth(event: AuthEvent, userId?: string, metadata?: LogMetadata): void {
		this.log(`Auth event: ${event}`, {
			type: 'auth',
			event,
			userId,
			...metadata,
		});
	}

	/**
	 * Log security event
	 */
	logSecurity(event: string, severity: SecuritySeverity, metadata?: LogMetadata): void {
		const level: LogLevel = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
		this.writeLog(level, `Security event: ${event}`, {
			type: 'security',
			event,
			severity,
			...metadata,
		});
	}

	/**
	 * Core logging method that handles formatting and output
	 */
	private writeLog(level: LogLevel, message: string, metadata?: LogMetadata): void {
		// Check if this log level is enabled
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
	private writeJsonLog(level: LogLevel, message: string, metadata?: LogMetadata): void {
		const logEntry = {
			timestamp: this.getTimestamp(),
			level,
			context: this.context,
			message,
			...(metadata && { metadata }),
		};

		const output = JSON.stringify(logEntry);
		this.writeToConsole(level, output);
	}

	/**
	 * Write log in text format
	 */
	private writeTextLog(level: LogLevel, message: string, metadata?: LogMetadata): void {
		const timestamp = this.config.includeTimestamp ? `[${this.getTimestamp()}] ` : '';
		const contextStr = `[${this.context}]`;
		const levelStr = level.toUpperCase().padEnd(7);
		const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : '';

		let output: string;

		if (this.config.colors && !this.config.json) {
			const levelColor = COLORS[level] || COLORS.reset;
			output = `${timestamp}${levelColor}${levelStr}${COLORS.reset} ${COLORS.context}${contextStr}${COLORS.reset} ${levelColor}${message}${COLORS.reset}${metadataStr}`;
		} else {
			output = `${timestamp}${levelStr} ${contextStr} ${message}${metadataStr}`;
		}

		this.writeToConsole(level, output);
	}

	/**
	 * Write to appropriate console stream based on level
	 */
	private writeToConsole(level: LogLevel, message: string): void {
		switch (level) {
			case 'error':
				console.error(message);
				break;
			case 'warn':
				console.warn(message);
				break;
			case 'debug':
			case 'verbose':
				console.debug(message);
				break;
			default:
				console.log(message);
		}
	}

	/**
	 * Get formatted timestamp based on config
	 */
	private getTimestamp(): string {
		const now = new Date();

		switch (this.config.timestampFormat) {
			case 'unix':
				return now.getTime().toString();
			case 'locale':
				return now.toLocaleString();
			case 'ISO':
			default:
				return now.toISOString();
		}
	}

	/**
	 * Create a child logger with a new context
	 * Useful for creating scoped loggers while sharing the same configuration
	 */
	createChild(context: string): ConsoleLogger {
		return new ConsoleLogger(context, this.config);
	}

	/**
	 * Update logger configuration
	 */
	updateConfig(config: Partial<LoggerConfig>): void {
		this.config = {
			...this.config,
			...config,
			levels: config.levels ?? this.config.levels,
		};
	}
}
