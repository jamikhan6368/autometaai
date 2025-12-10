import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle node: protocol imports for Better Auth
      config.externals = config.externals || [];
      config.externals.push({
        'node:crypto': 'commonjs crypto',
        'node:buffer': 'commonjs buffer',
        'node:stream': 'commonjs stream',
        'node:util': 'commonjs util',
        'node:module': 'commonjs module',
      });
    }
    return config;
  },
};

export default nextConfig;
