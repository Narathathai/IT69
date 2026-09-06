/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@uni-it/api-contracts',
    '@uni-it/iam',
    '@uni-it/status-page',
    '@uni-it/itsm',
    '@uni-it/ai-support',
    '@uni-it/infra-catalog',
  ],
  reactStrictMode: true,
};

module.exports = nextConfig;
