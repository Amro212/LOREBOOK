import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use a custom dist dir to avoid stale .next artifacts on Windows
  distDir: ".next-dev",
  // Note: webpackDevMiddleware is not supported in Next 15 config; polling handled via npm scripts
};

export default nextConfig;
