import userApi from './api/user/user.api';
import mediaApi from './api/media/media.api';
import orgApi from './api/org/org.api';
import sessionApi from './api/session/session.api';
import moduleApi from './api/modules/modules.api';

export const apiRegistry = {
  ...userApi,
  ...mediaApi,
  ...orgApi,
  ...sessionApi,
  ...moduleApi,
} as const;

export type ApiRegistry = typeof apiRegistry;

// Helper type to filter only Query keys for prefetching
export type QueryKeys = {
  [K in keyof ApiRegistry]: ApiRegistry[K] extends { type: 'query' } ? K : never;
}[keyof ApiRegistry];
