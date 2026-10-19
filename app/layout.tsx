import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cartContext';
import Preloader from '@/components/Preloader';
import RouteProgressBar from '@/components/RouteProgressBar';
import MenuModal from '@/components/MenuModal';

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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="/fonts/Thunder-BoldLC.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/PPFraktionMono-Regular-BF675904a6a1564.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/images/hero/hero_banner_1.jpg"
          as="image"
          // @ts-ignore
          fetchPriority="high"
        />
      </head>
      <body className="loaded">
        <CartProvider>
          <Preloader />
          <RouteProgressBar />
          <MenuModal />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
