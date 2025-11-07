import type { NextConfig } from "next";
import { withTamagui } from "@tamagui/next-plugin";

const nextConfig: NextConfig = {
  transpilePackages: ["@rapidphoto/shared", "@rapidphoto/api-client"],
};

const tamaguiPlugin = withTamagui({
  config: "./tamagui.config.ts",
  components: ["tamagui"],
  appDir: true,
  // Disable extraction in development for better performance
  disableExtraction: process.env.NODE_ENV === "development",
});

export default tamaguiPlugin(nextConfig);
