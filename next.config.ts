import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'output: export' to support API routes and server-side features
  // This app requires server-side rendering for authentication and database access
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
