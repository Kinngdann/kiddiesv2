import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
