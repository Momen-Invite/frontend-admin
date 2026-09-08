import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.momeninvite.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "pub-*.r2.dev",
      },
    ],
  },
  async headers() {
    return [
      {
        // Admin portal is private - never index on search engines
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  async rewrites() {
    const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || "https://api.momeninvite.web.id";
    return [
      // ── API Proxy ──────────────────────────────────────────────────────────
      // Meneruskan semua request /api/* ke backend Momen Invite.
      // Ini menyelesaikan masalah cross-origin cookie (connect.sid):
      // Browser mengirim request ke localhost:3000/api/* (same-origin),
      // Next.js meneruskannya ke api.momeninvite.web.id/api/* server-side.
      {
        source: "/api/:path*",
        destination: `${API_ORIGIN}/api/:path*`,
      },
      // ── Admin Path Aliases ─────────────────────────────────────────────────
      {
        source: "/admin",
        destination: "/",
      },
      {
        source: "/admin/:path*",
        destination: "/:path*",
      },
    ];
  },
};

export default nextConfig;
