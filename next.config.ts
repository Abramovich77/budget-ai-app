import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages configuration
  basePath: process.env.NODE_ENV === 'production' ? '/budget-ai-app' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/budget-ai-app/' : '',
};

export default nextConfig;
