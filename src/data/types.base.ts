import { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import Base from "./schema.base";
import ZMedia from "./modules/media/media.schema";
import ZUser from "./modules/user/user.schema";
import ZOrg from "./modules/org/org.schema";
import { z } from "zod";

// UTILITY TYPES
type InferAll<T extends Record<string, z.ZodType>> = {
  [K in keyof T]: z.infer<T[K]>
};

export type QueryConfig<TData = any, TVars = any> = {
  type: 'query';
  queryKey: (vars: TVars) => unknown[];
  queryFn: (vars: TVars) => Promise<TData>;
  options?: Omit<UseQueryOptions<TData, Error, TData>, 'queryKey' | 'queryFn'>;
};

export type MutationConfig<TData = any, TVars = any> = {
  type: 'mutation';
  mutationFn: (vars: TVars) => Promise<TData>;
  options?: Omit<UseMutationOptions<TData, Error, TVars>, 'mutationFn'>;
};

export type ApiConfig = QueryConfig | MutationConfig;

export type Infer = 
  InferAll<typeof Base> &
  InferAll<typeof ZMedia> &
  InferAll<typeof ZUser> &
  InferAll<typeof ZOrg>;