'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import CartDrawer from '@/components/CartDrawer';
import MenuModal from '@/components/MenuModal';
import SearchModal from '@/components/SearchModal';
import CreditsModal from '@/components/CreditsModal';
import NewsletterModal from '@/components/NewsletterModal';
import MarkerButton from '@/components/MarkerButton';
import CatalogGrid from '@/components/CatalogGrid';
import { COLLECTIONS } from '@/lib/products';

export default function CollectionsPage() {
  const [creditsOpen, setCreditsOpen] = useState(false);

  return (
    <div style={{ backgroundColor: '#fff9f7', minHeight: '100vh', color: '#000' }}>
      <Header />
      <CartDrawer />
      <MenuModal />
      <SearchModal />
      <CreditsModal isOpen={creditsOpen} onClose={() => setCreditsOpen(false)} />
      <NewsletterModal />

      <main
        style={{
          paddingTop: '11rem',
          paddingBottom: '10rem',
          maxWidth: '1580px',
          margin: '0 auto',
          paddingLeft: '3rem',
          paddingRight: '3rem',
        }}
      >
        {/* Collections Overview Banner */}
        <div style={{ marginBottom: '5rem', borderBottom: '1px solid #e0d7d4', paddingBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '2.5rem' }}>
            <div>
              <h1
                style={{
                  fontFamily: 'Thunder, sans-serif',
                  fontSize: 'clamp(4.5rem, 7vw, 8.5rem)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  margin: '0 0 0.5rem 0',
                  letterSpacing: '-0.02em',
                  lineHeight: 0.85,
                }}
              >
                Collections
              </h1>
              <p
                style={{
                  fontFamily: 'PP Fraktion Mono, monospace',
                  fontSize: '1.2rem',
                  color: '#666',
                  margin: 0,
                }}
              >
                [ CURATED RUNWAY & CAPSULE ARCHIVES ]
              </p>
            </div>
          </div>

          {/* Collection Cards Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {COLLECTIONS.map((c) => (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '2rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #ebe2de',
                  transition: 'border-color 0.2s ease, transform 0.2s ease',
                }}
                className="collection-hub-card"
              >
                <div>
                  <span
                    style={{
                      fontFamily: 'PP Fraktion Mono, monospace',
                      fontSize: '0.95rem',
                      color: '#ed3833',
                      fontWeight: 700,
                      display: 'block',
                      marginBottom: '0.8rem',
                    }}
                  >
                    // COLLECTION
                  </span>
                  <h2
                    style={{
                      fontFamily: 'Thunder, sans-serif',
                      fontSize: '2.8rem',
                      fontWeight: 800,
                      lineHeight: 0.95,
                      textTransform: 'uppercase',
                      margin: '0 0 1rem 0',
                    }}
                  >
                    {c.name}
                  </h2>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1.2rem',
                      color: '#555',
                      lineHeight: 1.45,
                      margin: 0,
                    }}
                  >
                    {c.description}
                  </p>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <MarkerButton
                    text="EXPLORE"
                    brackets
                    fontSize="1.15rem"
                    href={`/collections/${c.slug}`}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Full Catalog with filtering */}
        <Suspense fallback={<div>Loading catalog...</div>}>
          <CatalogGrid pageTitle="All Products" />
        </Suspense>
      </main>

      <FooterSection onOpenCredits={() => setCreditsOpen(true)} />

      <style jsx global>{`
        .collection-hub-card:hover {
          border-color: #ed3833 !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
