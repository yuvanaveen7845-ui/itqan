import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CMSInitializer from '@/components/CMSInitializer';
import DevModeToggle from '@/components/DevModeToggle';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'iqtanperfumes - Premium Perfumes',
  description: 'Shop premium perfume collection online',
  verification: {
    google: 'msK-ZYzBvG3sbbtEkAYo4NtN4LLTZwZ7BC4-HQG37UA',
  },
};

import CustomCursor from '@/components/CustomCursor';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className="antialiased lg:cursor-none" suppressHydrationWarning={true}>
        <CustomCursor />
        <CMSInitializer />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <DevModeToggle />
      </body>
    </html>
  );
}
