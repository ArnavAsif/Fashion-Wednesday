'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MarkerButton from '@/components/MarkerButton';

gsap.registerPlugin(ScrollTrigger);

interface HeroDrop {
  name: string;
  img: string;
  line: string;
}

const DROPS: HeroDrop[] = [
  { name: 'NEW DROP', img: '/images/hero/hero_banner_1.jpg', line: '/images/img_095.webp' },
  { name: 'QUARPA CAPSULE', img: '/images/hero/hero_banner_2.jpg', line: '/images/img_095.webp' },
  { name: 'LIFE FORCE', img: '/images/hero/hero_banner_3.jpg', line: '/images/img_095.webp' },
  { name: 'BERLIN VIBES', img: '/images/hero/hero_banner_4.jpg', line: '/images/img_095.webp' },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const currentIndexRef = useRef(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = Array.from(list.querySelectorAll<HTMLLIElement>('li'));
    if (items.length <= 1) return;

    const customEase = 'power3.inOut';

    // Initial setup: activate item 0, hide others
    items.forEach((item, idx) => {
      const titles = item.querySelectorAll('.hero-card__title');
      if (idx === 0) {
        gsap.set(item, { scaleY: 1, transformOrigin: '50% 100%', force3D: true });
        gsap.set(titles, { scaleY: 1, transformOrigin: '50% 100%', force3D: true });
        item.classList.add('is-active');
      } else {
        gsap.set(item, { scaleY: 0, transformOrigin: '50% 100%', force3D: true });
        gsap.set(titles, { scaleY: 0, transformOrigin: '50% 100%', force3D: true });
      }
    });

    // Animate side titles entrance
    gsap.fromTo(
      '.hero-side-title-left, .hero-side-title-right',
      { scaleY: 0, opacity: 0, transformOrigin: '50% 100%' },
      { scaleY: 1, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.3 }
    );

    let timer: NodeJS.Timeout | null = null;

    const transitionToNext = () => {
      const curIdx = currentIndexRef.current;
      const nextIdx = (curIdx + 1) % items.length;

      const currentItem = items[curIdx];
      const currentTitles = currentItem.querySelectorAll('.hero-card__title');
      const nextItem = items[nextIdx];
      const nextTitles = nextItem.querySelectorAll('.hero-card__title');

      if (timelineRef.current) timelineRef.current.kill();

      // Reset next item origin and scale ready to rise from bottom
      gsap.set(nextItem, { scaleY: 0, transformOrigin: '50% 100%', force3D: true });
      gsap.set(nextTitles, { scaleY: 0, transformOrigin: '50% 100%', force3D: true });

      currentItem.classList.remove('is-active');
      nextItem.classList.add('is-active');

      const tl = gsap.timeline({
        onComplete: () => {
          currentIndexRef.current = nextIdx;
          timer = setTimeout(transitionToNext, 5000);
        },
      });
      timelineRef.current = tl;

      // Current slide rolls up to top
      tl.to(
        currentItem,
        { scaleY: 0, duration: 1.4, ease: customEase, transformOrigin: '50% 0%', force3D: true },
        0
      );
      // Next slide rolls up from bottom to fill screen
      tl.to(
        nextItem,
        { scaleY: 1, duration: 1.4, ease: customEase, transformOrigin: '50% 100%', force3D: true },
        0
      );
      // Current titles roll up to top
      tl.to(
        currentTitles,
        { scaleY: 0, duration: 0.7, ease: 'power2.inOut', transformOrigin: '50% 0%', force3D: true },
        0
      );
      // Next titles roll up from bottom
      tl.to(
        nextTitles,
        { scaleY: 1, duration: 0.7, ease: 'power2.inOut', transformOrigin: '50% 100%', force3D: true },
        0.7
      );
    };

    timer = setTimeout(transitionToNext, 5000);

    return () => {
      if (timer) clearTimeout(timer);
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero-section"
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
      }}
    >
      {/* Full Bleed Slides List (100% width x 100% height) */}
      <ul
        ref={listRef}
        className="hero-section__list"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          zIndex: 1,
        }}
      >
        {DROPS.map((drop, idx) => {
          const isInitial = idx === 0;
          return (
            <li
              key={drop.name}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                listStyle: 'none',
              }}
            >
              <a
                href="#arrivals"
                className="hero-card"
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                }}
              >
                {/* Central Torn Seam Graphic */}
                <picture className="hero-card__img-line">
                  <img
                    src={drop.line}
                    alt=""
                    loading={isInitial ? 'eager' : 'lazy'}
                    decoding={isInitial ? 'sync' : 'async'}
                    // @ts-ignore
                    fetchPriority={isInitial ? 'high' : 'auto'}
                  />
                </picture>

                {/* Right Grayscale Half */}
                <div className="hero-card__img-bw">
                  <img
                    src={drop.img}
                    alt={drop.name}
                    loading={isInitial ? 'eager' : 'lazy'}
                    decoding={isInitial ? 'sync' : 'async'}
                    // @ts-ignore
                    fetchPriority={isInitial ? 'high' : 'auto'}
                  />
                  <h3 className="hero-card__title" style={{ color: '#222' }}>
                    {drop.name}
                  </h3>
                </div>

                {/* Left Color Masked Half */}
                <div className="hero-card__img-color">
                  <img
                    src={drop.img}
                    alt={drop.name}
                    loading={isInitial ? 'eager' : 'lazy'}
                    decoding={isInitial ? 'sync' : 'async'}
                    // @ts-ignore
                    fetchPriority={isInitial ? 'high' : 'auto'}
                  />
                  <h3 className="hero-card__title" style={{ color: '#ed3833' }}>
                    {drop.name}
                  </h3>
                </div>
              </a>
            </li>
          );
        })}
      </ul>

      {/* Left Headline: ELVAREN */}
      <h1
        className="hero-side-title-left"
        style={{
          position: 'absolute',
          left: 'clamp(2rem, 3.5vw, 4.5rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          fontFamily: 'Thunder, sans-serif',
          fontSize: 'clamp(3.5rem, 5.5vw, 6.8rem)',
          fontWeight: 700,
          textTransform: 'uppercase',
          lineHeight: 0.85,
          letterSpacing: '0.06em',
          pointerEvents: 'none',
          color: '#000',
        }}
      >
        ELVAREN
      </h1>

      {/* Right Headline: WHERE GLAM MEETS GRUNGE */}
      <h2
        className="hero-side-title-right"
        style={{
          position: 'absolute',
          right: 'clamp(2rem, 3.5vw, 4.5rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          fontSize: 'clamp(3.5rem, 5.5vw, 6.8rem)',
          fontWeight: 800,
          textTransform: 'uppercase',
          lineHeight: 0.85,
          textAlign: 'right',
          letterSpacing: '-0.02em',
          pointerEvents: 'none',
          color: '#000',
        }}
      >
        WHERE GLAM<br />MEETS GRUNGE
      </h2>

      {/* Bottom Center: [ SEE COLLECTION ] */}
      <div
        className="hero-section__text"
        style={{
          position: 'absolute',
          bottom: 'clamp(2.5rem, 4vh, 4.5rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          textAlign: 'center',
        }}
      >
        <MarkerButton
          text="SEE COLLECTION"
          brackets
          cloneLastChar
          color="red"
          href="#arrivals"
          fontSize="clamp(1.4rem, 1.8vw, 2.2rem)"
          style={{ fontWeight: 600 }}
        />
      </div>
    </section>
  );
}
