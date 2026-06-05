import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * - HSTS forces HTTPS for two years (preload-ready).
 * - X-Frame-Options blocks clickjacking.
 * - nosniff stops MIME-type confusion attacks.
 * - Referrer-Policy avoids leaking full URLs cross-origin.
 * - Permissions-Policy strips access to APIs we don't use (cam, mic, geo).
 *
 * Content-Security-Policy was tried with a strict allow-list and broke
 * the Cloudflare Turnstile widget + Next.js server actions. Leaving CSP
 * off for now — it needs careful per-route tuning (Studio + form pages
 * each need different allowances) which is a larger follow-up.
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
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
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to every route, including the embedded Sanity Studio at /studio
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
