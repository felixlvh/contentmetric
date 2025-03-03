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

  // Add production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Handle environment-specific settings
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Add error handling for missing environment variables
  onError: (err) => {
    console.error('Next.js build error:', err);
    if (err.code === 'ENOTFOUND') {
      console.error('Environment variables may be missing. Please check your Railway configuration.');
    }
  },
};

export default nextConfig;
