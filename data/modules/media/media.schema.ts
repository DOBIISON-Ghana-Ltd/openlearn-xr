import { ZApi, ZMedia, ZUser } from "@/data/schema.base";
import { z } from "zod";

const PublicMediaPostOne = ZApi({
  body: ZMedia.pick({
    folder: true,
    key: true,
    fileName: true,
    mimeType: true,
    width: true,
    height: true
  }),
  res: ZMedia.pick({
    id: true,
  })
})

const schema = {
  PublicMediaPostOne
};

export default schema;