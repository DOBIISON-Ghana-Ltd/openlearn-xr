import { ZApi, ZMedia } from "@/data/schema.base";
import { z } from "zod";

const PublicMediaPostOne = ZApi({
  body: ZMedia.pick({
    folder: true,
    key: true,
    fileName: true,
    mimeType: true,
  }).extend({
    width: z.number().int().optional(),
    height: z.number().int().optional(),
  }),
  res: ZMedia.pick({
    id: true,
  })
})

const schema = {
  PublicMediaPostOne
};

export default schema;