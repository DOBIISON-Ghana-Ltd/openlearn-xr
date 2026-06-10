import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-auth@1.6.14 pulls in @better-auth/kysely-adapter which was built
  // against a kysely version that exported DEFAULT_MIGRATION_LOCK_TABLE /
  // DEFAULT_MIGRATION_TABLE. kysely@0.29.2 removed those exports.
  // Turbopack statically analyses ALL transitive imports and crashes on the
  // missing symbols even though we only use the prisma adapter.
  // Marking these as server externals tells Next.js to skip bundling them
  // and let Node.js resolve them at runtime instead.
  serverExternalPackages: [
    'better-auth',
    '@better-auth/kysely-adapter',
    'kysely',
  ],
};

export default nextConfig;
