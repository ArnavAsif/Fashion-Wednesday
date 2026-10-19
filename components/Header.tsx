'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cartContext';
import MarkerButton from '@/components/MarkerButton';

export default function Header({ isProductPage = false }: { isProductPage?: boolean }) {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, setIsSearchOpen, isMenuOpen, setIsMenuOpen, menuTab, openMenu } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  const isProd = isProductPage || (pathname && pathname.startsWith('/products/'));

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || document.documentElement.scrollTop || 0;
          setIsScrolled(y > 80);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headerFontSize = 'clamp(1.4rem, 1.2vw, 1.65rem)';
  const isHeaderCompact = isScrolled && !isMenuOpen;

  return (
    <header
      className="site-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 900,
        padding: isHeaderCompact ? '1.8rem 3.5rem' : '2.5rem 3.5rem 1rem 3.5rem',
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: isHeaderCompact ? 'center' : 'flex-start',
        transition: 'padding 0.3s ease',
        pointerEvents: 'auto',
        mixBlendMode: 'difference',
        color: '#ffffff',
      }}
    >
      {/* Left Section: MENU +, SHOP ALL, CATEGORIES +, CLOSE ✕, [ 5-HT ] */}
      <div
        style={{
          display: 'flex',
          alignItems: isHeaderCompact ? 'center' : 'flex-start',
          gap: isHeaderCompact ? '2.8rem' : '5.5rem',
          transition: 'gap 0.3s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isHeaderCompact ? 'row' : 'column',
            gap: isHeaderCompact ? '2.8rem' : '0.5rem',
            alignItems: isHeaderCompact ? 'center' : 'flex-start',
            transition: 'gap 0.3s ease',
          }}
        >
          <MarkerButton
            text="MENU"
            suffix={<span style={{ marginLeft: '4px', fontSize: '1.2rem', lineHeight: 1 }}>{isMenuOpen && menuTab === 'menu' ? '-' : '+'}</span>}
            cloneLastChar
            onClick={() => {
              if (isMenuOpen && menuTab === 'menu') {
                setIsMenuOpen(false);
              } else {
                openMenu('menu');
              }
            }}
            fontSize={headerFontSize}
            style={{ fontWeight: 600 }}
          />
          <div className="header-tablet-only">
            <MarkerButton
              text="SHOP ALL"
              cloneLastChar
              href="/products"
              onClick={() => setIsMenuOpen(false)}
              fontSize={headerFontSize}
              style={{ fontWeight: 600 }}
            />
          </div>
          <div>
            <MarkerButton
              text="CATEGORIES"
              suffix={<span style={{ marginLeft: '4px', fontSize: '1.2rem', lineHeight: 1 }}>{isMenuOpen && menuTab === 'categories' ? '-' : '+'}</span>}
              cloneLastChar
              onClick={() => {
                if (isMenuOpen && menuTab === 'categories') {
                  setIsMenuOpen(false);
                } else {
                  openMenu('categories');
                }
              }}
              fontSize={headerFontSize}
              style={{ fontWeight: 600 }}
            />
          </div>
          {isMenuOpen && (
            <div>
              <MarkerButton
                text="CLOSE"
                suffix={<span style={{ marginLeft: '4px', fontSize: '1.2rem', lineHeight: 1 }}>✕</span>}
                cloneLastChar
                onClick={() => setIsMenuOpen(false)}
                fontSize={headerFontSize}
                style={{ fontWeight: 600 }}
              />
            </div>
          )}
        </div>

        <div
          className="header-desktop-only"
          style={{
            paddingTop: isHeaderCompact ? '0' : '2.2rem',
            transition: 'padding 0.3s ease',
          }}
        >
          <MarkerButton
            text="5-HT"
            brackets
            cloneLastChar
            href="/"
            onClick={() => setIsMenuOpen(false)}
            fontSize={headerFontSize}
            style={{ fontWeight: 600 }}
          />
        </div>
      </div>

      {/* Center Section: ELVAREN Logo */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: isHeaderCompact ? 'translate(-50%, -50%)' : 'translateX(-50%)',
          top: isHeaderCompact ? '50%' : '2.5rem',
          pointerEvents: 'auto',
          transition: 'top 0.3s ease, transform 0.3s ease',
        }}
      >
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="header__logo"
          style={{ display: 'block', visibility: 'inherit', opacity: 1, textAlign: 'center' }}
        >
          <img
            src="/images/elvaren-logo-white.png"
            alt="ELVAREN"
            style={{
              maxHeight: '32px',
              width: 'auto',
              display: 'inline-block',
              objectFit: 'contain',
            }}
          />
        </Link>
      </div>

      {/* Right Section: SEARCH, FAVORITES.0, BAG */}
      <div
        style={{
          display: 'flex',
          flexDirection: isHeaderCompact ? 'row' : 'column',
          gap: isHeaderCompact ? '2.8rem' : '0.5rem',
          alignItems: isHeaderCompact ? 'center' : 'flex-end',
          textAlign: 'right',
          transition: 'gap 0.3s ease',
        }}
      >
        {isHeaderCompact ? (
          <>
            <div className="header-tablet-only">
              <MarkerButton
                text="SEARCH"
                cloneLastChar
                onClick={() => setIsSearchOpen(true)}
                fontSize={headerFontSize}
                style={{ fontWeight: 600 }}
              />
            </div>
            <div className="header-tablet-only">
              <MarkerButton
                text="FAVORITES.0"
                cloneLastChar
                onClick={() => openMenu('menu')}
                fontSize={headerFontSize}
                style={{ fontWeight: 600 }}
              />
            </div>
            <MarkerButton
              text={`BAG.${cartCount}`}
              cloneLastChar
              onClick={() => setIsCartOpen(true)}
              fontSize={headerFontSize}
              style={{ fontWeight: 600 }}
            />
          </>
        ) : (
          <>
            <MarkerButton
              text={`BAG.${cartCount}`}
              cloneLastChar
              onClick={() => setIsCartOpen(true)}
              fontSize={headerFontSize}
              style={{ fontWeight: 600 }}
            />
            <div className="header-tablet-only">
              <MarkerButton
                text="SEARCH"
                cloneLastChar
                onClick={() => setIsSearchOpen(true)}
                fontSize={headerFontSize}
                style={{ fontWeight: 600 }}
              />
            </div>
            <div className="header-tablet-only">
              <MarkerButton
                text="FAVORITES.0"
                cloneLastChar
                onClick={() => openMenu('menu')}
                fontSize={headerFontSize}
                style={{ fontWeight: 600 }}
              />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
