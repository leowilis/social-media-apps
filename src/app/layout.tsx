import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import './globals.css';
import ProviderContainer from "@/app/provider/index"

/**
 * Local SF Pro font configuration.
 * Uses CSS variable for Tailwind / global usage.
 */
const sfPro = localFont({
  src: [
    {
      path: '../fonts/SF-Pro-Display-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/SF-Pro-Display-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/SF-Pro-Display-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sfpro',
  display: 'swap', // better performance
});

// Global metadata
export const metadata: Metadata = {
  title: 'Sociality',
  description: 'Social media app',
};

/**
 * Root layout component
 * - Applies global font
 * - Wraps app with providers (Redux, React Query, etc.)
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${sfPro.variable} antialiased`}>
        <ProviderContainer>{children}</ProviderContainer>
      </body>
    </html>
  );
}
