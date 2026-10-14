'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS, Product, getProductSlug } from '@/lib/products';
import { useCart } from '@/lib/cartContext';
import MarkerButton from '@/components/MarkerButton';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addToCart } = useCart();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filtered = query.trim()
    ? PRODUCTS.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.color?.some((c) => c.toLowerCase().includes(query.toLowerCase()))
      )
    : PRODUCTS.slice(0, 8); // show 8 popular items when no query

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#fff',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      {/* Top Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2.5rem 3rem',
          borderBottom: '1px solid #eee',
        }}
      >
        <div style={{ flex: 1, maxWidth: '800px' }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search (e.g. dress, corset, jacket)..."
            autoFocus
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontFamily: 'Thunder, sans-serif',
              fontSize: '3.5rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#000',
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => setIsSearchOpen(false)}
          aria-label="Close"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '1rem',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.0769 10L22 10.9231L16.9231 16L22 21.0769L21.0769 22L16 16.9231L10.9231 22L10 21.0769L15.0769 16L10 10.9231L10.9231 10L16 15.0769L21.0769 10Z" fill="#000" />
          </svg>
        </button>
      </div>

      {/* Results Section */}
      <div style={{ padding: '3rem', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'PP Fraktion Mono, monospace',
              fontSize: '1.2rem',
              textTransform: 'uppercase',
              color: '#666',
            }}
          >
            {query.trim()
              ? `[ ${filtered.length} RESULTS FOR "${query}" ]`
              : '[ POPULAR ITEMS ]'}
          </span>

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'PP Fraktion Mono, monospace',
                fontSize: '1rem',
                cursor: 'pointer',
                color: '#999',
              }}
            >
              CLEAR
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <h3
              style={{
                fontFamily: 'Thunder, sans-serif',
                fontSize: '4.5rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                margin: '0 0 1rem 0',
              }}
            >
              Nothing matches your search
            </h3>
            <p
              style={{
                fontFamily: 'PP Fraktion Mono, monospace',
                fontSize: '1.2rem',
                color: '#666',
              }}
            >
              Check the spelling or try searching for another term like &quot;corset&quot;, &quot;dress&quot;, or &quot;top&quot;.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {filtered.map((product) => {
              const slug = getProductSlug(product);
              const img = product.images?.[0]?.[0] || '/images/products/product-3/image_01.jpg';
              return (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#f9f9f9',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <Link
                    href={`/products/${slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <div style={{ width: '100%', height: '340px', backgroundColor: '#f0f0f0', position: 'relative' }}>
                      <img
                        src={img}
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </Link>

                  <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <Link
                        href={`/products/${slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <h4
                          style={{
                            fontFamily: 'Thunder, sans-serif',
                            fontSize: '2rem',
                            fontWeight: 700,
                            margin: 0,
                            textTransform: 'uppercase',
                          }}
                        >
                          {product.title}
                        </h4>
                      </Link>
                      <span
                        style={{
                          fontFamily: 'PP Fraktion Mono, monospace',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: '#ed3833',
                        }}
                      >
                        ({product.price.toFixed(2).replace('.', ',')}_€)
                      </span>
                    </div>

                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                      <MarkerButton
                        text="ADD TO BAG"
                        brackets
                        cloneLastChar
                        onClick={() => {
                          addToCart(product);
                          setIsSearchOpen(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
