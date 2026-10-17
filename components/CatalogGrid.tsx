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

    return pool;
  }, [collectionSlug, activeCategory]);

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
      {/* Header and Controls */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'Thunder, sans-serif',
                fontSize: 'clamp(4rem, 6.5vw, 8rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                margin: '0 0 0.5rem 0',
                letterSpacing: '-0.02em',
                lineHeight: 0.85,
              }}
            >
              {displayTitle}
            </h1>
            <div
              style={{
                fontFamily: 'PP Fraktion Mono, monospace',
                fontSize: '1.15rem',
                color: '#666666',
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              <span>[ {baseProducts.length} ITEMS TOTAL ]</span>
              {baseProducts.length > 0 && (
                <span>
                  [ SHOWING {pagination.startItem}–{pagination.endItem} ]
                </span>
              )}
            </div>
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span
              style={{
                fontFamily: 'PP Fraktion Mono, monospace',
                fontSize: '1.1rem',
                color: '#888',
                textTransform: 'uppercase',
              }}
            >
              SORT:
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
                fontSize: '1.15rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e0d7d4',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                outline: 'none',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              <option value="FEATURED">Featured</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
              <option value="NEWEST">Newest</option>
              <option value="BESTSELLER">Bestsellers</option>
            </select>
          </div>
        </div>

        {displayDesc && (
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '1.35rem',
              color: '#444444',
              maxWidth: '680px',
              margin: '0 0 2rem 0',
              lineHeight: 1.5,
            }}
          >
            {displayDesc}
          </p>
        )}

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: '0.8rem',
            flexWrap: 'wrap',
            paddingTop: '0.5rem',
            borderTop: '1px solid #ebe2de',
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '3.5rem 2.2rem',
          }}
        >
          {pagination.items.map((product) => {
            const slug = getProductSlug(product);
            const img = product.images?.[0]?.[0] || '/images/products/product-3/image_01.jpg';
            const hoverImg = product.images?.[1]?.[0] || img;
            const isHovered = hoveredProduct === product.id;

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
                  containIntrinsicSize: '280px 420px',
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
                      aspectRatio: '0.73',
                      backgroundColor: '#f3edea',
                      position: 'relative',
                      overflow: 'hidden',
                      marginBottom: '1rem',
                    }}
                  >
                    <img
                      src={isHovered ? hoverImg : img}
                      alt={product.title}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease, opacity 0.25s ease',
                      }}
                      className="catalog-img"
                    />

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

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: '0.3rem',
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: 'Thunder, sans-serif',
                        fontSize: 'clamp(2rem, 1.8vw, 2.5rem)',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        margin: 0,
                        letterSpacing: '-0.01em',
                        lineHeight: 0.95,
                        maxWidth: '75%',
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
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ({product.price.toFixed(2).replace('.', ',')}_€)
                    </span>
                  </div>
                </Link>

                {/* Quick Add and Sizes */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.4rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(product.size?.slice(0, 3) || ['S', 'M']).map((s) => (
                      <MarkerButton
                        key={s}
                        text={s}
                        brackets
                        fontSize="1.05rem"
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
                    fontSize="1.05rem"
                    href={`/products/${slug}`}
                  />
                </div>
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
