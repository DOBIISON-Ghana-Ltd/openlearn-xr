import prisma from '@/adapters/db/client';
import { JSend } from '@/lib/utils/jsend';
import { secureApiRoute } from '@/lib/utils/secure-api-route';
import { ZOnboardingMetadata } from '@/store/onboarding/schema';

export const PATCH = secureApiRoute(async (req, ctx, user) => {
  const body = ZOnboardingMetadata.parse(await req.json());

  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboarded: true,
      metadata: body,
    },
  });

  const res = JSend.success('Onboarding complete');
  res.cookies.delete('better-auth.session_data');

  return res;
});
