const rawBackend =
  process.env.BACKEND_PROXY_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://13.200.56.216";
const targetBackend = rawBackend.trim().replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Expose proxy status to client bundle when BACKEND_PROXY_URL is configured
    NEXT_PUBLIC_PROXY_ENABLED: process.env.BACKEND_PROXY_URL ? "true" : "",
  },
  async rewrites() {
    return [
      {
        source: "/hacknova/team",
        destination: "/hacknova-team",
      },
      {
        source: "/hacknova-team-registration",
        destination: "/hacknova-team",
      },
      {
        source: "/backend-api/:path*",
        destination: `${targetBackend}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

