import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hides the Next.js "N" badge shown in the corner during `npm run dev`.
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