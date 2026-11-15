import type { NextConfig } from "next";

// Static export: the site is plain HTML/CSS/JS and can be hosted anywhere.
// NEXT_PUBLIC_BASE_PATH lets the same build live under a sub-path (e.g. project GitHub Pages).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
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
