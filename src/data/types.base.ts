import { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import Base from "./schema.base";
import ZApp from "./api/app/app.schema";
import ZSim from "./api/sim/sim.schema";
import ZSes from "./api/ses/ses.schema";
import ZEditor from "./api/editor/editor.schema";
import ZAdmin from "./api/admin/admin.schema";
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
  InferAll<typeof ZApp> &
  InferAll<typeof ZSim> &
  InferAll<typeof ZSes> &
  InferAll<typeof ZEditor> &
  InferAll<typeof ZAdmin>;
