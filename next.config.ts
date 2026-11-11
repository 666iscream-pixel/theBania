import type { NextConfig } from "next";

// GitHub Pages: statyczny eksport w podkatalogu /theBania (zmienna ustawiana w workflow)
const pages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Eksport statyczny nie obsługuje PPR — na podgląd wyłączamy te opcje i budujemy do osobnego katalogu
  ...(pages
    ? { output: "export" as const, trailingSlash: true, basePath, images: { unoptimized: true }, distDir: ".next-pages" }
    : { cacheComponents: true, partialPrefetching: true }),
  // Bez znaczka „N” Next.js w rogu podczas pokazu (widoczny tylko w trybie deweloperskim)
  devIndicators: false,
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
