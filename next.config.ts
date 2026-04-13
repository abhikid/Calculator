import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set root to avoid workspace root detection warning
    root: path.resolve(__dirname),
  },
}

export default nextConfig
