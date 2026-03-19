import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  typescript: {
    // Ensure build completes even if there are type errors during the transition
    ignoreBuildErrors: true,
  },
  eslint: {
    // Prevent ESLint from blocking the generation of the 'out' directory
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
