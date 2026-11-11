import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bez znaczka „N” Next.js w rogu podczas pokazu (widoczny tylko w trybie deweloperskim)
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
