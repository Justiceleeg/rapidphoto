import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@rapidphoto/shared", "@rapidphoto/api-client"],
};

export default nextConfig;
