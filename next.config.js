/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // unoptimized: true,
    domains: [
      'my-notes-picture-derek-zhu.s3.ap-southeast-2.amazonaws.com',
    ],
  },
};

module.exports = nextConfig;
