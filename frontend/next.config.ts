import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 非同期でヘッダー情報を返す関数を定義
  async headers() {
    return [
      {
        // アプリケーションのすべてのパスに適用
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups', // ポップアップを許可
          },
        ],
      },
    ]
  },
}

export default nextConfig
