/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Set the output directory for the Next.js build
  distDir: '.next',
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configure webpack if needed
  webpack(config) {
    return config;
  },
};

export default nextConfig;
