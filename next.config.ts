import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/module/:path*",
        destination: "/modules/:path*",
      },
    ];
  },
};

export default nextConfig;
