const isVercel = Boolean(process.env.VERCEL);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: isVercel ? undefined : "export",
  distDir: isVercel ? undefined : "dist",
  assetPrefix: isVercel ? undefined : "./",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
