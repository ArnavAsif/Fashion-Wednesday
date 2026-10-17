'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cartContext';

interface CategoryData {
  name: string;
  count: string;
  model: string;
  products: string[];
  disabled?: boolean;
}

const CATEGORIES_DATA: CategoryData[] = [
  {
    name: 'NEW DROP',
    count: '7',
    model: '/images/img_148.png',
    products: ['/images/img_042.png', '/images/img_043.png', '/images/img_044.png', '/images/img_045.png', '/images/img_044.png'],
  },
  {
    name: 'SALE',
    count: '8',
    model: '/images/img_050.png',
    products: ['/images/img_046.png', '/images/img_047.png', '/images/img_048.png', '/images/img_049.png', '/images/img_050.png'],
  },
  {
    name: 'ACCESSORIES',
    count: '4',
    model: '/images/img_156.png',
    products: ['/images/img_034.png', '/images/img_035.png', '/images/img_036.png', '/images/img_037.png', '/images/img_038.png'],
  },
  {
    name: 'BODYS',
    count: '3',
    model: '/images/img_142.png',
    products: ['/images/img_051.png', '/images/img_052.png', '/images/img_053.png', '/images/img_054.png', '/images/img_055.png'],
  },
  {
    name: 'COATS',
    count: '2',
    model: '/images/img_146.png',
    products: ['/images/img_056.png', '/images/img_057.png', '/images/img_058.png', '/images/img_059.png', '/images/img_060.png'],
  },
  {
    name: 'CORSETS',
    count: '7',
    model: '/images/img_148.png',
    products: ['/images/img_061.png', '/images/img_062.png', '/images/img_063.png', '/images/img_064.png', '/images/img_065.png'],
  },
  {
    name: 'DRESSES',
    count: '26',
    model: '/images/img_150.png',
    products: ['/images/img_066.png', '/images/img_067.png', '/images/img_068.png', '/images/img_069.png', '/images/img_070.png'],
  },
  {
    name: 'JACKETS',
    count: '1',
    model: '/images/img_152.png',
    products: ['/images/img_071.png', '/images/img_072.png', '/images/img_073.png', '/images/img_074.png', '/images/img_075.png'],
  },
  {
    name: 'PANTS',
    count: '6',
    model: '/images/img_144.png',
    products: ['/images/img_076.png', '/images/img_077.png', '/images/img_078.png', '/images/img_079.png', '/images/img_076.png'],
  },
  {
    name: 'SKIRTS',
    count: '6',
    model: '/images/img_154.png',
    products: ['/images/img_080.png', '/images/img_081.png', '/images/img_082.png', '/images/img_083.png', '/images/img_084.png'],
  },
  {
    name: 'SPECIAL EDITION',
    count: '6',
    model: '/images/img_156.png',
    products: ['/images/img_085.png', '/images/img_086.png', '/images/img_087.png', '/images/img_088.png', '/images/img_089.png'],
  },
  {
    name: 'TOPS',
    count: '4',
    model: '/images/img_087.png',
    products: ['/images/img_085.png', '/images/img_087.png', '/images/img_088.png', '/images/img_089.png', '/images/img_086.png'],
  },
  {
    name: '5-HT',
    count: 'COMING SOON',
    model: '/images/img_148.png',
    products: [],
    disabled: true,
  },
];

const DEFAULT_PRODUCTS = [
  '/images/img_034.png',
  '/images/img_035.png',
  '/images/img_036.png',
  '/images/img_037.png',
  '/images/img_038.png',
];

const MENU_ITEMS = [
  { label: 'COLLECTIONS', count: '01', href: '/collections' },
  { label: 'CAMPAIGN', count: '02', href: '/#campaign' },
  { label: 'WHO WE ARE', count: '03', href: '/#bold' },
  { label: 'CONTACT', count: '04', href: '/#footer' },
  { label: 'PUBLICATIONS', count: '05', href: '/#film' },
  { label: 'SALE', count: '06', href: '/products?category=SALE' },
];

export default function MenuModal() {
  const router = useRouter();
  const { isMenuOpen, setIsMenuOpen, menuTab, openMenu } = useCart();
  const [hoveredCatIndex, setHoveredCatIndex] = useState<number>(-1);
  const [hoveredMenuIndex, setHoveredMenuIndex] = useState<number>(-1);

  // Reset hover state when modal closes or switches tabs
  useEffect(() => {
    setHoveredCatIndex(-1);
    setHoveredMenuIndex(-1);
  }, [isMenuOpen, menuTab]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, setIsMenuOpen]);

  const activeCat = hoveredCatIndex >= 0 ? CATEGORIES_DATA[hoveredCatIndex] : null;
  const currentTitle = activeCat ? activeCat.name : 'SELECT';

  const handleCategoryClick = (cat: CategoryData, index: number) => {
    if (cat.disabled) return;
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
    if (isTouch) {
      if (hoveredCatIndex === index) {
        setIsMenuOpen(false);
        router.push(`/products?category=${encodeURIComponent(cat.name)}`);
      } else {
        setHoveredCatIndex(index);
      }
    } else {
      setIsMenuOpen(false);
      router.push(`/products?category=${encodeURIComponent(cat.name)}`);
    }
  };

  const handleProductCardClick = (catName?: string) => {
    setIsMenuOpen(false);
    router.push(`/products?category=${encodeURIComponent(catName || 'ALL')}`);
  };

  const handleNavigate = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith('/#')) {
      const hash = href.replace('/#', '');
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    router.push(href);
  };

  return (
    <>
      {/* ========================================================
          1. MENU MODAL (menuTab === 'menu')
          ======================================================== */}
      <div
        className={`menu menu--menu is-mounted ${isMenuOpen && menuTab === 'menu' ? 'active' : ''}`}
        onClick={(e) => {
          // If clicked directly on the menu overlay (backdrop), close it
          if (e.target === e.currentTarget) {
            setIsMenuOpen(false);
          }
        }}
      >
        <div className="menu__inner">
          {/* Menu Items List */}
          <ul className="menu__list">
            {MENU_ITEMS.map((item, idx) => {
              const isHovered = hoveredMenuIndex === idx;
              return (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    onMouseEnter={() => setHoveredMenuIndex(idx)}
                    onMouseOver={() => setHoveredMenuIndex(idx)}
                    onPointerEnter={() => setHoveredMenuIndex(idx)}
                    onMouseLeave={() => setHoveredMenuIndex(-1)}
                    style={{
                      background: 'none',
                      border: 'none',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.45rem 0',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'PP Fraktion Mono, monospace',
                      fontSize: 'clamp(1.4rem, 1.4vw, 1.95rem)',
                      fontWeight: 600,
                      color: isHovered ? '#ed3833' : '#000000',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.02em',
                      transition: 'color 0.15s ease',
                    }}
                  >
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <span>[ </span>
                      <span>{item.label}</span>
                      <span> ]</span>
                      {isHovered && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '-2px',
                            left: 0,
                            width: '100%',
                            height: '2px',
                            backgroundColor: '#ed3833',
                          }}
                        />
                      )}
                    </div>
                    <div style={{ fontWeight: 400, color: isHovered ? '#ed3833' : '#000000' }}>
                      <span>[ </span>
                      <span>{item.count}</span>
                      <span> ]</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Contact / Footer Links */}
          <ul className="menu__contact-list">
            <li>
              <button
                type="button"
                onClick={() => handleNavigate('/#footer')}
                style={{
                  background: 'none',
                  border: 'none',
                  font: 'inherit',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'left',
                }}
              >
                Shipping and Payment
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNavigate('/#footer')}
                style={{
                  background: 'none',
                  border: 'none',
                  font: 'inherit',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'center',
                }}
              >
                Credits
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNavigate('/#footer')}
                style={{
                  background: 'none',
                  border: 'none',
                  font: 'inherit',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'right',
                }}
              >
                Terms and Conditions
              </button>
            </li>
          </ul>
        </div>

        {/* Collection items: Cutout model & 5 staggered product cards */}
        <ul className="menu__collection">
          <li className={`menu__item default ${isMenuOpen && menuTab === 'menu' ? 'active' : ''}`}>
            <div className="menu__item-main">
              <img
                src="/images/img_148.png"
                alt="BONEZ Model"
                loading="lazy"
                decoding="async"
                style={{
                  height: '100%',
                  maxHeight: '85vh',
                  width: 'auto',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                }}
              />
            </div>
            <ul className="menu__item-list">
              {DEFAULT_PRODUCTS.map((prod, pIdx) => (
                <li key={pIdx} onClick={() => handleProductCardClick('NEW DROP')}>
                  <picture>
                    <img src={prod} alt="BONEZ Product" loading="lazy" decoding="async" />
                  </picture>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        {/* Bottom indicator */}
        <p className="menu__text">(14)</p>
      </div>

      {/* ========================================================
          2. CATEGORIES MODAL (menuTab === 'categories')
          ======================================================== */}
      <div
        className={`menu menu--categories is-mounted ${isMenuOpen && menuTab === 'categories' ? 'active' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsMenuOpen(false);
          }
        }}
      >
        <div className="menu__inner">
          {/* Category List */}
          <ul className="menu__list">
            {CATEGORIES_DATA.map((cat, idx) => {
              const isHovered = hoveredCatIndex === idx;
              return (
                <li key={idx} className={cat.disabled ? 'disable' : ''}>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat, idx)}
                    onMouseEnter={() => !cat.disabled && setHoveredCatIndex(idx)}
                    onMouseOver={() => !cat.disabled && setHoveredCatIndex(idx)}
                    onPointerEnter={() => !cat.disabled && setHoveredCatIndex(idx)}
                    onMouseLeave={() => setHoveredCatIndex(-1)}
                    style={{
                      background: 'none',
                      border: 'none',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.28rem 0',
                      cursor: cat.disabled ? 'default' : 'pointer',
                      textAlign: 'left',
                      fontFamily: 'PP Fraktion Mono, monospace',
                      fontSize: 'clamp(1.3rem, 1.25vw, 1.75rem)',
                      fontWeight: 600,
                      color: isHovered ? '#ed3833' : '#000000',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.02em',
                      transition: 'color 0.15s ease',
                      opacity: cat.disabled ? 0.35 : 1,
                    }}
                  >
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <span>[ </span>
                      <span>{cat.name}</span>
                      <span> ]</span>
                      {isHovered && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '-2px',
                            left: 0,
                            width: '100%',
                            height: '2px',
                            backgroundColor: '#ed3833',
                          }}
                        />
                      )}
                    </div>
                    <div style={{ fontWeight: 400, color: isHovered ? '#ed3833' : '#000000' }}>
                      <span>[ </span>
                      <span>{cat.count}</span>
                      <span> ]</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Giant Bottom Title: SELECT (CATEGORIES) */}
          <p className="menu__title">
            <span className="active">
              <span>{currentTitle}</span>{' '}
              <strong>
                <i>(</i>Categories<i>)</i>
              </strong>
            </span>
          </p>

          {/* Bottom Info Row */}
          <ul className="menu__contact-list">
            <li>
              <span>(14)</span>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNavigate('/#footer')}
                style={{
                  background: 'none',
                  border: 'none',
                  font: 'inherit',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Credits
              </button>
            </li>
            <li>
              <a
                href="https://www.instagram.com/bonez_official/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                IG
              </a>
            </li>
          </ul>
        </div>

        {/* Collection items: Staggered Model and 5 Product Cards */}
        <ul className="menu__collection">
          {/* Default state item (when no category is hovered) */}
          <li className={`menu__item default ${isMenuOpen && menuTab === 'categories' && hoveredCatIndex === -1 ? 'active' : ''}`}>
            <div className="menu__item-main">
              <img
                src="/images/img_148.png"
                alt="BONEZ Model"
                style={{
                  height: '100%',
                  maxHeight: '85vh',
                  width: 'auto',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                }}
              />
            </div>
            <ul className="menu__item-list">
              {DEFAULT_PRODUCTS.map((prod, pIdx) => (
                <li key={pIdx} onClick={() => handleProductCardClick('NEW DROP')}>
                  <picture>
                    <img src={prod} alt="Product Card" />
                  </picture>
                </li>
              ))}
            </ul>
          </li>

          {/* Individual Category items */}
          {CATEGORIES_DATA.map((cat, idx) => {
            const isActive = isMenuOpen && menuTab === 'categories' && hoveredCatIndex === idx;
            const prods = cat.products.length > 0 ? cat.products : DEFAULT_PRODUCTS;
            return (
              <li key={idx} className={`menu__item ${isActive ? 'active' : ''}`}>
                <div className="menu__item-main">
                  <img
                    src={cat.model}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                    style={{
                      height: '100%',
                      maxHeight: '85vh',
                      width: 'auto',
                      objectFit: 'contain',
                      objectPosition: 'bottom center',
                    }}
                  />
                </div>
                <ul className="menu__item-list">
                  {prods.map((prod, pIdx) => (
                    <li key={pIdx} onClick={() => handleProductCardClick(cat.name)}>
                      <picture>
                        <img src={prod} alt={`${cat.name} Product ${pIdx + 1}`} loading="lazy" decoding="async" />
                      </picture>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        {/* Bottom indicator */}
        <p className="menu__text">(14)</p>
      </div>
    </>
  );
}
