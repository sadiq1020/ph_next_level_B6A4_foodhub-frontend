// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "images.unsplash.com",
//       },
//     ],
//     formats: ["image/webp"],
//   },
// };

// export default nextConfig;

import { env } from "@/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "deifkwefumgah.cloudfront.net",
      },
    ],
    formats: ["image/webp"],
  },
  // ✅ Add proxy rewrites
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${env.BACKEND_URL}/api/auth/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${env.BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
