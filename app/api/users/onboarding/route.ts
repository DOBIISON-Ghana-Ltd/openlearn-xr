import prisma from '@/adapters/db/client';
import { JSend } from '@/lib/utils/jsend';
import { secureApiRoute } from '@/lib/utils/secure-api-route';
import { ZOnboardingMetadata } from '@/store/onboarding/schema';
import { cookies } from 'next/headers';

export const PATCH = secureApiRoute(async (req, ctx, user) => {
  const body = ZOnboardingMetadata.parse(await req.json());

  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboarded: true,
      metadata: body,
    },
  });

  // Force Better Auth to rebuild the session cache on the next request
  const cookieStore = await cookies();
  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.includes('better-auth') && cookie.name.includes('cache')) {
      cookieStore.delete(cookie.name);
    }
  }

  return JSend.success('Onboarding complete');
});
