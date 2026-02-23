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

  // ✅ Add proxy rewrites - use process.env directly
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.BACKEND_URL || "https://ph-next-level-b6a4-foodhub-backend.onrender.com"}/api/auth/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || "https://ph-next-level-b6a4-foodhub-backend.onrender.com"}/:path*`,
      },
      {
        source: "/:path*",
        destination: `${process.env.BACKEND_URL || "https://ph-next-level-b6a4-foodhub-backend.onrender.com"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
