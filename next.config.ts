// next.config.ts
import type { NextConfig } from "next";

// Point Turbopack at the folder that contains YOUR package-lock.json
const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname, // <- correct location (top-level), not under "experimental"
  },
  // keep any other config you already had here
};

export default nextConfig;
