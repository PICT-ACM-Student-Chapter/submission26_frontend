const rawEnvUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "").trim();
let sanitizedUrl = rawEnvUrl ? rawEnvUrl.replace(/\/+$/, "") : "";

// In browser environments:
// If the app is served over HTTPS (e.g. Vercel deployment) and the backend URL is plain HTTP (e.g. http://13.200.56.216),
// browsers block the requests due to Mixed Content policy.
// We automatically route through Next.js reverse proxy (/backend-api) to guarantee seamless HTTPS-to-HTTP communication.
if (typeof window !== "undefined") {
  const isHttps = window.location.protocol === "https:";
  if (isHttps && sanitizedUrl.startsWith("http://")) {
    sanitizedUrl = "/backend-api";
  }
}

if (!sanitizedUrl) {
  sanitizedUrl =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "/backend-api"
      : "http://localhost:3001";
}

const apiConfig = {
  url: sanitizedUrl,
};

export default apiConfig;
