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
  { title: 'SALE', count: '[ 17 ]', img: '/images/categories/cat_1.jpg' },
  { title: 'ACCESSORIES', count: '[ 8 ]', img: '/images/categories/cat_2.jpg' },
  { title: 'BODYS', count: '[ 3 ]', img: '/images/categories/cat_3.jpg' },
  { title: 'BOTTOMS', count: '[ 6 ]', img: '/images/categories/cat_4.jpg' },
  { title: 'COATS', count: '[ 3 ]', img: '/images/categories/cat_5.jpg' },
  { title: 'CORSETS', count: '[ 8 ]', img: '/images/categories/cat_6.jpg' },
  { title: 'DRESSES', count: '[ 8 ]', img: '/images/categories/cat_7.jpg' },
  { title: 'JACKETS', count: '[ 5 ]', img: '/images/categories/cat_8.jpg' },
  { title: 'SKIRTS', count: '[ 3 ]', img: '/images/categories/cat_9.jpg' },
  { title: 'SPECIAL EDITION', count: '[ 8 ]', img: '/images/categories/cat_10.jpg' },
  { title: 'TOPS', count: '[ 17 ]', img: '/images/categories/cat_11.jpg' },
  { title: 'NEW DROP', count: '[ 14 ]', img: '/images/categories/cat_12.jpg' },
];

const DISPLAY_CATEGORIES: CatItem[] = [...CATEGORIES, ...CATEGORIES];

export default function CategoriesSection() {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Marquee hover and animation state
  const isHoveredRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const scrollPosRef = useRef(0);

  // Desktop & mobile drag interaction states
  const isMouseDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const mouseStartXRef = useRef(0);
  const mouseStartYRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const updateProgress = useCallback(() => {
    if (trackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      const halfWidth = scrollWidth / 2;
      const maxScroll = halfWidth > 0 ? halfWidth : scrollWidth - clientWidth;
      const current = halfWidth > 0 ? scrollLeft % halfWidth : scrollLeft;
      setProgress(maxScroll > 0 ? (current / maxScroll) * 100 : 0);
    }
  }, []);

  // Native hover listener to immediately stop movement on hover
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onEnter = () => {
      isHoveredRef.current = true;
    };
    const onLeave = () => {
      isHoveredRef.current = false;
    };

    track.addEventListener('mouseenter', onEnter);
    track.addEventListener('mouseleave', onLeave);
    track.addEventListener('pointerenter', onEnter);
    track.addEventListener('pointerleave', onLeave);

    return () => {
      track.removeEventListener('mouseenter', onEnter);
      track.removeEventListener('mouseleave', onLeave);
      track.removeEventListener('pointerenter', onEnter);
      track.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // Smooth continuous marquee effect (stops on hover or user drag)
  useEffect(() => {
    let lastTime: number | null = null;
    const SPEED_PX_PER_SEC = 60; // faster, smooth and lively marquee scroll

    const step = (now: number) => {
      if (lastTime === null) {
        lastTime = now;
        if (trackRef.current) {
          scrollPosRef.current = trackRef.current.scrollLeft;
        }
      }
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const track = trackRef.current;
      if (
        track &&
        !isHoveredRef.current &&
        !isMouseDownRef.current &&
        !isDraggingRef.current
      ) {
        scrollPosRef.current += SPEED_PX_PER_SEC * dt;

        // Seamless wrap when reaching the midpoint of duplicated categories
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0 && scrollPosRef.current >= halfWidth) {
          scrollPosRef.current -= halfWidth;
        }

        track.scrollLeft = scrollPosRef.current;
        updateProgress();
      } else if (track) {
        // Keep scrollPosRef synced during manual interaction
        scrollPosRef.current = track.scrollLeft;
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [updateProgress]);

  // Entrance scroll trigger
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
    });

    return () => ctx.revert();
  }, []);

  // Unified Pointer & Mouse Drag Handling
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (!trackRef.current) return;

    isMouseDownRef.current = true;
    isDraggingRef.current = false;
    mouseStartXRef.current = e.clientX;
    mouseStartYRef.current = e.clientY;
    scrollLeftStartRef.current = trackRef.current.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current || !trackRef.current) return;

    const dx = e.clientX - mouseStartXRef.current;
    const dy = e.clientY - mouseStartYRef.current;

    // Movement must exceed 12px to be treated as an intentional drag
    if (Math.hypot(dx, dy) > 12) {
      if (!isDraggingRef.current) {
        isDraggingRef.current = true;
        setIsGrabbing(true);
      }
      trackRef.current.scrollLeft = scrollLeftStartRef.current - dx;
      updateProgress();
    }
  };

  const handlePointerUp = () => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    setIsGrabbing(false);

    // Keep isDraggingRef true for a short tick so onClick suppresses accidental drag-release clicks
    if (isDraggingRef.current) {
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 100);
    }
  };

  const handleCardClick = (e: React.MouseEvent, catTitle: string) => {
    // If dragging on desktop or actively swiping on mobile, prevent accidental navigation
    if (isDraggingRef.current) {
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

          {/* Draggable & Marquee Category Cards Track */}
          <div
            ref={trackRef}
            onScroll={updateProgress}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onMouseEnter={() => {
              isHoveredRef.current = true;
            }}
            onMouseLeave={() => {
              isHoveredRef.current = false;
              handlePointerUp();
            }}
            className="categories-section__list"
            style={{
              display: 'flex',
              gap: '1.5rem',
              overflowX: 'auto',
              scrollSnapType: 'none',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-x pan-y',
              paddingBottom: '1.5rem',
              cursor: isGrabbing ? 'grabbing' : 'grab',
              userSelect: isGrabbing ? 'none' : 'auto',
            }}
          >
            {DISPLAY_CATEGORIES.map((cat, idx) => {
              const categoryUrl = `/products?category=${encodeURIComponent(cat.title)}`;
              return (
                <Link
                  key={idx}
                  href={categoryUrl}
                  onClick={(e) => handleCardClick(e, cat.title)}
                  onMouseEnter={() => {
                    isHoveredRef.current = true;
                    router.prefetch(categoryUrl);
                  }}
                  onMouseLeave={() => {
                    isHoveredRef.current = false;
                  }}
                  className="categories-card"
                  style={{
                    flex: '0 0 clamp(28rem, 26vw, 34rem)',
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
