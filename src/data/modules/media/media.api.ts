import fetcher from "@/data/fetcher";
import { axios } from "@/data/axios";
import { Infer, MutationConfig, QueryConfig } from "@/data/types.base";
import ZMedia from "./media.schema";
import R from "@/data/route-factory";

const publicPostOne = {
  type: 'mutation',
  mutationFn: async (body: Infer["PublicMediaPostOne"]["body"]) => {
    const data = await fetcher(
      () => axios.post(R["public:media:post:one"](), body),
      ZMedia.PublicMediaPostOne.shape.res
    );
    return data;
  }
} satisfies MutationConfig;

export default {
  "public:media:post:one": publicPostOne,
};