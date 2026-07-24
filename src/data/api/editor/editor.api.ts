import fetcher from "@/data/fetcher";
import { axios } from "@/data/axios";
import { QueryConfig, MutationConfig, Infer } from "@/data/types.base";
import { QUERY_KEYS } from "@/data/key-factory";
import R from "@/data/route-factory";
import ZEditor from "./editor.schema";

const editorCollectionGetAll = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["editor:collection:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["editor:collection:get:all"]()),
      ZEditor.EditorCollectionGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const editorCollectionPostCreate = {
  type: "mutation",
  mutationFn: async (body: Infer["EditorCollectionPostCreate"]["body"]) => {
    const data = await fetcher(
      () => axios.post(R["editor:collection:post:create"](), body),
      ZEditor.EditorCollectionPostCreate.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const editorCollectionGetDocuments = {
  type: "query",
  queryKey: (collectionId: string) => [
    ...QUERY_KEYS["editor:collection:get:documents"](collectionId),
  ],
  queryFn: async (collectionId: string) => {
    const data = await fetcher(
      () => axios.get(R["editor:collection:get:documents"]({ collectionId })),
      ZEditor.EditorCollectionGetDocuments.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const editorCollectionPatchDetails = {
  type: "mutation",
  mutationFn: async (
    vars: Pick<Infer["EditorCollectionPatchDetails"], "params" | "body">
  ) => {
    const data = await fetcher(
      () =>
        axios.patch(
          R["editor:collection:patch:details"]({ id: vars.params.id }),
          vars.body
        ),
      ZEditor.EditorCollectionPatchDetails.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const editorModuleGetAll = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["editor:module:get:all"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["editor:module:get:all"]()),
      ZEditor.EditorModuleGetAll.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

const editorModulePostCreate = {
  type: "mutation",
  mutationFn: async (body: Infer["EditorModulePostCreate"]["body"]) => {
    const data = await fetcher(
      () => axios.post(R["editor:module:post:create"](), body),
      ZEditor.EditorModulePostCreate.shape.res
    );
    return data;
  },
} satisfies MutationConfig;

const editorModuleVersionGetOptions = {
  type: "query",
  queryKey: () => [...QUERY_KEYS["editor:module-version:get:options"]],
  queryFn: async () => {
    const data = await fetcher(
      () => axios.get(R["editor:module-version:get:options"]()),
      ZEditor.EditorModuleVersionGetOptions.shape.res
    );
    return data;
  },
} satisfies QueryConfig;

export default {
  "editor:collection:get:all": editorCollectionGetAll,
  "editor:collection:post:create": editorCollectionPostCreate,
  "editor:collection:get:documents": editorCollectionGetDocuments,
  "editor:collection:patch:details": editorCollectionPatchDetails,
  "editor:module:get:all": editorModuleGetAll,
  "editor:module:post:create": editorModulePostCreate,
  "editor:module-version:get:options": editorModuleVersionGetOptions,
};
