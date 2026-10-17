'use client';

import React, { useState, Suspense } from 'react';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import CartDrawer from '@/components/CartDrawer';
import MenuModal from '@/components/MenuModal';
import SearchModal from '@/components/SearchModal';
import CreditsModal from '@/components/CreditsModal';
import NewsletterModal from '@/components/NewsletterModal';
import CatalogGrid from '@/components/CatalogGrid';

function CatalogFallback() {
  return (
    <div style={{ padding: '6rem 0', textAlign: 'center', fontFamily: 'PP Fraktion Mono, monospace' }}>
      <p style={{ fontSize: '1.2rem', color: '#888', letterSpacing: '0.05em' }}>
        [ LOADING CATALOG... ]
      </p>
    </div>
  );
}

export default function CatalogPage() {
  const [creditsOpen, setCreditsOpen] = useState(false);

  return (
    <div className="site-wrapper" style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'clip', backgroundColor: '#fff9f7', color: '#000' }}>
      <Header />
      <CartDrawer />
      <MenuModal />
      <SearchModal />
      <CreditsModal isOpen={creditsOpen} onClose={() => setCreditsOpen(false)} />
      <NewsletterModal />

      <main
        style={{
          paddingTop: '11rem',
          paddingBottom: '2rem',
          maxWidth: '1580px',
          margin: '0 auto',
          paddingLeft: '3rem',
          paddingRight: '3rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Suspense fallback={<CatalogFallback />}>
          <CatalogGrid />
        </Suspense>
      </main>

      <FooterSection onOpenCredits={() => setCreditsOpen(true)} />
    </div>
  );
}
