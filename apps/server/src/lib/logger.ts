import { env } from "@ai-hackathon/env/server";
import type { Logger, LoggerOptions } from "pino";

import pino from "pino";

// log levels: trace, debug, info, warn, error, fatal
const logLevel = env.LOG_LEVEL;
const isDevelopment = env.NODE_ENV !== "production";

// create logger options
const loggerOptions: LoggerOptions = {
  level: logLevel,
  // add timestamp formatting
  timestamp: pino.stdTimeFunctions.isoTime,
  // base context for all logs
  base: {
    env: env.NODE_ENV,
  },
};

// use pino-pretty in development for readable logs
// in production, use raw json for better performance and log aggregation
let logger: Logger;

if (isDevelopment && env.PINO_PRETTY !== "false") {
  logger = pino({
    ...loggerOptions,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
        singleLine: false,
      },
    },
  });
} else {
  logger = pino(loggerOptions);
}

/**
 * create a child logger with additional context
 * useful for adding request ids, user ids, or other contextual information
 *
 @example 
 * const requestlogger = createchildlogger({ requestid: 'abc123', userid: 'user456' });
 * requestlogger.info('processing request');
 */
export function createChildLogger(bindings: Record<string, unknown>): Logger {
  return logger.child(bindings);
}

/**
 * log levels explained:
 * - trace: most detailed logging, typically disabled in production
 * - debug: detailed information useful during development
 * - info: general information about application flow
 * - warn: warning messages for potentially problematic situations
 * - error: error messages for failures that don't stop the application
 * - fatal: critical errors that may cause the application to terminate
 *
 @example 
 * logger.info('server started');
 * logger.info({ port: 3000 }, 'server started on port');
 * logger.error({ err: error }, 'failed to process request');
 * logger.debug({ userid, action }, 'user action logged');
 */
export { logger };

export default logger;
