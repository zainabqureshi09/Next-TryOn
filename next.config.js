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
  webpack: (config, { isServer }) => {
    // Fallback configurations for browser compatibility
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
      constants: false,
      zlib: false,
      http: false,
      https: false,
      net: false,
      tls: false,
      child_process: false,
    };
    
    // For TensorFlow.js compatibility
    if (!isServer) {
      // Handle ESM modules
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
      };
      
      // Exclude specific modules from bundling
      config.externals = [
        ...(config.externals || []),
        {
          '@tensorflow/tfjs': 'tf',
          '@tensorflow-models/face-landmarks-detection': 'faceLandmarksDetection',
        },
      ];
    }
    
    // Handle specific module resolutions
    config.resolve.alias = {
      ...config.resolve.alias,
      // Add any necessary aliases here
    };
    
    return config;
  },
  // For TensorFlow.js - explicitly transpile these packages
  transpilePackages: [
    '@tensorflow/tfjs', 
    '@tensorflow-models/face-landmarks-detection',
    // Add any other packages that need transpilation
  ],
  // Enable SWC minification for better performance
  swcMinify: true,
  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Environment variables
  env: {
    // Add any custom environment variables here
  },
};

module.exports = nextConfig;
