'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import MarkerButton from '@/components/MarkerButton';
import CartDrawer from '@/components/CartDrawer';
import MenuModal from '@/components/MenuModal';
import SearchModal from '@/components/SearchModal';
import CreditsModal from '@/components/CreditsModal';
import NewsletterModal from '@/components/NewsletterModal';
import { PRODUCTS, getProductSlug } from '@/lib/products';
import { useCart } from '@/lib/cartContext';

export default function CatalogPage() {
  const { addToCart, setIsCartOpen } = useCart();
  const [filter, setFilter] = useState<'ALL' | 'DRESSES' | 'CORSETS' | 'TOPS'>('ALL');
  const [creditsOpen, setCreditsOpen] = useState(false);

  const filtered = PRODUCTS.filter((p) => {
    if (filter === 'ALL') return true;
    if (filter === 'DRESSES') return p.title.toLowerCase().includes('dress');
    if (filter === 'CORSETS') return p.title.toLowerCase().includes('corset');
    if (filter === 'TOPS') return p.title.toLowerCase().includes('top') || p.title.toLowerCase().includes('shirt');
    return true;
  });

  return (
    <div style={{ backgroundColor: '#fff9f7', minHeight: '100vh', color: '#000' }}>
      <Header />
      <CartDrawer />
      <MenuModal />
      <SearchModal />
      <CreditsModal isOpen={creditsOpen} onClose={() => setCreditsOpen(false)} />
      <NewsletterModal />

      <main style={{ paddingTop: '11rem', paddingBottom: '10rem', maxWidth: '1580px', margin: '0 auto', paddingLeft: '3rem', paddingRight: '3rem' }}>
        {/* Catalog Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h1
              style={{
                fontFamily: 'Thunder, sans-serif',
                fontSize: 'clamp(4rem, 6vw, 7.5rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                margin: '0 0 0.5rem 0',
                letterSpacing: '-0.02em',
                lineHeight: 0.9,
              }}
            >
              All Products
            </h1>
            <p style={{ fontFamily: 'PP Fraktion Mono, monospace', fontSize: '1.2rem', color: '#666', margin: 0 }}>
              [{filtered.length} ITEMS TOTAL]
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {(['ALL', 'DRESSES', 'CORSETS', 'TOPS'] as const).map((cat) => (
              <MarkerButton
                key={cat}
                text={cat}
                brackets
                fontSize="1.3rem"
                active={filter === cat}
                onClick={() => setFilter(cat)}
              />
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '3.5rem 2.5rem',
          }}
        >
          {filtered.map((product) => {
            const slug = getProductSlug(product);
            const img = product.images?.[0]?.[0] || '/images/arrivals/Sunna-Dress_01W.webp';
            const hoverImg = product.images?.[1]?.[0] || img;

            return (
              <div key={product.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <Link
                  href={`/products/${slug}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block', overflow: 'hidden' }}
                  className="catalog-card"
                >
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '0.73',
                      backgroundColor: '#f3edea',
                      position: 'relative',
                      overflow: 'hidden',
                      marginBottom: '1.2rem',
                    }}
                  >
                    <img
                      src={img}
                      alt={product.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                      className="catalog-img"
                    />
                    {product.bestseller && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          left: '1rem',
                          backgroundColor: '#ed3833',
                          color: '#fff',
                          fontFamily: 'PP Fraktion Mono, monospace',
                          fontSize: '0.9rem',
                          padding: '0.3rem 0.8rem',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                        }}
                      >
                        BEST SELLER
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                    <h2
                      style={{
                        fontFamily: 'Thunder, sans-serif',
                        fontSize: '2.4rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        margin: 0,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {product.title}
                    </h2>
                    <span
                      style={{
                        fontFamily: 'PP Fraktion Mono, monospace',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#ed3833',
                      }}
                    >
                      ({product.price.toFixed(2).replace('.', ',')}_€)
                    </span>
                  </div>
                </Link>

                {/* Quick Add and Sizes */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    {(product.size?.slice(0, 3) || ['S', 'M']).map((s) => (
                      <MarkerButton
                        key={s}
                        text={s}
                        brackets
                        fontSize="1.1rem"
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            title: `${product.title} (${s})`,
                            price: product.price,
                            quantity: 1,
                            size: [s],
                            color: product.color || [],
                            images: [[img]],
                            href: `/products/${slug}`,
                            bestseller: product.bestseller,
                            createdAt: product.createdAt,
                          });
                          setIsCartOpen(true);
                        }}
                      />
                    ))}
                  </div>

                  <MarkerButton
                    text="VIEW"
                    brackets
                    fontSize="1.1rem"
                    href={`/products/${slug}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <FooterSection onOpenCredits={() => setCreditsOpen(true)} />

      <style jsx global>{`
        .catalog-card:hover .catalog-img {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
}
