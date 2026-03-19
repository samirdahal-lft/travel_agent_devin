/**
 * Client-safe logger for browser-side logging.
 *
 * Sends structured log messages to the console.
 * In production, could be extended to send logs to an external service.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: Record<string, unknown>;
}

function formatLog(entry: LogEntry): string {
  const metaStr = entry.meta ? ` ${JSON.stringify(entry.meta)}` : '';
  return `${entry.timestamp} [${entry.level.toUpperCase()}]: ${entry.message}${metaStr}`;
}

function createLogEntry(level: LogLevel, message: string, meta?: Record<string, unknown>): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    meta,
  };
}

const clientLogger = {
  debug(message: string, meta?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'production') {
      const entry = createLogEntry('debug', message, meta);
      console.debug(formatLog(entry));
    }
  },

  info(message: string, meta?: Record<string, unknown>): void {
    const entry = createLogEntry('info', message, meta);
    console.info(formatLog(entry));
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    const entry = createLogEntry('warn', message, meta);
    console.warn(formatLog(entry));
  },

  error(message: string, meta?: Record<string, unknown>): void {
    const entry = createLogEntry('error', message, meta);
    console.error(formatLog(entry));
  },
};

export default clientLogger;
