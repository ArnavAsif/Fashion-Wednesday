'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cartContext';
import MarkerButton from '@/components/MarkerButton';

export default function Header({ isProductPage = false }: { isProductPage?: boolean }) {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, setIsSearchOpen, openMenu } = useCart();
  const [isHide, setIsHide] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isProd = isProductPage || (pathname && pathname.startsWith('/products/'));

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 80);
      if (currentY > lastY && currentY > 80) {
        setIsHide(true);
      } else {
        setIsHide(false);
      }
      lastY = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`site-header ${isHide ? 'hide' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 50,
        padding: '2.5rem 3.5rem 1rem 3.5rem',
        backgroundColor: isProd ? '#fff9f7' : isScrolled ? 'rgba(255, 249, 247, 0.96)' : 'transparent',
        backdropFilter: !isProd && isScrolled ? 'blur(8px)' : 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        transition: 'transform 0.4s ease, background-color 0.3s ease',
        transform: isHide ? 'translateY(-100%)' : 'translateY(0)',
        pointerEvents: 'auto',
      }}
    >
      {/* Left Section: MENU +, SHOP ALL, CATEGORIES +, [ 5-HT ] */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
          <MarkerButton
            text="MENU"
            suffix={<span style={{ marginLeft: '4px', fontSize: '1.1rem', lineHeight: 1 }}>+</span>}
            cloneLastChar
            onClick={() => openMenu('menu')}
          />
          <div className="header-tablet-only">
            <MarkerButton
              text="SHOP ALL"
              cloneLastChar
              href="/products"
            />
          </div>
          <div className="header-tablet-only">
            <MarkerButton
              text="CATEGORIES"
              suffix={<span style={{ marginLeft: '4px', fontSize: '1.1rem', lineHeight: 1 }}>+</span>}
              cloneLastChar
              onClick={() => openMenu('categories')}
            />
          </div>
        </div>

        <div className="header-desktop-only" style={{ paddingTop: '2.2rem' }}>
          <MarkerButton
            text="5-HT"
            brackets
            cloneLastChar
            href="/"
          />
        </div>
      </div>

      {/* Center Section: SEROTONINN Logo */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: '2.5rem',
          pointerEvents: 'auto',
        }}
      >
        <Link href="/" className="header__logo" style={{ display: 'block', visibility: 'inherit', opacity: 1 }}>
          <svg width="182" height="27" viewBox="0 0 182 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_11001_31714)">
              <path d="M111.287 0.945312H107.508V26.7603H111.287V0.945312Z" fill="currentColor" />
              <path d="M20.2719 13.8528H26.882V10.0754H20.2719V4.72271H26.56V0.945312H16.4922V26.7603H27.1871V22.9829H20.2719V13.8528Z" fill="currentColor" />
              <path d="M60.5762 4.72271H64.3558V26.7603H68.1355V4.72271H71.9152V0.945312H60.5762V4.72271Z" fill="currentColor" />
              <path d="M52.3402 0.617188H52.3233C48.8487 0.617188 46.0352 3.42906 46.0352 6.90155V20.4697C46.0352 23.9422 48.8487 26.754 52.3233 26.754H52.3402C55.8148 26.754 58.6284 23.9422 58.6284 20.4697V6.90155C58.6284 3.446 55.7979 0.617188 52.3402 0.617188ZM54.8487 20.4697C54.8487 21.1303 54.5945 21.757 54.103 22.2313C53.6284 22.7056 53.0013 22.9766 52.3402 22.9766H52.3233C51.6623 22.9766 51.0352 22.7226 50.5606 22.2313C50.086 21.757 49.8148 21.1303 49.8148 20.4697V6.90155C49.8148 6.24093 50.0691 5.61419 50.5606 5.1399C51.0352 4.6656 51.6623 4.39458 52.3233 4.39458H52.3402C53.0013 4.39458 53.6284 4.64867 54.103 5.1399C54.5775 5.61419 54.8487 6.24093 54.8487 6.90155V20.4697Z" fill="currentColor" />
              <path d="M80.2016 0.617188H80.1846C76.71 0.617188 73.8965 3.42906 73.8965 6.90155V20.4697C73.8965 23.9422 76.71 26.754 80.1846 26.754H80.2016C83.6762 26.754 86.4897 23.9422 86.4897 20.4697V6.90155C86.4897 3.446 83.6762 0.617188 80.2016 0.617188ZM82.71 20.4697C82.71 21.1303 82.4558 21.757 81.9643 22.2313C81.4897 22.7056 80.8626 22.9766 80.2016 22.9766H80.1846C79.5236 22.9766 78.8965 22.7226 78.4219 22.2313C77.9473 21.757 77.6761 21.1303 77.6761 20.4697V6.90155C77.6761 6.24093 77.9304 5.61419 78.4219 5.1399C78.8965 4.6656 79.5236 4.39458 80.1846 4.39458H80.2016C80.8626 4.39458 81.4897 4.64867 81.9643 5.1399C82.4389 5.61419 82.71 6.24093 82.71 6.90155V20.4697Z" fill="currentColor" />
              <path d="M43.1335 25.5238C42.9471 24.2025 42.9302 21.8988 42.9302 18.7821C42.9302 16.6647 42.1674 14.8522 40.9132 13.6157C40.9641 13.5479 41.0318 13.4802 41.0827 13.4124C42.2013 12.0403 42.8285 10.2279 42.8285 8.33071C42.8285 6.43354 42.2183 4.62107 41.0827 3.24901C40.5064 2.53758 39.8285 1.97859 39.0657 1.58899C38.2352 1.16552 37.3539 0.945312 36.4556 0.945312H34.3369H32.4556H30.5742V26.7603H34.3539V15.75C35.3708 15.75 36.5064 15.75 36.8793 15.75C37.5064 15.75 38.0318 16.0041 38.4556 16.4953C38.9302 17.0543 39.1844 17.8843 39.1844 18.799C39.1844 22.6611 39.2183 24.626 39.4217 26.0658C39.4556 26.303 39.4895 26.5401 39.5403 26.7603H43.6081C43.4047 26.6079 43.2522 26.3707 43.1335 25.5238ZM36.4386 4.72271C37.2691 4.72271 37.8624 5.29863 38.1335 5.63741C38.6929 6.33191 39.0318 7.31437 39.0318 8.33071C39.0318 9.34705 38.7098 10.3295 38.1335 11.024C37.8454 11.3628 37.2522 11.9387 36.4386 11.9387H34.32V4.72271H36.4386Z" fill="currentColor" />
              <path d="M7.20352 0.617188H7.18658C6.28827 0.617188 5.37302 0.820455 4.54251 1.21005C3.7459 1.58271 3.01708 2.12476 2.45776 2.80232C1.37301 4.07274 0.932336 5.64807 1.18657 7.25727C1.6103 9.89975 3.712 12.1357 5.76285 14.3039C7.712 16.3704 9.72895 18.5217 9.72895 20.4697C9.72895 21.3166 9.49166 21.9603 9.05098 22.3668C8.62725 22.7564 7.98319 22.9766 7.22047 22.9766H7.20352C6.52556 22.9766 5.89844 22.7226 5.42386 22.2652C4.94929 21.8079 4.69505 21.1642 4.69505 20.4697V17.3021H0.898438V20.4697C0.898438 22.1805 1.55945 23.7558 2.7459 24.9416C3.93234 26.1104 5.50861 26.754 7.18658 26.754H7.20352C8.91539 26.754 10.4747 26.1781 11.5934 25.1448C12.8306 23.993 13.4917 22.3838 13.4917 20.4697C13.4917 18.8605 12.9154 17.2513 11.7628 15.5404C10.8306 14.1853 9.66115 12.9318 8.50861 11.7122C6.86454 9.95057 5.16963 8.1381 4.91539 6.64747C4.81369 6.02072 5.08488 5.52949 5.33912 5.24153C5.7798 4.71642 6.47471 4.39458 7.18658 4.39458H7.20352C8.59336 4.39458 9.712 5.51255 9.712 6.90155V9.12056H13.4917V6.90155C13.4917 5.22459 12.8306 3.63233 11.6442 2.4466C10.4578 1.27781 8.88149 0.617188 7.20352 0.617188Z" fill="currentColor" />
              <path d="M99.5084 15.5128L92.8813 0.945312H90.0508V26.7603H93.8304V12.1759L100.458 26.7603H103.288V0.945312H99.5084V15.5128Z" fill="currentColor" />
              <path d="M125.066 15.5128L118.439 0.945312H115.625V26.7603H119.405V12.1759L126.032 26.7603H128.845V0.945312H125.066V15.5128Z" fill="currentColor" />
              <path d="M142.779 15.5128L136.151 0.945312H133.338V26.7603H137.118V12.1759L143.745 26.7603H146.558V0.945312H142.779V15.5128Z" fill="currentColor" />
            </g>
            <path d="M160.441 15.5675L153.814 1H151V26.815H154.78V12.2305L161.407 26.815H164.22V1H160.441V15.5675Z" fill="currentColor" />
            <path d="M177.441 15.5675L170.814 1H168V26.815H171.78V12.2305L178.407 26.815H181.22V1H177.441V15.5675Z" fill="currentColor" />
          </svg>
        </Link>
      </div>

      {/* Right Section: BAG.0, SEARCH, FAVORITES.0 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', textAlign: 'right' }}>
        <MarkerButton
          text={`BAG.${cartCount}`}
          cloneLastChar
          onClick={() => setIsCartOpen(true)}
        />
        <div className="header-tablet-only">
          <MarkerButton
            text="SEARCH"
            cloneLastChar
            onClick={() => setIsSearchOpen(true)}
          />
        </div>
        <div className="header-tablet-only">
          <MarkerButton
            text="FAVORITES.0"
            cloneLastChar
            onClick={() => openMenu('menu')}
          />
        </div>
      </div>
    </header>
  );
}
