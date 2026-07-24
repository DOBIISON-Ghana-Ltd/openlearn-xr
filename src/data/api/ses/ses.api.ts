import fetcher from "@/data/fetcher";
import { axios } from "@/data/axios";
import { QueryConfig, MutationConfig, Infer } from "@/data/types.base";
import { QUERY_KEYS } from "@/data/key-factory";
import R from "@/data/route-factory";
import ZSes from "./ses.schema";

const sesSessionGetAll = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["ses:session:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["ses:session:get:all"]()),
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
  queryKey: (id: string) => [...QUERY_KEYS["ses:session:get:overview"](id)],
  queryFn: async (id: string) => {
    const data = await fetcher(
      () => axios.get(R["ses:session:get:overview"](id)),
      ZSes.SesSessionGetOverview.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

export default {
  "ses:session:get:all": sesSessionGetAll,
  "ses:session:post:create": sesSessionPostCreate,
  "ses:session:get:overview": sesSessionGetOverview,
};
