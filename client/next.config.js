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
    ];
  },
};

module.exports = nextConfig;

