/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@uni-it/api-contracts', '@uni-it/iam', '@uni-it/status-page'],
  reactStrictMode: true,
};

module.exports = nextConfig;
