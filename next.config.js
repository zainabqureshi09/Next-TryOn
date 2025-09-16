/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 14 compatibility
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    domains: ['localhost', 'picsum.photos', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
    };
    return config;
  },
};

module.exports = nextConfig;
  