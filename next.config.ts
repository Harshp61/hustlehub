import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xdznrdetyxtboyypvzlw.supabase.co",
        port: "",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
