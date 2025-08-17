import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 本番用: allowedOriginsは本番ドメインのみ
  experimental: {
    serverActions: {
      allowedOrigins: [
        'https://word-wise.jp',
        'http://localhost:3000',
        'https://localhost:3000',
      ],
    },
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
  // 本番用: output: 'standalone' を推奨
  output: 'standalone',
}

export default nextConfig
