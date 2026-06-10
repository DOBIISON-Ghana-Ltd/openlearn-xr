import { env } from '../config/env';

const isProd = env.NODE_ENV === 'production';

const logger = {
  info: (message: string, ...args: any[]) => {
    if (!isProd) console.log(`[INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    if (!isProd) console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    // In production, you might want to send errors to a service like Sentry
    // but still hide them from the user's browser console
    if (!isProd) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  debug: (message: string, ...args: any[]) => {
    if (!isProd) console.debug(`[DEBUG] ${message}`, ...args);
  },
};

export default logger;