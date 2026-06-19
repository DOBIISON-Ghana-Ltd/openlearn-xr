"use client";

import { 
  useQuery, 
  useMutation
} from '@tanstack/react-query';
import { apiRegistry, ApiRegistry } from '@/data/registry';
import { ApiError } from '@/data/fetcher';

type QueryKeys = {
  [K in keyof ApiRegistry]: ApiRegistry[K] extends { type: 'query' } ? K : never
}[keyof ApiRegistry];

type MutationKeys = {
  [K in keyof ApiRegistry]: ApiRegistry[K] extends { type: 'mutation' } ? K : never
}[keyof ApiRegistry];

export default {
  // 1. Query
  query: <K extends QueryKeys>(
    key: K,
    vars?: Parameters<ApiRegistry[K]['queryFn']>[0],
    enabled: boolean = true
  ) => {
    type TData = Awaited<ReturnType<ApiRegistry[K]['queryFn']>>;

    const config = apiRegistry[key] as any;
    return useQuery<TData, ApiError>({
      queryKey: config.queryKey(vars),
      queryFn: () => config.queryFn(vars),
      ...config.options,
      enabled
    });
  },

  // 2. Mutation
  mutate: <K extends MutationKeys>(key: K) => {
    type TData = Awaited<ReturnType<ApiRegistry[K]['mutationFn']>>;
    type TVars = Parameters<ApiRegistry[K]['mutationFn']>[0];

    const config = apiRegistry[key] as any;
    return useMutation<TData, ApiError, TVars>({
      mutationFn: config.mutationFn,
      ...config.options,
    });
  }
};