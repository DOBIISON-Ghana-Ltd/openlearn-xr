import fetcher from "@/data/fetcher";
import { axios } from "@/data/axios";
import { QueryConfig, MutationConfig, Infer } from "@/data/types.base";
import { QUERY_KEYS } from "@/data/key-factory";
import R from "@/data/route-factory";
import ZSes from "./ses.schema";

const sesSessionGetAll = {
  type: "query",
  queryKey: (vars?: Infer["SesSessionGetAll"]["query"]) => [...QUERY_KEYS["ses:session:get:all"](vars)],
  queryFn: async (vars?: Infer["SesSessionGetAll"]["query"]) => {
    const data = await fetcher(
      () => axios.get(R["ses:session:get:all"](), { params: vars }),
      ZSes.SesSessionGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const sesSessionPostCreate = {
  type: "mutation",
  mutationFn: async (body: Infer["SesSessionPostCreate"]["body"]) => {
    const data = await fetcher(
      () => axios.post(R["ses:session:post:create"](), body),
      ZSes.SesSessionPostCreate.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const sesSessionGetOverview = {
  type: "query",
  queryKey: (vars: Infer["SesSessionGetOverview"]["params"]) => [...QUERY_KEYS["ses:session:get:overview"](vars.id)],
  queryFn: async (vars: Infer["SesSessionGetOverview"]["params"]) => {
    const data = await fetcher(
      () => axios.get(R["ses:session:get:overview"](vars.id)),
      ZSes.SesSessionGetOverview.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const sesSessionGetNotes = {
  type: "query",
  queryKey: (vars: Infer["SesSessionGetNotes"]["params"]) => [...QUERY_KEYS["ses:session:get:notes"](vars.id)],
  queryFn: async (vars: Infer["SesSessionGetNotes"]["params"]) => {
    const data = await fetcher(
      () => axios.get(R["ses:session:get:notes"](vars.id)),
      ZSes.SesSessionGetNotes.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const sesSessionGetPlayers = {
  type: "query",
  queryKey: (vars: Infer["SesSessionGetPlayers"]["params"]) => [...QUERY_KEYS["ses:session:get:players"](vars.id)],
  queryFn: async (vars: Infer["SesSessionGetPlayers"]["params"]) => {
    const data = await fetcher(
      () => axios.get(R["ses:session:get:players"](vars.id)),
      ZSes.SesSessionGetPlayers.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const sesSessionGetPlayerSummary = {
  type: "query",
  queryKey: (vars: Infer["SesSessionGetPlayerSummary"]["params"]) => [...QUERY_KEYS["ses:session:get:player-summary"](vars.id)],
  queryFn: async (vars: Infer["SesSessionGetPlayerSummary"]["params"]) => {
    const data = await fetcher(
      () => axios.get(R["ses:session:get:player-summary"](vars.id)),
      ZSes.SesSessionGetPlayerSummary.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const sesModuleVersionGetOptions = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["ses:module-version:get:options"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["ses:module-version:get:options"]()),
      ZSes.SesModuleVersionGetOptions.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const sesSessionPostStart = {
  type: "mutation",
  mutationFn: async (vars: Infer["SesSessionPostStart"]["params"]) => {
    const data = await fetcher(
      () => axios.post(R["ses:session:post:start"](vars.id)),
      ZSes.SesSessionPostStart.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const sesSessionGetRecent = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["ses:session:get:recent"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["ses:session:get:recent"]()),
      ZSes.SesSessionGetRecent.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const sesModuleGetAll = {
  type: "query",
  queryKey: (query?: Infer["SesModuleGetAll"]["query"]) => [...QUERY_KEYS["ses:module:get:all"](query)],
  queryFn: async (query?: Infer["SesModuleGetAll"]["query"]) => {
    const data = await fetcher(
      () => axios.get(R["ses:module:get:all"](), { params: query }),
      ZSes.SesModuleGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const sesModuleGetOne = {
  type: "query",
  queryKey: (vars: Infer["SesModuleGetOne"]["params"]) => [...QUERY_KEYS["ses:module:get:one"](vars.id)],
  queryFn: async (vars: Infer["SesModuleGetOne"]["params"]) => {
    const data = await fetcher(
      () => axios.get(R["ses:module:get:one"](vars)),
      ZSes.SesModuleGetOne.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const sesSessionGetOne = {
  type: "query",
  queryKey: (vars: Infer["SesSessionGetOne"]["params"]) => [...QUERY_KEYS["ses:session:get:one"](vars.code)],
  queryFn: async (vars: Infer["SesSessionGetOne"]["params"]) => {
    const data = await fetcher(
      () => axios.get(R["ses:session:get:one"](vars)),
      ZSes.SesSessionGetOne.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

export default {
  "ses:session:get:all": sesSessionGetAll,
  "ses:session:get:recent": sesSessionGetRecent,
  "ses:session:post:create": sesSessionPostCreate,
  "ses:session:post:start": sesSessionPostStart,
  "ses:session:get:overview": sesSessionGetOverview,
  "ses:session:get:notes": sesSessionGetNotes,
  "ses:session:get:players": sesSessionGetPlayers,
  "ses:session:get:player-summary": sesSessionGetPlayerSummary,
  "ses:module-version:get:options": sesModuleVersionGetOptions,
  "ses:module:get:all": sesModuleGetAll,
  "ses:module:get:one": sesModuleGetOne,
  "ses:session:get:one": sesSessionGetOne,
};
