import { JSend } from "@/lib/utils/jsend";

export async function handleGetLocalScore() {
  return JSend.error("Local score is handled client-side.", 400);
}
