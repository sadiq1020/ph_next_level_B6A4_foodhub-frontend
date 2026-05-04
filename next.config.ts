import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/webp"],
  },
  async rewrites() {
    return [
      // ✅ Auth routes
      {
        source: "/api/auth/:path*",
        destination: `${BACKEND_URL}/api/auth/:path*`,
      },
      // ✅ ALL backend API calls through /api prefix
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;

// ✅ Add proxy rewrites
// async rewrites() {
//   return [
//     {
//       source: "/api/auth/:path*",
//       destination: `${env.BACKEND_URL}/api/auth/:path*`,
//     },
//     {
//       source: "/api/:path*",
//       destination: `${env.BACKEND_URL}/:path*`,
//     },
//   ];
// },
