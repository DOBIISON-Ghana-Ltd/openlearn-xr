import userModule from './api/user/user.api';
import mediaModule from './api/media/media.api';
import orgModule from './api/org/org.api';

export const apiRegistry = {
  ...userModule,
  ...mediaModule,
  ...orgModule
} as const;

export type ApiRegistry = typeof apiRegistry;

// Helper type to filter only Query keys for prefetching
export type QueryKeys = {
  [K in keyof ApiRegistry]: ApiRegistry[K] extends { type: 'query' } ? K : never;
}[keyof ApiRegistry];
