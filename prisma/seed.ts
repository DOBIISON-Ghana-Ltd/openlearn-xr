import "dotenv/config";
import { auth } from "../src/adapters/auth/server";
import prisma from "../src/adapters/db/client";
import { getUniqueSlug } from "../src/lib/utils/get-unique-slug";
import { data } from "./data";

async function main() {
  console.log("🌱 Starting Open Learn XR database seed...");

  const adminEmail = "admin@openlearn.org";
  const adminPassword = "1234567890";
  const adminName = "Admin User";
  const org = "Open Learn Official";
  const orgSlug = "open-learn-official";

  // 1. Quick Guard Check
  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (adminUser) {
    console.log(`ℹ️ Seed skipped: Admin user already exists (${adminUser.id}).`);
    return;
  }

  // 2. Create User + Credentials
  console.log(`👤 Creating admin user (${adminEmail})...`);
  const signUpResult = await auth.api.signUpEmail({
    body: {
      email: adminEmail,
      password: adminPassword,
      name: adminName,
    },
  });

  adminUser = await prisma.user.update({
    where: { id: signUpResult.user.id },
    data: {
      role: "user,admin",
      image: "avatar-01",
      onboarded: true,
      emailVerified: true,
    },
  });
  console.log(`✅ Admin user created (ID: ${adminUser.id})`);

  // 3. Create Organization, Member (Owner), & Unlimited Subscription via Nested Write
  console.log("🏢 Creating Organization with Owner Membership & Unlimited Subscription...");
  const organization = await prisma.organization.create({
    data: {
      name: org,
      slug: orgSlug,
      logo: "org-01",
      members: {
        create: {
          userId: adminUser.id,
          role: "owner",
        },
      },
      subscriptions: {
        create: {
          tier: "UNLIMITED",
          status: "ACTIVE",
          isUnlimited: true,
          seats: 0,
        },
      },
    },
  });
  console.log(`✅ Organization, Member, and Subscription created (Org ID: ${organization.id})`);

  // 4. Create Collections, Modules, ModuleVersions, and Checkpoints
  console.log(`📚 Seeding ${data.length} Collections with ModuleVersions & Checkpoints...`);
  await Promise.all(
    data.map(async (item) => {
      console.log(`  ├─ Creating Collection: ${item.name} (${item.modules.length} modules)`);

      return prisma.collection.create({
        data: {
          name: item.name,
          slug: item.slug,
          description: item.description,
          grade: item.grade,
          modules: {
            create: item.modules.map((m) => ({
              title: m.title,
              slug: m.slug,
              image: m.image || null,
              description: m.description,
              orderIndex: m.orderIndex,
              difficulty: m.difficulty,
              duration: m.duration,
              versions: {
                create: m.versions.map((v) => ({
                  versionNumber: v.versionNumber,
                  status: v.status,
                  changeNote: v.changeNote,
                  createdById: adminUser.id,
                  publishedAt: new Date(),
                  interactiveConfig: v.interactiveConfig,
                  notes: v.notes as any,
                  checkpoints: {
                    create: v.checkpoints,
                  },
                })),
              },
            })),
          },
        },
      });
    })
  );

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
