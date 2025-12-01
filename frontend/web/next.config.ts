import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// Add secure headers (CSP and common security headers)
export async function headers() {
  const csp = [
    "default-src 'self'",
    "img-src 'self' data: https:",
    "connect-src 'self' https: ws:",
    "style-src 'self' 'unsafe-inline' https:",
    "font-src 'self' data: https:",
  ].join('; ');

  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: csp },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'no-referrer' },
        { key: 'Permissions-Policy', value: 'geolocation=(), microphone=()' },
      ],
    },
  ];
}
