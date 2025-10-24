/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  experimental: {
    // Enable static optimization where possible
    optimizeCss: true,
    // Improve build performance
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  // Enable static generation for pages that can be statically generated
  trailingSlash: false,
  // Optimize images
  images: {
    formats: ["image/webp", "image/avif"],
  },
};

export default config;
