import slugify from "@sindresorhus/slugify";
import { nanoid } from "nanoid";

export const getUniqueSlug = (name: string) => {
    const baseSlug = slugify(name);
    const uniqueSlug = `${baseSlug}-${nanoid(6)}`;
    return uniqueSlug;
}