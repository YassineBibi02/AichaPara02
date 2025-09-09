/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        // optional:
        // port: '',
        // pathname: '/photos/**',
      },
    ],
    // OR simply:
    // domains: ['images.pexels.com'],
  },
};

module.exports = nextConfig;
