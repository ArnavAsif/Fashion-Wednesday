'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Drag interaction states
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasMovedRef = useRef(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

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

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (!trackRef.current) return;

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.clientX;
    scrollLeftStartRef.current = trackRef.current.scrollLeft;

    trackRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;

    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 6) {
      hasMovedRef.current = true;
      if (!isGrabbing) setIsGrabbing(true);
    }

    if (hasMovedRef.current) {
      trackRef.current.scrollLeft = scrollLeftStartRef.current - dx;
      updateProgress();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsGrabbing(false);

    if (trackRef.current) {
      try {
        trackRef.current.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }

    setTimeout(() => {
      hasMovedRef.current = false;
    }, 60);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
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
            className="categories-section__list"
            style={{
              display: 'flex',
              gap: '1.5rem',
              overflowX: 'auto',
              scrollSnapType: isGrabbing ? 'none' : 'x proximity',
              scrollbarWidth: 'none',
              paddingBottom: '1.5rem',
              cursor: isGrabbing ? 'grabbing' : 'grab',
              userSelect: isGrabbing ? 'none' : 'auto',
              touchAction: 'pan-y',
            }}
          >
            {CATEGORIES.map((cat, idx) => (
              <Link
                key={idx}
                href={`/products?category=${encodeURIComponent(cat.title)}`}
                onClick={handleCardClick}
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
                    <img src={cat.img} alt={cat.title} draggable={false} />
                  </picture>
                </div>

                <h3 className="categories-card__title">{cat.title}</h3>

                <p className="categories-card__text">
                  <strong>{cat.count}</strong>
                </p>
              </Link>
            ))}
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
