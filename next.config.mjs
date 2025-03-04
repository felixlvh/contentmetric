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
  
  // Configure webpack with error handling
  webpack(config, { dev, isServer }) {
    // Add error handling through webpack
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
    }

    // Log environment variable status during build
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    requiredEnvVars.forEach(envVar => {
      if (!process.env[envVar]) {
        console.warn(`Warning: ${envVar} is not set. This may cause issues in production.`);
      }
    });

    return config;
  },

  // Add production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Handle environment-specific settings
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
