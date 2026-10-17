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
        padding: isScrolled ? '1.8rem 3.5rem' : '2.5rem 3.5rem 1rem 3.5rem',
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: isScrolled ? 'center' : 'flex-start',
        transition: 'padding 0.3s ease',
        pointerEvents: 'auto',
        mixBlendMode: 'difference',
        color: '#ffffff',
      }}
    >
      {/* Left Section: MENU +, SHOP ALL, CATEGORIES +, [ 5-HT ] */}
      <div
        style={{
          display: 'flex',
          alignItems: isScrolled ? 'center' : 'flex-start',
          gap: isScrolled ? '2.8rem' : '5.5rem',
          transition: 'gap 0.3s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isScrolled ? 'row' : 'column',
            gap: isScrolled ? '2.8rem' : '0.5rem',
            alignItems: isScrolled ? 'center' : 'flex-start',
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
        </div>

        <div
          className="header-desktop-only"
          style={{
            paddingTop: isScrolled ? '0' : '2.2rem',
            transition: 'padding 0.3s ease',
          }}
        >
          <MarkerButton
            text="5-HT"
            brackets
            cloneLastChar
            href="/"
            fontSize={headerFontSize}
            style={{ fontWeight: 600 }}
          />
        </div>
      </div>

      {/* Center Section: BONEZ Logo */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: isScrolled ? 'translate(-50%, -50%)' : 'translateX(-50%)',
          top: isScrolled ? '50%' : '2.5rem',
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
            src="/images/bonez-logo-white.png"
            alt="BONEZ"
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
          flexDirection: isScrolled ? 'row' : 'column',
          gap: isScrolled ? '2.8rem' : '0.5rem',
          alignItems: isScrolled ? 'center' : 'flex-end',
          textAlign: 'right',
          transition: 'gap 0.3s ease',
        }}
      >
        {isScrolled ? (
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
