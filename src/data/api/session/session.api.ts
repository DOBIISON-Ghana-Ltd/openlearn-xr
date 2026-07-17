import fetcher from "@/data/fetcher";
import { axios } from "@/data/axios";
import { QueryConfig, MutationConfig, Infer } from "@/data/types.base";
import { QUERY_KEYS } from "@/data/key-factory";
import R from "@/data/route-factory";
import ZSession from "./session.schema";

// ---------------------------------------------------------------------------
// GET /api/sessions
// ---------------------------------------------------------------------------
const publicGetAllSessions = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["public:session:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["public:session:get:all"]()),
      ZSession.PublicSessionGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

// ---------------------------------------------------------------------------
// POST /api/sessions
// ---------------------------------------------------------------------------
const publicCreateSession = {
  type: "mutation",
  mutationFn: async (body: Infer["PublicSessionCreate"]["body"]) => {
    const data = await fetcher(
      () => axios.post(R["public:session:post:create"](), body),
      ZSession.PublicSessionCreate.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const publicGetSessionOverview = {
  type: "query",
  queryKey: (id: string) => [...QUERY_KEYS["public:session:get:overview"](id)],
  queryFn: async (id: string) => {
    const data = await fetcher(
      () => axios.get(R["public:session:get:overview"](id)),
      ZSession.PublicSessionGetOverview.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const api = {
  "public:session:get:all": publicGetAllSessions,
  "public:session:post:create": publicCreateSession,
  "public:session:get:overview": publicGetSessionOverview,
};

export default api;
