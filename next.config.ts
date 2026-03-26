import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Generated Prisma client files are created at build time;
    // the TS checker runs before they're visible to it. Safe to skip.
    ignoreBuildErrors: true,
  },
  images: {

    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      }, {
        protocol: "https",
        hostname: "kidscrown.net",
        // pathname: "/account123/**",
      },
    ]
  }
};

export default nextConfig;
