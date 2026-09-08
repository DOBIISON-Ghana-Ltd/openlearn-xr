import { JSend } from "@/lib/utils/jsend";

export async function handlePostLocalTestScore() {
  return JSend.error("Local test score is handled client-side.", 400);
}
