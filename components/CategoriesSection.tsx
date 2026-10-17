'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MarkerButton from '@/components/MarkerButton';

gsap.registerPlugin(ScrollTrigger);

interface CatItem {
  title: string;
  count: string;
  img: string;
}

const CATEGORIES: CatItem[] = [
  { title: 'SALE', count: '[ 5 ]', img: '/images/categories/cat_1.jpg' },
  { title: 'ACCESSORIES', count: '[ 4 ]', img: '/images/categories/cat_2.jpg' },
  { title: 'BODYS', count: '[ 3 ]', img: '/images/categories/cat_3.jpg' },
  { title: 'BOTTOMS', count: '[ 4 ]', img: '/images/categories/cat_4.jpg' },
  { title: 'COATS', count: '[ 3 ]', img: '/images/categories/cat_5.jpg' },
  { title: 'CORSETS', count: '[ 7 ]', img: '/images/categories/cat_6.jpg' },
  { title: 'DRESSES', count: '[ 8 ]', img: '/images/categories/cat_7.jpg' },
  { title: 'JACKETS', count: '[ 5 ]', img: '/images/categories/cat_8.jpg' },
  { title: 'SKIRTS', count: '[ 3 ]', img: '/images/categories/cat_9.jpg' },
  { title: 'SPECIAL EDITION', count: '[ 4 ]', img: '/images/categories/cat_10.jpg' },
  { title: 'TOPS', count: '[ 12 ]', img: '/images/categories/cat_11.jpg' },
  { title: 'NEW DROP', count: '[ 10 ]', img: '/images/categories/cat_12.jpg' },
];

export default function CategoriesSection() {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Desktop mouse drag interaction states
  const isMouseDownRef = useRef(false);
  const mouseStartXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasMovedRef = useRef(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Mobile touch swipe interaction states
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isTouchScrollingRef = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.categories-section__title',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.categories-section',
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.categories-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.categories-section__inner',
            start: 'top 85%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const updateProgress = useCallback(() => {
    if (trackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      const total = scrollWidth - clientWidth;
      setProgress(total > 0 ? (scrollLeft / total) * 100 : 0);
    }
  }, []);

  // Unified Pointer & Mouse Drag Handling
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (!trackRef.current) return;

    isMouseDownRef.current = true;
    hasMovedRef.current = false;
    mouseStartXRef.current = e.clientX;
    scrollLeftStartRef.current = trackRef.current.scrollLeft;
    setIsGrabbing(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current || !trackRef.current) return;

    const dx = e.clientX - mouseStartXRef.current;
    if (Math.abs(dx) > 4) {
      hasMovedRef.current = true;
      trackRef.current.scrollLeft = scrollLeftStartRef.current - dx;
      updateProgress();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    setIsGrabbing(false);

    if (e.currentTarget && e.currentTarget.hasPointerCapture && e.currentTarget.hasPointerCapture(e.pointerId)) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }

    if (hasMovedRef.current) {
      setTimeout(() => {
        hasMovedRef.current = false;
      }, 120);
    }
  };

  // Mobile Touch Swipe Handling (Native smooth 120fps inertia)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      isTouchScrollingRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const dx = Math.abs(e.touches[0].clientX - touchStartXRef.current);
      const dy = Math.abs(e.touches[0].clientY - touchStartYRef.current);
      if (dx > 8 || dy > 8) {
        isTouchScrollingRef.current = true;
      }
    }
  };

  const handleTouchEnd = () => {
    if (isTouchScrollingRef.current) {
      setTimeout(() => {
        isTouchScrollingRef.current = false;
      }, 120);
    }
  };

  const handleCardClick = (e: React.MouseEvent, catTitle: string) => {
    // If dragging on desktop or actively swiping on mobile, prevent accidental navigation
    if (hasMovedRef.current || isTouchScrollingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Direct, reliable client-side navigation
    e.preventDefault();
    router.push(`/products?category=${encodeURIComponent(catTitle)}`);
  };

  return (
    <section className="categories-section" id="categories">
      <div className="container">
        <h2 className="categories-section__title h2">04. CATEGORIES</h2>

        <div className="categories-section__inner">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <MarkerButton text="SEE ALL" brackets cloneLastChar href="/products" />
          </div>

          {/* Draggable Category Cards Track */}
          <div
            ref={trackRef}
            onScroll={updateProgress}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="categories-section__list"
            style={{
              display: 'flex',
              gap: '1.5rem',
              overflowX: 'auto',
              scrollSnapType: isGrabbing ? 'none' : 'x proximity',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-x pan-y',
              paddingBottom: '1.5rem',
              cursor: isGrabbing ? 'grabbing' : 'grab',
              userSelect: isGrabbing ? 'none' : 'auto',
            }}
          >
            {CATEGORIES.map((cat, idx) => {
              const categoryUrl = `/products?category=${encodeURIComponent(cat.title)}`;
              return (
                <Link
                  key={idx}
                  href={categoryUrl}
                  onClick={(e) => handleCardClick(e, cat.title)}
                  className="categories-card"
                  style={{
                    flex: '0 0 clamp(28rem, 26vw, 34rem)',
                    scrollSnapAlign: 'start',
                    position: 'relative',
                    display: 'block',
                    cursor: isGrabbing ? 'grabbing' : 'pointer',
                    textDecoration: 'none',
                  }}
                >
                  <div className="categories-card__img-wrapper">
                    <picture className="categories-card__img">
                      <img
                        src={cat.img}
                        alt={cat.title}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  </div>

                  <h3
                    className="categories-card__title"
                    style={{ pointerEvents: 'none' }}
                  >
                    {cat.title}
                  </h3>

                  <p
                    className="categories-card__text"
                    style={{ pointerEvents: 'none' }}
                  >
                    <strong>{cat.count}</strong>
                  </p>
                </Link>
              );
            })}
          </div>

          {/* Scroll progress fill */}
          <div className="categories-section__scroll scroll" style={{ marginTop: '2rem', height: '2px', background: 'rgba(0,0,0,0.1)', position: 'relative' }}>
            <div
              className="categories-section__fill scroll__fill"
              style={{
                height: '100%',
                background: '#ff2d20',
                width: `${Math.max(12, progress)}%`,
                transition: 'width 0.1s linear',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
