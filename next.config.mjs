/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/Portfolio' : '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactCompiler: true,
  basePath,
  assetPrefix: isProd ? `${basePath}/` : '',
  images: {
    unoptimized: true,
    qualities: [75, 80, 95, 100],
  },
};

export default nextConfig;
