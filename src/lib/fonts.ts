import localFont from 'next/font/local';
import { Inter } from 'next/font/google';

// Define Inter as a fallback font (similar to Proxima Nova)
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Define Proxima Nova font with fallback to system fonts
export const proximaNova = localFont({
  src: '../assets/fonts/Proxima-Nova-Semibold.otf',
  display: 'swap',
  variable: '--font-proxima-nova',
  fallback: ['Inter', 'system-ui', 'sans-serif'],
}); 