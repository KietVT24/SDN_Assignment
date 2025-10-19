/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Enable experimental features if needed
  experimental: {
    // serverActions: true,
  },
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fix for MongoDB in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
  // Environment variables to expose to browser
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  },
};

module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     // Allow images from any http/https host so all external links work
//     remotePatterns: [
//       { protocol: 'https', hostname: '**' },
//       { protocol: 'http', hostname: '**' },
//     ],
//   },
// }

// module.exports = nextConfig
