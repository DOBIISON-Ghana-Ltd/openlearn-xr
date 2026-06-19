import userModule from './modules/user/user.api';
import mediaModule from './modules/media/media.api';

export const apiRegistry = {
  ...userModule,
  ...mediaModule
} as const;

export type ApiRegistry = typeof apiRegistry;

// Helper type to filter only Query keys for prefetching
export type QueryKeys = {
  [K in keyof ApiRegistry]: ApiRegistry[K] extends { type: 'query' } ? K : never;
}[keyof ApiRegistry];