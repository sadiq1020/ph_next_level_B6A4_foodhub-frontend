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
      // ✅ Auth routes
      {
        source: "/api/auth/:path*",
        destination: `${BACKEND_URL}/api/auth/:path*`,
      },
      // ✅ API routes
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
      // ✅ Backend routes - IMPORTANT: Base routes without :path*
      {
        source: "/categories",
        destination: `${BACKEND_URL}/categories`,
      },
      {
        source: "/categories/:path*",
        destination: `${BACKEND_URL}/categories/:path*`,
      },
      {
        source: "/meals",
        destination: `${BACKEND_URL}/meals`,
      },
      {
        source: "/meals/:path*",
        destination: `${BACKEND_URL}/meals/:path*`,
      },
      {
        source: "/provider-profile",
        destination: `${BACKEND_URL}/provider-profile`,
      },
      {
        source: "/provider-profile/:path*",
        destination: `${BACKEND_URL}/provider-profile/:path*`,
      },
      {
        source: "/orders",
        destination: `${BACKEND_URL}/orders`,
      },
      {
        source: "/orders/:path*",
        destination: `${BACKEND_URL}/orders/:path*`,
      },
      {
        source: "/users",
        destination: `${BACKEND_URL}/users`,
      },
      {
        source: "/users/:path*",
        destination: `${BACKEND_URL}/users/:path*`,
      },
      {
        source: "/reviews",
        destination: `${BACKEND_URL}/reviews`,
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
        source: "/provider",
        destination: `${BACKEND_URL}/provider`,
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
