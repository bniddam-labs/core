import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  path: string;
  timestamp: string;
  method: string;
  [key: string]: unknown;
}

/**
 * Exception filter specifically for HttpException instances
 * Provides detailed error formatting and security-aware logging
 *
 * In production mode, sensitive error details are stripped from 500+ errors
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: 'Internal server error',
    };

    // Merge exception response into error response
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      Object.assign(errorResponse, exceptionResponse);
    } else {
      errorResponse.message = exceptionResponse;
    }

    // Log error with appropriate level
    if (status >= 500) {
      this.logger.error(`HTTP ${status} Error: ${request.method} ${request.url}`, exception.stack);
    } else {
      this.logger.warn(
        `HTTP ${status} Error: ${request.method} ${request.url} - ${Array.isArray(errorResponse.message) ? errorResponse.message.join(', ') : errorResponse.message}`,
      );
    }

    // In production, sanitize 500+ errors to prevent information leakage
    if (process.env.NODE_ENV === 'production' && status >= 500) {
      errorResponse.message = 'Internal server error';
      errorResponse.error = undefined;

      // Remove any additional properties that might contain sensitive info
      const allowedKeys = ['statusCode', 'message', 'timestamp', 'path', 'method'];
      for (const key of Object.keys(errorResponse)) {
        if (!allowedKeys.includes(key)) {
          delete errorResponse[key];
        }
      }
    }

    response.status(status).json(errorResponse);
  }
}
