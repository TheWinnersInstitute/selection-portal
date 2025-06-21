import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: [process.env.NEXT_PUBLIC_API_URL as string],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "portal.winnersinstitute.in",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
