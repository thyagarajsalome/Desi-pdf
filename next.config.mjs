/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['canvas'],
  turbopack: {} // Silences the turbopack warning
};

export default nextConfig;
