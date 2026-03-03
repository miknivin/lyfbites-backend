/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const isProd = process.env.NODE_ENV === "production";
    const allowedOrigin = isProd
      ? "https://www.lifefoods.in"
      : "http://localhost:5173";
    return [
      {
        // COOP header needed for Firebase Google popup sign-in
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: allowedOrigin,
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
