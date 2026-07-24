import slugify from "@sindresorhus/slugify";
import { nanoid } from "nanoid";

export const getUniqueSlug = (name: string, withSuffix: boolean = true) => {
  const baseSlug = slugify(name);
  return withSuffix ? `${baseSlug}-${nanoid(6)}` : baseSlug;
};