/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

const cspDirectives = [
  "default-src 'self'",
  // Next.js requires unsafe-eval in dev; unsafe-inline is needed for Tailwind inline styles
  isDev ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'" : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Allow ArcGIS satellite tiles and OpenStreetMap for the Leaflet map
  "frame-src https://www.openstreetmap.org",
  "frame-ancestors 'none'",
  // upgrade-insecure-requests only when served over HTTPS
  ...(isProd && process.env.HTTPS === 'true' ? ["upgrade-insecure-requests"] : []),
].join('; ')

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Content-Security-Policy', value: cspDirectives },
]

const nextConfig = {
  output: 'standalone',
  devIndicators: { buildActivity: false },
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'solartecnologia.com.br' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
