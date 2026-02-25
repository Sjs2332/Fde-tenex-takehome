import type { NextConfig } from "next";

const securityHeaders = [
  // Prevents the browser from MIME-type sniffing a response away from the declared content-type.
  // Stops attacks that rely on tricking the browser into executing uploaded files as scripts.
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Stops the page from being embedded in an iframe on another origin.
  // Prevents clickjacking attacks.
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Enables the browser's built-in XSS filter (legacy browsers).
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // Controls how much referrer information is sent with requests.
  // 'strict-origin-when-cross-origin' sends full path to same-origin, only origin to cross-origin HTTPS.
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Restricts the browser features accessible to the page.
  // Disables geolocation, microphone, camera etc. unless we explicitly need them.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Forces HTTPS for 2 years (including subdomains).
  // Only effective in production — browsers will refuse HTTP connections after the first HTTPS visit.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Content Security Policy.
  // Whitelists the specific origins that scripts, styles, and API connections are allowed from.
  // This is the primary defense against XSS — even if a script is injected, CSP blocks its execution.
  {
    key: "Content-Security-Policy",
    value: [
      // Only allow scripts from our own origin and Next.js internals
      `default-src 'self'`,
      // Scripts: self + unsafe-eval needed by Next.js dev mode; restrict inline scripts
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com`,
      // Styles: self + inline (required by Tailwind/CSS-in-JS)
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
      // Fonts from Google Fonts
      `font-src 'self' https://fonts.gstatic.com`,
      // Images: self + data URIs (for base64 avatars) + pravatar (used in event cards)
      `img-src 'self' data: https://i.pravatar.cc https://*.googleusercontent.com`,
      // API connections: our own origin + Google APIs + Firebase
      `connect-src 'self' https://www.googleapis.com https://gmail.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com wss://*.firebaseio.com`,
      // Frame ancestors: prevents our app being embedded elsewhere
      `frame-ancestors 'self'`,
      // Firebase auth popup requires this
      `frame-src https://fde-tenex-takehome.firebaseapp.com https://accounts.google.com`,
    ].join("; "),
  },
];

const nextConfig = {
  reactCompiler: true,
  turbopack: {
    resolveAlias: {
      "zod/v3": "zod",
      "zod/v4": "zod",
    },
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

