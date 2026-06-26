import prisma from '@/adapters/db/client';
import { nanoid } from 'nanoid';

export const provisionDefaultOrg = async (session: any) => {
  // Only provision a default org if the user doesn't already have one.
  // This fires after every successful sign-in, so the guard is essential.
  const existingMember = await prisma.member.findFirst({
    where: { userId: session.userId }
  });

  if (!existingMember) {
    const owner = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true }
    });

    if (owner) {
      const { default: slugify } = await import('@sindresorhus/slugify');
      const orgName = `${owner.name}'s Org`;
      const baseSlug = slugify(orgName);
      const uniqueSlug = `${baseSlug}-${nanoid(6)}`;

      const org = await prisma.organization.create({
        data: {
          name: orgName,
          slug: uniqueSlug,
          members: {
            create: {
              userId: session.userId,
              role: 'owner',
            }
          }
        }
      });

      // Explicitly update the session's active organization ID
      await prisma.session.update({
        where: { id: session.id },
        data: { activeOrganizationId: org.id }
      });
    }
  }
};
