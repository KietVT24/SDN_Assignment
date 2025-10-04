/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from any http/https host so all external links work
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
}

module.exports = nextConfig
