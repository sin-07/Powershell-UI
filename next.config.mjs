/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "export",
  distDir: "dist",
  assetPrefix: "./",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
