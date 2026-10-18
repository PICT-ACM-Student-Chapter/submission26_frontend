const rawBackend =
  process.env.BACKEND_PROXY_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://13.200.56.216";
const targetBackend = rawBackend.trim().replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

