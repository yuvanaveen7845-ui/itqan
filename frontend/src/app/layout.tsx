import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CMSInitializer from '@/components/CMSInitializer';

export const metadata: Metadata = {
  title: 'iqtanperfumes - Premium Perfumes',
  description: 'Shop premium perfume collection online',
  verification: {
    google: 'msK-ZYzBvG3sbbtEkAYo4NtN4LLTZwZ7BC4-HQG37UA',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className="antialiased" suppressHydrationWarning={true}>
        <CMSInitializer />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
