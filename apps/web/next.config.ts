import "@ai-hackathon/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
