'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cartContext';

const CATEGORIES_LIST = [
  'NEW DROP',
  'SALE',
  'ACCESSORIES',
  'BODYS',
  'BOTTOMS',
  'COATS',
  'CORSETS',
  'DRESSES',
  'JACKETS',
  'SKIRTS',
  'SPECIAL EDITION',
  'TOPS',
];

export default function MenuModal() {
  const { isMenuOpen, setIsMenuOpen, menuTab, setMenuTab } = useCart();

  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  if (!isMenuOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#fff',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        overflowY: 'auto',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <button
            type="button"
            onClick={() => setMenuTab('menu')}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'PP Fraktion Mono, monospace',
              fontSize: '1.2rem',
              color: menuTab === 'menu' ? '#ff2d20' : '#888',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            [ MENU ]
          </button>
          <button
            type="button"
            onClick={() => setMenuTab('categories')}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'PP Fraktion Mono, monospace',
              fontSize: '1.2rem',
              color: menuTab === 'categories' ? '#ff2d20' : '#888',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            [ CATEGORIES ]
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.0769 10L22 10.9231L16.9231 16L22 21.0769L21.0769 22L16 16.9231L10.9231 22L10 21.0769L15.0769 16L10 10.9231L10.9231 10L16 15.0769L21.0769 10Z" fill="#fff" />
          </svg>
        </button>
      </div>

      {/* Main Links */}
      <div style={{ margin: 'auto 0', padding: '3rem 0' }}>
        {menuTab === 'menu' ? (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {[
              { label: 'SHOP ALL', href: '#arrivals' },
              { label: 'COLLECTIONS', href: '#arrivals' },
              { label: 'CAMPAIGN', href: '#campaign' },
              { label: 'FILM', href: '#film' },
              { label: 'ABOUT', href: '#about' },
              { label: 'CONTACT', href: '#contact' },
            ].map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    fontFamily: 'Thunder, sans-serif',
                    fontSize: 'clamp(4rem, 8vw, 8rem)',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: '#fff',
                    textDecoration: 'none',
                    lineHeight: 0.9,
                    transition: 'color 0.2s ease',
                    display: 'inline-block',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ff2d20')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {CATEGORIES_LIST.map((cat, idx) => (
              <li key={idx}>
                <a
                  href="#categories"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    fontFamily: 'Thunder, sans-serif',
                    fontSize: 'clamp(3rem, 5vw, 5rem)',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ff2d20')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
                >
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer / Social Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #222',
          paddingTop: '2rem',
          fontFamily: 'PP Fraktion Mono, monospace',
          fontSize: '1.1rem',
        }}
      >
        <div>© 2026 SEROTONINN</div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a
            href="https://www.instagram.com/serotoninn_official/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fff', textDecoration: 'none' }}
          >
            INSTAGRAM ↗
          </a>
        </div>
      </div>
    </div>
  );
}
