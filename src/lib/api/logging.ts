import type { APIContext } from "astro";

interface LogEntry {
  timestamp: string;
  method: string;
  path: string;
  status: number;
  duration: number;
  userId?: string;
  error?: unknown;
}

const logs: LogEntry[] = [];
const MAX_LOGS = 1000;

export function logRequest(context: APIContext, startTime: number, status: number, error?: unknown) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    method: context.request.method,
    path: context.url.pathname,
    status,
    duration: Date.now() - startTime,
    userId: context.locals.user?.id,
    error,
  };

  logs.unshift(entry);

  // Keep only the last MAX_LOGS entries
  if (logs.length > MAX_LOGS) {
    logs.pop();
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    const logMessage = `${entry.method} ${entry.path} ${entry.status} ${entry.duration}ms`;
    if (error) {
      // eslint-disable-next-line no-console
      console.error(logMessage, error);
    } else {
      // eslint-disable-next-line no-console
      console.log(logMessage);
    }
  }
}

export function getRecentLogs(limit = 100): LogEntry[] {
  return logs.slice(0, limit);
}

export function clearLogs() {
  logs.length = 0;
}
