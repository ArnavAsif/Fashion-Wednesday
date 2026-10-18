import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cartContext';
import Preloader from '@/components/Preloader';
import RouteProgressBar from '@/components/RouteProgressBar';

export const metadata: Metadata = {
  title: 'ELVAREN',
  description: 'Where Glam Meets Grunge - ELVAREN Official Store',
  icons: {
    icon: '/images/elvaren-logo.png',
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
              }
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="loaded">
        <CartProvider>
          <Preloader />
          <RouteProgressBar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
