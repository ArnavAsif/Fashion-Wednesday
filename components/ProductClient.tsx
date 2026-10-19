'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import FooterSection from '@/components/FooterSection';
import MarkerButton from '@/components/MarkerButton';
import CartDrawer from '@/components/CartDrawer';
import SearchModal from '@/components/SearchModal';
import CreditsModal from '@/components/CreditsModal';
import NewsletterModal from '@/components/NewsletterModal';
import { useCart } from '@/lib/cartContext';
import { Product, PRODUCTS, getProductSlug, getProductCollections, getProductCategories } from '@/lib/products';
import { ARRIVAL_PRODUCTS } from '@/components/ArrivalsSection';

export interface ProductClientProps {
  product: Product;
  slug: string;
}

function getCollectionCandidates(currentProduct: Product): { primaryCol: string; candidates: Product[] } {
  const myCols = getProductCollections(currentProduct);
  const primaryCol =
    myCols.find((c) => ['berlin', 'life-force', 'quarpa-capsule'].includes(c)) ||
    myCols[0] ||
    'berlin';

  // 1. Same collection products (excluding current product)
  let matches = PRODUCTS.filter((p) => p.id !== currentProduct.id && getProductCollections(p).includes(primaryCol));

  // 2. Same category fallback if fewer than 4
  if (matches.length < 4) {
    const myCats = getProductCategories(currentProduct);
    const catMatches = PRODUCTS.filter(
      (p) => p.id !== currentProduct.id && !matches.some((m) => m.id === p.id) && getProductCategories(p).some((c) => myCats.includes(c))
    );
    matches = [...matches, ...catMatches];
  }

  // 3. Fallback to others if still fewer than 4
  if (matches.length < 4) {
    const others = PRODUCTS.filter((p) => p.id !== currentProduct.id && !matches.some((m) => m.id === p.id));
    matches = [...matches, ...others];
  }

  return { primaryCol, candidates: matches };
}

function getDeterministicRelated(currentProduct: Product, candidates: Product[]): Product[] {
  if (candidates.length <= 4) return candidates.slice(0, 4);
  // Staggered index based on product ID to ensure every product has a different unique set of items
  const offset = (currentProduct.id * 5) % candidates.length;
  const result: Product[] = [];
  for (let i = 0; i < 4; i++) {
    result.push(candidates[(offset + i) % candidates.length]);
  }
  return result;
}

export default function ProductClient({ product, slug }: ProductClientProps) {
  const { addToCart, setIsCartOpen } = useCart();

  // Find arrival product fallback data if available
  const arrivalMatch = ARRIVAL_PRODUCTS.find((a) => {
    const aWords = a.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean).sort().join(' ');
    const pWords = product.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean).sort().join(' ');
    return (
      aWords === pWords ||
      a.href.includes(slug) ||
      a.id === product.id
    );
  });

  // Extract images
  const rawImages: string[] = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    product.images.forEach((imgItem: any) => {
      let url = '';
      if (Array.isArray(imgItem) && typeof imgItem[0] === 'string') {
        url = imgItem[0];
      } else if (typeof imgItem === 'string') {
        url = imgItem;
      }
      if (url) {
        rawImages.push(url);
      }
    });
  } else if (arrivalMatch) {
    rawImages.push(arrivalMatch.images.col1[0]);
    rawImages.push(arrivalMatch.images.col2[0]);
    rawImages.push(arrivalMatch.images.col3[0]);
    rawImages.push(arrivalMatch.images.col1[1]);
  }
  const images = rawImages.length > 0 ? rawImages : ['/images/products/product-3/image_01.jpg'];

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.color?.[0]?.toUpperCase() || 'GREY'
  );
  const [openDetails, setOpenDetails] = useState(false);
  const [openCare, setOpenCare] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);

  // Custom zoom cursor state
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const availableSizes = (product.size && product.size.length > 0 ? product.size : ['S', 'M'])
    .slice()
    .sort((a, b) => (a === 'S' ? -1 : b === 'S' ? 1 : 0));

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSelectedSize(availableSizes[0] || 'S');
    }

    const sizeToUse = selectedSize || availableSizes[0] || 'S';

    addToCart({
      id: product.id,
      title: `${product.title} (${sizeToUse})`,
      price: product.price,
      quantity: 1,
      size: [sizeToUse],
      color: [selectedColor],
      images: [[images[0]]],
      href: `/products/${slug}`,
      bestseller: product.bestseller,
      createdAt: product.createdAt || new Date().toISOString(),
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setIsCartOpen(true);
    }, 400);
  };

  const formattedPrice = `(${product.price.toFixed(2).replace('.', ',')}_€)`;

  // Related products from collection
  const { primaryCol, candidates } = useMemo(() => getCollectionCandidates(product), [product]);
  const [related, setRelated] = useState<Product[]>(() => getDeterministicRelated(product, candidates));

  // Rotate/shuffle collection items on client mount so viewing at different times shows fresh different products
  useEffect(() => {
    if (candidates.length > 4) {
      const shuffled = [...candidates].sort(() => Math.random() - 0.5);
      setRelated(shuffled.slice(0, 4));
    }
  }, [product.id, candidates]);

  return (
    <div className="product-page-root site-wrapper" style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'clip', backgroundColor: '#fff9f7', color: '#000' }}>
      <Header />
      <CartDrawer />
      <SearchModal />
      <CreditsModal isOpen={creditsOpen} onClose={() => setCreditsOpen(false)} />
      <NewsletterModal />

      {/* Main Product Viewport */}
      <main
        style={{
          paddingTop: '11rem',
          paddingBottom: '8rem',
          maxWidth: '1580px',
          margin: '0 auto',
          paddingLeft: '3rem',
          paddingRight: '3rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '80px 1.1fr 1fr',
            gap: '4rem',
            alignItems: 'start',
            position: 'relative',
          }}
          className="product-grid-container"
        >
          {/* Left Metadata Column */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '78vh',
              minHeight: '520px',
              fontFamily: 'PP Fraktion Mono, monospace',
              fontSize: '1.2rem',
              color: '#000',
              fontWeight: 400,
              paddingTop: '1rem',
              userSelect: 'none',
            }}
            className="product-meta-col"
          >
            <div>(UA)</div>
            <div>(DE)</div>
            <div>(BERLIN)</div>
          </div>

          {/* Center Image Gallery */}
          <div
            ref={imgContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setCursorVisible(true)}
            onMouseLeave={() => setCursorVisible(false)}
            onClick={() => setIsZoomed(!isZoomed)}
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: cursorVisible ? 'none' : 'default',
            }}
            className="product-image-col"
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxHeight: '82vh',
                aspectRatio: '0.72',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={images[activeImgIndex]}
                alt={product.title}
                loading="eager"
                // @ts-ignore
                fetchPriority="high"
                decoding="sync"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: isZoomed ? 'scale(1.4)' : 'scale(1)',
                  transition: 'transform 0.4s ease',
                  userSelect: 'none',
                }}
                draggable={false}
              />

              {/* Custom [ ZOOM ] floating cursor pill */}
              {cursorVisible && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${cursorPos.x}px`,
                    top: `${cursorPos.y}px`,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    zIndex: 20,
                    fontFamily: 'PP Fraktion Mono, monospace',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#000',
                    backgroundColor: 'rgba(255, 249, 247, 0.75)',
                    backdropFilter: 'blur(4px)',
                    padding: '0.4rem 1.2rem',
                    borderRadius: '2rem',
                    border: '1px solid rgba(0,0,0,0.15)',
                    letterSpacing: '0.05em',
                  }}
                >
                  <span style={{ fontWeight: 100, marginRight: '4px' }}>[</span>
                  ZOOM
                  <span style={{ fontWeight: 100, marginLeft: '4px' }}>]</span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnail Selector */}
            {images.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1.5rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImgIndex(idx);
                    }}
                    style={{
                      width: '4.5rem',
                      height: '6rem',
                      border: activeImgIndex === idx ? '2px solid #000' : '1px solid rgba(0,0,0,0.15)',
                      padding: 0,
                      background: 'none',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <img
                      src={img}
                      alt={`Angle ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Purchase Details */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '1rem',
            }}
            className="product-info-col"
          >
            {/* Title & Price Header */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h1
                style={{
                  fontFamily: 'Thunder, sans-serif',
                  fontSize: 'clamp(4rem, 5.5vw, 6.2rem)',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  lineHeight: 0.9,
                  margin: '0 0 1rem 0',
                  letterSpacing: '0.01em',
                }}
              >
                {product.title}
              </h1>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontFamily: 'PP Fraktion Mono, monospace',
                  fontSize: '2.4rem',
                  fontWeight: 800,
                  color: '#ed3833',
                  lineHeight: 1,
                }}
              >
                {formattedPrice}
              </div>
            </div>

            {/* Size Section */}
            <div style={{ marginBottom: '2.4rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.6rem',
                  fontFamily: 'PP Fraktion Mono, monospace',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                }}
              >
                <span>SELECT SIZE:</span>
                <MarkerButton
                  text="SIZE GUIDE"
                  cloneLastChar
                  fontSize="1.1rem"
                  onClick={() => setShowSizeGuide(true)}
                  style={{ textDecoration: 'underline' }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {/* Size Buttons */}
                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                  {availableSizes.map((size) => (
                    <MarkerButton
                      key={size}
                      text={size}
                      brackets
                      fontSize="1.6rem"
                      active={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                    />
                  ))}
                </div>

                <div
                  style={{
                    fontFamily: 'PP Fraktion Mono, monospace',
                    fontSize: '1.1rem',
                    color: '#222',
                  }}
                >
                  Model is <strong>174cm</strong>, wearing size <strong>{selectedSize || availableSizes[0] || 'S'}</strong>
                </div>
              </div>
            </div>

            {/* Color Section */}
            <div style={{ marginBottom: '3.5rem' }}>
              <div
                style={{
                  fontFamily: 'PP Fraktion Mono, monospace',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  marginBottom: '0.8rem',
                }}
              >
                SELECT COLOR:
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {(product.color && product.color.length > 0 ? product.color : ['GREY']).map((col) => {
                    const c = col.toUpperCase();
                    return (
                      <MarkerButton
                        key={c}
                        text={c}
                        brackets
                        fontSize="1.5rem"
                        active={selectedColor.toUpperCase() === c}
                        onClick={() => setSelectedColor(c)}
                      />
                    );
                  })}
                </div>

                {/* Stock Left Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontFamily: 'PP Fraktion Mono, monospace',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  <span
                    style={{
                      width: '1.2rem',
                      height: '1.2rem',
                      borderRadius: '50%',
                      backgroundColor: '#1b8743',
                      display: 'inline-block',
                    }}
                  />
                  <span>{product.quantity || 1} ITEMS LEFT</span>
                </div>
              </div>
            </div>

            {/* Main CTA Button: Authentic Torn Brush Stroke */}
            <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleAddToCart}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '48rem',
                  height: '6.8rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none',
                  transition: 'transform 0.25s ease, opacity 0.25s ease',
                  transform: addedSuccess ? 'scale(0.98)' : 'scale(1)',
                }}
                className="cta-brush-btn"
              >
                {/* Torn brush background */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url(/images/button_bg.webp)',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: selectedSize ? 1 : 0.6,
                    transition: 'opacity 0.3s ease',
                  }}
                />

                {/* Button Text */}
                <span
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    fontFamily: 'PP Fraktion Mono, monospace',
                    fontSize: '1.7rem',
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3em',
                  }}
                >
                  <span style={{ fontWeight: 100 }}>[</span>
                  <span>{addedSuccess ? 'ADDED TO BAG' : selectedSize ? 'ADD TO BAG' : 'SELECT SIZE'}</span>
                  <span style={{ fontWeight: 100 }}>]</span>
                </span>
              </button>
            </div>

            {/* Accordions */}
            <div
              style={{
                borderTop: '1px solid rgba(0,0,0,0.1)',
                paddingTop: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.8rem',
              }}
            >
              {/* 01. DETAILS */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => setOpenDetails(!openDetails)}
                >
                  <MarkerButton
                    text="01. DETAILS"
                    cloneLastChar
                    fontSize="1.5rem"
                    onClick={() => setOpenDetails(!openDetails)}
                  />
                  <span style={{ fontSize: '1.8rem', fontWeight: 100, userSelect: 'none' }}>
                    {openDetails ? '−' : '+'}
                  </span>
                </div>

                {openDetails && (
                  <div
                    style={{
                      marginTop: '1.2rem',
                      fontFamily: 'PP Fraktion Mono, monospace',
                      fontSize: '1.15rem',
                      lineHeight: 1.6,
                      color: '#444',
                    }}
                  >
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      • Signature sculptured silhouette crafted with high elastane ribbed knit.
                    </p>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      • Designed in Berlin studio, constructed in Kyiv, Ukraine.
                    </p>
                    <p style={{ margin: '0' }}>
                      • Seamless micro-overlock stitching with raw edge finish.
                    </p>
                  </div>
                )}
              </div>

              {/* 02. CARE */}
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => setOpenCare(!openCare)}
                >
                  <MarkerButton
                    text="02. CARE"
                    cloneLastChar
                    fontSize="1.5rem"
                    onClick={() => setOpenCare(!openCare)}
                  />
                  <span style={{ fontSize: '1.8rem', fontWeight: 100, userSelect: 'none' }}>
                    {openCare ? '−' : '+'}
                  </span>
                </div>

                {openCare && (
                  <div
                    style={{
                      marginTop: '1.2rem',
                      fontFamily: 'PP Fraktion Mono, monospace',
                      fontSize: '1.15rem',
                      lineHeight: 1.6,
                      color: '#444',
                    }}
                  >
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      • Delicate hand wash cold or professional dry clean.
                    </p>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      • Do not tumble dry, do not bleach.
                    </p>
                    <p style={{ margin: '0' }}>
                      • Dry flat in shade. Iron inside out on minimum temperature.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Related Arrivals / You May Also Like Section */}
      <section
        style={{
          borderTop: '1px solid rgba(0,0,0,0.08)',
          paddingTop: '6rem',
          paddingBottom: '2.5rem',
          backgroundColor: '#fff9f7',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: '1580px', margin: '0 auto', padding: '0 3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3rem' }}>
            <h2
              style={{
                fontFamily: 'Thunder, sans-serif',
                fontSize: 'clamp(3rem, 4vw, 4.5rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              03. More From Collection
            </h2>

            <MarkerButton
              text="SEE ALL"
              brackets
              cloneLastChar
              href={`/collections/${primaryCol}`}
              fontSize="1.3rem"
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {related.map((item) => {
              const itemSlug = getProductSlug(item);
              const itemImg = item.images?.[0]?.[0] || '/images/products/product-3/image_01.jpg';
              return (
                <Link
                  key={item.id}
                  href={`/products/${itemSlug}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
                  className="related-prod-card"
                >
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '0.75',
                      overflow: 'hidden',
                      backgroundColor: '#f3edea',
                      marginBottom: '1rem',
                    }}
                  >
                    <img
                      src={itemImg}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                      className="related-img"
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3
                      style={{
                        fontFamily: 'Thunder, sans-serif',
                        fontSize: '2.2rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        margin: 0,
                      }}
                    >
                      {item.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: 'PP Fraktion Mono, monospace',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: '#ed3833',
                      }}
                    >
                      ({item.price.toFixed(2).replace('.', ',')}_€)
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div
          onClick={() => setShowSizeGuide(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff9f7',
              maxWidth: '600px',
              width: '100%',
              padding: '3rem',
              borderRadius: '2px',
              fontFamily: 'PP Fraktion Mono, monospace',
              color: '#000',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2
                style={{
                  fontFamily: 'Thunder, sans-serif',
                  fontSize: '3.5rem',
                  fontWeight: 900,
                  margin: 0,
                  textTransform: 'uppercase',
                }}
              >
                Size Guide
              </h2>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '1.15rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #000' }}>
                  <th style={{ padding: '0.8rem 0' }}>SIZE</th>
                  <th style={{ padding: '0.8rem 0' }}>BUST (cm)</th>
                  <th style={{ padding: '0.8rem 0' }}>WAIST (cm)</th>
                  <th style={{ padding: '0.8rem 0' }}>HIPS (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                  <td style={{ padding: '0.8rem 0', fontWeight: 700 }}>XS</td>
                  <td style={{ padding: '0.8rem 0' }}>80 - 84</td>
                  <td style={{ padding: '0.8rem 0' }}>60 - 64</td>
                  <td style={{ padding: '0.8rem 0' }}>86 - 90</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                  <td style={{ padding: '0.8rem 0', fontWeight: 700 }}>S</td>
                  <td style={{ padding: '0.8rem 0' }}>84 - 88</td>
                  <td style={{ padding: '0.8rem 0' }}>64 - 68</td>
                  <td style={{ padding: '0.8rem 0' }}>90 - 94</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                  <td style={{ padding: '0.8rem 0', fontWeight: 700 }}>M</td>
                  <td style={{ padding: '0.8rem 0' }}>88 - 92</td>
                  <td style={{ padding: '0.8rem 0' }}>68 - 72</td>
                  <td style={{ padding: '0.8rem 0' }}>94 - 98</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.8rem 0', fontWeight: 700 }}>L</td>
                  <td style={{ padding: '0.8rem 0' }}>92 - 96</td>
                  <td style={{ padding: '0.8rem 0' }}>72 - 76</td>
                  <td style={{ padding: '0.8rem 0' }}>98 - 102</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
              <MarkerButton text="CLOSE" brackets cloneLastChar onClick={() => setShowSizeGuide(false)} />
            </div>
          </div>
        </div>
      )}

      <FooterSection onOpenCredits={() => setCreditsOpen(true)} />

      <style jsx global>{`
        .cta-brush-btn:hover {
          transform: scale(1.02);
        }
        .related-prod-card:hover .related-img {
          transform: scale(1.03);
        }
        @media (max-width: 1024px) {
          .product-grid-container {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .product-meta-col {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
