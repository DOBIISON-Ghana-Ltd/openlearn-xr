import ZApp from "@/data/api/app/app.schema";
import { JSend } from "@/lib/utils/jsend";
import { secureApiRoute } from "@/lib/utils/secure-api-route";

const ZGetRes = ZApp.AppUserGetProfile.shape.res;

export const GET = secureApiRoute(async (req, ctx, user) => {
  const profile = ZGetRes.parse({
    name: user.name || "Kofi Antwi",
    role: user.role || "Learner",
    email: user.email || "kofi.antwi@school.edu.gh",
    phone: "+233 24 567 8901",
    location: "Accra, Ghana",
    school: "Accra Senior High School",
    classLevel: "SHS 2 - Science",
    memberSince: "Jan 20, 2024",
    image: user.image || undefined,
  });

  return JSend.success(profile);
});
