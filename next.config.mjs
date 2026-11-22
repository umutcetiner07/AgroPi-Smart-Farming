/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    domains: ['localhost', 'agropicbecaed4844.pinet.com'],
  },
  output: 'standalone',
  basePath: '',
  assetPrefix: '',
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // socialchain.app: Pi SDK authenticate() için zorunlu
            // frame-ancestors: Pi Browser ve Sandbox iframe erişimi (*.pinet.com, *.minepi.com)
            value: [
              "default-src 'self'",
              "script-src 'self' https://sdk.minepi.com https://agropicbecaed4844.pinet.com 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.minepi.com https://socialchain.app https://agropicbecaed4844.pinet.com",
              "frame-ancestors 'self' https://*.pinet.com https://*.minepi.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
}

export default nextConfig
