import type { NextConfig } from "next";

const BACKEND_URL = "https://ph-next-level-b6a4-foodhub-backend.onrender.com";

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
  async rewrites() {
    return [
      // ✅ Auth routes (most specific first)
      {
        source: "/api/auth/:path*",
        destination: `${BACKEND_URL}/api/auth/:path*`,
      },
      // ✅ API routes
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
      // ✅ Backend routes (categories, meals, etc.)
      {
        source: "/categories/:path*",
        destination: `${BACKEND_URL}/categories/:path*`,
      },
      {
        source: "/meals/:path*",
        destination: `${BACKEND_URL}/meals/:path*`,
      },
      {
        source: "/provider-profile/:path*",
        destination: `${BACKEND_URL}/provider-profile/:path*`,
      },
      {
        source: "/orders/:path*",
        destination: `${BACKEND_URL}/orders/:path*`,
      },
      {
        source: "/users/:path*",
        destination: `${BACKEND_URL}/users/:path*`,
      },
      {
        source: "/reviews/:path*",
        destination: `${BACKEND_URL}/reviews/:path*`,
      },
      {
        source: "/admin/:path*",
        destination: `${BACKEND_URL}/admin/:path*`,
      },
      {
        source: "/provider/:path*",
        destination: `${BACKEND_URL}/provider/:path*`,
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
