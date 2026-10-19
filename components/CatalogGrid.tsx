'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Product,
  PRODUCTS,
  CATEGORY_LIST,
  CategoryType,
  COLLECTIONS,
  getProductCategories,
  getProductCollections,
  getProductSlug,
  sortProducts,
  paginateProducts,
} from '@/lib/products';
import { useCart } from '@/lib/cartContext';
import MarkerButton from '@/components/MarkerButton';

interface CatalogGridProps {
  initialCategory?: string;
  collectionSlug?: string;
  pageTitle?: string;
  description?: string;
}

export default function CatalogGrid({
  initialCategory = 'ALL',
  collectionSlug,
  pageTitle,
  description,
}: CatalogGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, setIsCartOpen } = useCart();
  const gridTopRef = useRef<HTMLDivElement>(null);

  // Active filter state
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [activeSort, setActiveSort] = useState<string>('FEATURED');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [gridCols, setGridCols] = useState<'4' | '2'>('4');
  const [sizeOpen, setSizeOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Read URL search params on mount or when searchParams change
  useEffect(() => {
    const catParam = searchParams?.get('category');
    const colParam = searchParams?.get('collection');
    const sortParam = searchParams?.get('sort');
    const pageParam = searchParams?.get('page');

    if (catParam) {
      const match = CATEGORY_LIST.find((c) => c.toLowerCase() === catParam.toLowerCase());
      if (match) {
        setActiveCategory(match);
      } else {
        setActiveCategory(catParam.toUpperCase());
      }
    } else if (!collectionSlug && initialCategory) {
      setActiveCategory(initialCategory);
    }

    if (sortParam) {
      setActiveSort(sortParam);
    }

    if (pageParam) {
      const p = parseInt(pageParam, 10);
      if (!isNaN(p) && p > 0) setCurrentPage(p);
    }
  }, [searchParams, initialCategory, collectionSlug]);

  // Determine base products pool
  const baseProducts = useMemo(() => {
    let pool = PRODUCTS;

    // Filter by collection if specified
    if (collectionSlug) {
      const normCol = collectionSlug.toLowerCase().trim().replace(/_/g, '-');
      pool = pool.filter((p) => {
        const cols = getProductCollections(p);
        return (
          cols.includes(normCol) ||
          (normCol === 'berlin-vibes' && cols.includes('berlin')) ||
          (normCol === 'quarpa' && cols.includes('quarpa-capsule'))
        );
      });
    }

    // Filter by category
    if (activeCategory && activeCategory !== 'ALL') {
      pool = pool.filter((p) => {
        const cats = getProductCategories(p);
        return cats.includes(activeCategory);
      });
    }

    // Filter by selected sizes
    if (selectedSizes.length > 0) {
      pool = pool.filter((p) => {
        return p.size && p.size.some((s) => selectedSizes.includes(s));
      });
    }

    return pool;
  }, [collectionSlug, activeCategory, selectedSizes]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return sortProducts(baseProducts, activeSort);
  }, [baseProducts, activeSort]);

  // Paginate products (12 per page)
  const pageSize = 12;
  const pagination = useMemo(() => {
    return paginateProducts(sortedProducts, currentPage, pageSize);
  }, [sortedProducts, currentPage, pageSize]);

  // Scroll to grid top on page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  // Find collection metadata if in collection mode
  const colInfo = useMemo(() => {
    if (!collectionSlug) return null;
    const norm = collectionSlug.toLowerCase().trim();
    return COLLECTIONS.find((c) => c.slug === norm || c.tag === norm);
  }, [collectionSlug]);

  const displayTitle = pageTitle || colInfo?.name || (activeCategory !== 'ALL' ? activeCategory : 'ALL PRODUCTS');
  const displayDesc = description || colInfo?.description;

  return (
    <div ref={gridTopRef} style={{ width: '100%', minHeight: '60vh' }}>
      {/* Categories Bar & Filter Controls (Matching Reference Video) */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            paddingBottom: '1.8rem',
            borderBottom: '1px solid #e5dedb',
            position: 'relative',
          }}
        >
          {/* Left: Category Title in signature red brackets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <h1
              style={{
                fontFamily: 'PP Fraktion Mono, monospace',
                fontSize: 'clamp(1.4rem, 1.5vw, 1.9rem)',
                fontWeight: 700,
                color: '#ed3833',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                margin: 0,
              }}
            >
              [ {activeCategory !== 'ALL' ? activeCategory : displayTitle} ]
            </h1>
          </div>

          {/* Center: Total Items Count */}
          <div
            style={{
              fontFamily: 'PP Fraktion Mono, monospace',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#111111',
              textTransform: 'uppercase',
            }}
          >
            [ {baseProducts.length} - ITEMS ]
          </div>

          {/* Right: SIZE filter, SORT BY filter, and 2-col/4-col View Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.4rem',
              flexWrap: 'wrap',
              position: 'relative',
            }}
          >
            {/* Size Filter Button + Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setSizeOpen((prev) => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'PP Fraktion Mono, monospace',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textTransform: 'uppercase',
                }}
              >
                <span>SIZE+</span>
                <span
                  style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '12px',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                  }}
                >
                  {selectedSizes.length > 0 ? selectedSizes.join(', ') : 'ALL'}
                </span>
              </button>

              {/* Size Dropdown Box */}
              {sizeOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.8rem)',
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px dashed #000000',
                    padding: '1.4rem',
                    width: '18rem',
                    zIndex: 150,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedSizes([])}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontFamily: 'PP Fraktion Mono, monospace',
                        fontSize: '1.1rem',
                        color: '#666',
                        cursor: 'pointer',
                      }}
                    >
                      [ CLEAR ]
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.8rem',
                      maxHeight: '220px',
                      overflowY: 'auto',
                    }}
                  >
                    {['XS-S', 'S-M', 'M-L', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'].map((sz) => {
                      const isChecked = selectedSizes.includes(sz);
                      return (
                        <label
                          key={sz}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            fontFamily: 'PP Fraktion Mono, monospace',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedSizes(selectedSizes.filter((s) => s !== sz));
                              } else {
                                setSelectedSizes([...selectedSizes, sz]);
                              }
                              setCurrentPage(1);
                            }}
                            style={{ cursor: 'pointer', accentColor: '#000000' }}
                          />
                          <span>{sz}</span>
                        </label>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSizeOpen(false)}
                    style={{
                      width: '100%',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem',
                      fontFamily: 'PP Fraktion Mono, monospace',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      marginTop: '1.2rem',
                    }}
                  >
                    [ APPLY ]
                  </button>
                </div>
              )}
            </div>

            {/* Sort Selector with dark brush capsule */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  fontFamily: 'PP Fraktion Mono, monospace',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#000000',
                  textTransform: 'uppercase',
                }}
              >
                SORT BY+
              </span>
              <select
                value={activeSort}
                onChange={(e) => {
                  setActiveSort(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Sort products by"
                style={{
                  fontFamily: 'PP Fraktion Mono, monospace',
                  fontSize: '1.1rem',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                <option value="FEATURED">Best Sellers</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
                <option value="NEWEST">Newest</option>
                <option value="BESTSELLER">Featured</option>
              </select>
            </div>

            {/* Grid Layout Switcher (2-column vs 4-column) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                aria-label="2 Columns View"
                onClick={() => setGridCols('2')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '3px',
                  opacity: gridCols === '2' ? 1 : 0.35,
                  transition: 'opacity 0.2s',
                  color: '#000000',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="6.5" height="16" stroke="currentColor" strokeWidth="1.8" fill={gridCols === '2' ? 'currentColor' : 'none'} />
                  <rect x="11.5" y="2" width="6.5" height="16" stroke="currentColor" strokeWidth="1.8" fill={gridCols === '2' ? 'currentColor' : 'none'} />
                </svg>
              </button>

              <button
                type="button"
                aria-label="4 Columns View"
                onClick={() => setGridCols('4')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '3px',
                  opacity: gridCols === '4' ? 1 : 0.35,
                  transition: 'opacity 0.2s',
                  color: '#000000',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="6.5" height="6.5" stroke="currentColor" strokeWidth="1.8" fill={gridCols === '4' ? 'currentColor' : 'none'} />
                  <rect x="11.5" y="2" width="6.5" height="6.5" stroke="currentColor" strokeWidth="1.8" fill={gridCols === '4' ? 'currentColor' : 'none'} />
                  <rect x="2" y="11.5" width="6.5" height="6.5" stroke="currentColor" strokeWidth="1.8" fill={gridCols === '4' ? 'currentColor' : 'none'} />
                  <rect x="11.5" y="11.5" width="6.5" height="6.5" stroke="currentColor" strokeWidth="1.8" fill={gridCols === '4' ? 'currentColor' : 'none'} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Category Jump Pills */}
        <div
          style={{
            display: 'flex',
            gap: '0.8rem',
            flexWrap: 'wrap',
            paddingTop: '0.8rem',
          }}
        >
          {CATEGORY_LIST.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <MarkerButton
                key={cat}
                text={cat}
                brackets
                fontSize="1.15rem"
                active={isActive}
                onClick={() => handleCategorySelect(cat)}
              />
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {pagination.items.length === 0 ? (
        <div
          style={{
            padding: '8rem 2rem',
            textAlign: 'center',
            fontFamily: 'PP Fraktion Mono, monospace',
          }}
        >
          <p style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            No products found matching &ldquo;{activeCategory}&rdquo;.
          </p>
          <MarkerButton
            text="VIEW ALL PRODUCTS"
            brackets
            fontSize="1.3rem"
            onClick={() => handleCategorySelect('ALL')}
          />
        </div>
      ) : (
        <div
          className="catalog-grid"
          style={{
            display: 'grid',
            gridTemplateColumns:
              gridCols === '2'
                ? 'repeat(2, 1fr)'
                : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '3.5rem 2.2rem',
          }}
        >
          {pagination.items.map((product, pIdx) => {
            const slug = getProductSlug(product);
            const img = product.images?.[0]?.[0] || '/images/products/product-3/image_01.jpg';
            const hoverImg = product.images?.[1]?.[0] || img;
            const isHovered = hoveredProduct === product.id;
            const isAboveFold = pIdx < 4;

            return (
              <div
                key={product.id}
                className="catalog-card-wrap"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  contentVisibility: 'auto',
                }}
              >
                <Link
                  href={`/products/${slug}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    overflow: 'hidden',
                  }}
                  className="catalog-card"
                >
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '0.74',
                      backgroundColor: '#ffffff',
                      position: 'relative',
                      overflow: 'hidden',
                      marginBottom: '1rem',
                    }}
                  >
                    <img
                      src={isHovered ? hoverImg : img}
                      alt={product.title}
                      loading={isAboveFold ? 'eager' : 'lazy'}
                      decoding={isAboveFold ? 'sync' : 'async'}
                      // @ts-ignore
                      fetchPriority={pIdx === 0 ? 'high' : 'auto'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease, opacity 0.25s ease',
                      }}
                      className="catalog-img"
                    />

                    {/* Available sizes preview on hover at bottom left of photo */}
                    {isHovered && product.size && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '0.8rem',
                          left: '0.8rem',
                          display: 'flex',
                          gap: '0.4rem',
                          fontFamily: 'PP Fraktion Mono, monospace',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: '#000000',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '3px',
                          zIndex: 3,
                        }}
                      >
                        {product.size.slice(0, 3).map((s) => `(${s})`).join(' ')}
                      </div>
                    )}

                    {product.bestseller && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '0.9rem',
                          left: '0.9rem',
                          backgroundColor: '#ed3833',
                          color: '#ffffff',
                          fontFamily: 'PP Fraktion Mono, monospace',
                          fontSize: '0.85rem',
                          padding: '0.3rem 0.7rem',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          zIndex: 2,
                        }}
                      >
                        BEST SELLER
                      </div>
                    )}
                  </div>

                  {/* Product Title and Price below photo */}
                  <div style={{ marginTop: '0.4rem' }}>
                    <h2
                      style={{
                        fontFamily: 'PP Fraktion Mono, monospace',
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        margin: '0 0 0.35rem 0',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.25,
                        color: '#000000',
                      }}
                    >
                      {product.title}
                    </h2>
                    <p
                      style={{
                        fontFamily: 'PP Fraktion Mono, monospace',
                        fontSize: '1.3rem',
                        fontWeight: 600,
                        color: '#111111',
                        margin: 0,
                      }}
                    >
                      {product.price.toFixed(2).replace('.', ',')}_€
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '5rem',
            paddingTop: '2.5rem',
            borderTop: '1px solid #ebe2de',
            fontFamily: 'PP Fraktion Mono, monospace',
            fontSize: '1.2rem',
          }}
        >
          {pagination.hasPrev && (
            <MarkerButton
              text="PREV"
              brackets
              onClick={() => handlePageChange(currentPage - 1)}
            />
          )}

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <MarkerButton
              key={p}
              text={`${p}`}
              brackets
              active={currentPage === p}
              onClick={() => handlePageChange(p)}
            />
          ))}

          {pagination.hasNext && (
            <MarkerButton
              text="NEXT"
              brackets
              onClick={() => handlePageChange(currentPage + 1)}
            />
          )}
        </div>
      )}

      <style jsx global>{`
        .catalog-card:hover .catalog-img {
          transform: scale(1.035);
        }
        @media (max-width: 640px) {
          .catalog-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2rem 1.2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
