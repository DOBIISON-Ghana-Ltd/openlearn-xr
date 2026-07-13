import prisma from '@/adapters/db/client';
import { nanoid } from 'nanoid';
import { getUniqueSlug } from '@/lib/utils/get-unique-slug';

export const getInitialOrganization = async (userId: string) => {
  let orgId: string | null = null;

  const existingMember = await prisma.member.findFirst({
    where: { userId: userId }
  });

  if (!existingMember) {
    const owner = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });

    if (owner) {
      const orgName = `${owner.name}'s Org`;
      const uniqueSlug = getUniqueSlug(orgName);

      const org = await prisma.organization.create({
        data: {
          name: orgName,
          slug: uniqueSlug,
          members: {
            create: {
              userId: userId,
              role: 'owner',
            }
          },
          subscription: {
            create: {
              tier: "FREE"
            }
          }
        }
      });
      orgId = org.id;
    }
  } else {
    orgId = existingMember.organizationId;
  }

  return orgId;
};
