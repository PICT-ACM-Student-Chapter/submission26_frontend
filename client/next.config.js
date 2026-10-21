const rawBackend =
  process.env.BACKEND_PROXY_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://api.submission.pictacm.in";
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
        source: "/innowave/team",
        destination: "/innowave-team",
      },
      {
        source: "/innowave-team-registration",
        destination: "/innowave-team",
      },
      {
        source: "/backend-api/:path*",
        destination: `${targetBackend}/:path*`,
      },
      // Admin Portal & Backend Admin API Endpoints
      {
        source: "/admin/portal",
        destination: `${targetBackend}/admin/portal`,
      },
      {
        source: "/admin/csv-portal",
        destination: `${targetBackend}/admin/csv-portal`,
      },
      {
        source: "/admin/signin",
        destination: `${targetBackend}/admin/signin`,
      },
      {
        source: "/admin/signout",
        destination: `${targetBackend}/admin/signout`,
      },
      {
        source: "/admin/me",
        destination: `${targetBackend}/admin/me`,
      },
      {
        source: "/admin/csv/:path*",
        destination: `${targetBackend}/admin/csv/:path*`,
      },
      {
        source: "/admin/export-csv/:path*",
        destination: `${targetBackend}/admin/export-csv/:path*`,
      },
      {
        source: "/admin/submission-status/:path*",
        destination: `${targetBackend}/admin/submission-status/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

