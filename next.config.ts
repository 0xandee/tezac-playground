/** @type {import('next').NextConfig} */
import { ProvidePlugin } from 'webpack';

const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['pino'],
  images: {
    domains: ['github.com', 'user-attachments'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/user-attachments/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Set fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      os: false,
      tls: false,
      buffer: require.resolve('buffer/'),
    };

    // Provide Buffer globally
    config.plugins.push(
      new ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );

    // Only apply this for server-side builds
    if (isServer) {
      // Add '@aztec/bb.js' to externals to prevent bundling
      config.externals = [...config.externals, '@aztec/bb.js'];
    }

    return config;
  },
};

export default nextConfig;