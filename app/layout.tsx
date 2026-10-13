import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cartContext';

export const metadata: Metadata = {
  title: 'Serotoninn',
  description: 'Where Glam Meets Grunge - Serotoninn Official Store',
  icons: {
    icon: '/images/favicon.png',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="loaded">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
