import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * - HSTS forces HTTPS for two years (preload-ready).
 * - X-Frame-Options + frame-ancestors block clickjacking.
 * - nosniff stops MIME-type confusion attacks.
 * - Referrer-Policy avoids leaking full URLs cross-origin.
 * - Permissions-Policy strips access to APIs we don't use (cam, mic, geo).
 * - CSP scopes asset loading to known origins:
 *     - Sanity CDN for images
 *     - Cloudflare Turnstile for the CAPTCHA widget
 *     - Resend's verification API
 *     - envsn.com + vercel.app for everything else
 *   Inline scripts/styles stay allowed because Next.js + Tailwind inject
 *   them at runtime. Tightening to nonces is a larger lift for later.
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
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://*.sanity.io",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io https://envsn.com https://*.vercel.app",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.sanity.io https://api.resend.com https://challenges.cloudflare.com https://vitals.vercel-insights.com",
      "media-src 'self' https://envsn.com https://*.vercel.app",
      "frame-src https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
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
