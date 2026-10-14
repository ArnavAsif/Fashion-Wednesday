'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BestSection() {
  const innerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const hoverStateRef = useRef<{ isHover1: boolean; isHover2: boolean }>({ isHover1: false, isHover2: false });
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);

  useEffect(() => {
    if (video1Ref.current) {
      video1Ref.current.muted = true;
      video1Ref.current.defaultMuted = true;
      video1Ref.current.playsInline = true;
    }
    if (video2Ref.current) {
      video2Ref.current.muted = true;
      video2Ref.current.defaultMuted = true;
      video2Ref.current.playsInline = true;
    }

    const ctx = gsap.context(() => {
      const title = document.querySelector('.best-section__title');
      if (title) {
        gsap.fromTo(
          title,
          { scaleY: 0, transformOrigin: 'bottom' },
          {
            scaleY: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: title,
              start: 'top 95%',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!innerRef.current || !cursorRef.current) return;
    const rect = innerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    if (window.innerWidth >= 1024) {
      const isLeft = x < rect.width * 0.5;
      if (isLeft) {
        if (!hoverStateRef.current.isHover1) {
          hoverStateRef.current.isHover1 = true;
          hoverStateRef.current.isHover2 = false;
          setIsHovered1(true);
          setIsHovered2(false);
          if (video2Ref.current) {
            video2Ref.current.pause();
          }
          if (video1Ref.current) {
            const p = video1Ref.current.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
          }
        }
      } else {
        if (!hoverStateRef.current.isHover2) {
          hoverStateRef.current.isHover2 = true;
          hoverStateRef.current.isHover1 = false;
          setIsHovered2(true);
          setIsHovered1(false);
          if (video1Ref.current) {
            video1Ref.current.pause();
          }
          if (video2Ref.current) {
            const p = video2Ref.current.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
          }
        }
      }
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 1024) {
      setIsCursorVisible(true);
      handleMouseMove(e);
    }
  };

  const handleMouseLeave = () => {
    setIsCursorVisible(false);
    setIsHovered1(false);
    setIsHovered2(false);
    hoverStateRef.current = { isHover1: false, isHover2: false };
    if (video1Ref.current) {
      video1Ref.current.pause();
    }
    if (video2Ref.current) {
      video2Ref.current.pause();
    }
  };

  return (
    <section className="best-section" id="best" style={{ position: 'relative', width: '100%', padding: '4rem 0 6rem 0' }}>
      <div className="container" style={{ marginBottom: '3rem', overflow: 'visible' }}>
        <h2
          className="best-section__title h2"
          style={{
            color: '#ed3833',
            fontFamily: 'PP Fraktion Mono, sans-serif',
            textTransform: 'uppercase',
            fontWeight: 800,
            fontSize: 'clamp(2.8rem, 4.5vw, 5.5rem)',
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: '-0.02em',
            overflow: 'visible',
          }}
        >
          <span className="line" style={{ display: 'block', overflow: 'visible' }}>
            05. CATEGORIES
          </span>
        </h2>
      </div>

      <div
        className="best-section__inner"
        ref={innerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Layer 1: Bottom Layer (Right - Corsets) */}
        <div className="best-section__bottom">
          <div className="best-section__media-right">
            {/* Fallback Poster Image: ALWAYS VISIBLE */}
            <img
              src="/images/best_img_2.webp"
              alt="Corsets Collection"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                zIndex: 1,
                display: 'block',
              }}
            />
            {/* Corset Video */}
            <video
              ref={video2Ref}
              loop
              muted
              playsInline
              preload="auto"
              poster="/images/best_img_2.webp"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                zIndex: 2,
                display: 'block',
              }}
            >
              <source src="/videos/corset.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Layer 2: Top Masked Layer (Left - Dresses) */}
        <div
          className="best-section__top"
          style={{
            WebkitMaskSize: 'cover',
            maskSize: 'cover',
            WebkitMaskPosition: 'center center',
            maskPosition: 'center center',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        >
          <div className="best-section__media-left">
            {/* Fallback Poster Image: ALWAYS VISIBLE */}
            <img
              src="/images/best_img_1.webp"
              alt="Dresses Collection"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                zIndex: 1,
                display: 'block',
              }}
            />
            {/* Dresses Video */}
            <video
              ref={video1Ref}
              loop
              muted
              playsInline
              preload="auto"
              poster="/images/best_img_1.webp"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                zIndex: 2,
                display: 'block',
              }}
            >
              <source src="/videos/campaign_video.webm" type="video/webm" />
            </video>
          </div>
        </div>

        {/* Layer 3: Torn Paper Seam Graphic Overlay */}
        <picture
          className="best-section__paper"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10,
            display: 'block',
          }}
        >
          <source media="(min-width: 1024px)" srcSet="/images/paper_desk.webp" type="image/webp" />
          <source media="(min-width: 768px)" srcSet="/images/paper_tablet.webp" type="image/webp" />
          <img
            src="/images/img_159.webp"
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />
        </picture>

        {/* Layer 3.2: Top Editorial Copy (with difference blend mode for automatic contrast on any background) */}
        <div className="best-top-row-left">
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(1.1rem, 1.25vw, 1.35rem)',
              fontWeight: 600,
              lineHeight: 1.35,
              letterSpacing: '-0.03rem',
              textTransform: 'uppercase',
              color: '#ffffff',
            }}
          >
            <span style={{ display: 'block' }}>
              INSPIRED BY BERLIN’S <strong style={{ color: '#2ec8cd' }}>NIGHTLIFE,</strong>
            </span>
            <span style={{ display: 'block' }}>
              <strong style={{ color: '#ed3833' }}>BERLIN VIBES</strong> FW25/26 CELEBRATES
            </span>
            <span style={{ display: 'block' }}>WOMEN’S BOLD SEXUALITY.</span>
          </p>
        </div>

        <div className="best-top-row-right">
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(1.1rem, 1.25vw, 1.35rem)',
              fontWeight: 600,
              lineHeight: 1.35,
              letterSpacing: '-0.03rem',
              textTransform: 'uppercase',
              color: '#ffffff',
            }}
          >
            <span style={{ display: 'block' }}>SHEER MESH, LATEX, AND OVERSIZED FAUX FURS</span>
            <span style={{ display: 'block' }}>
              <strong style={{ color: '#ed3833' }}>FRAME</strong> FEARLESS{' '}
              <strong style={{ color: '#ed3833' }}>SILHOUETTES</strong> THAT EMPOWER
            </span>
            <span style={{ display: 'block' }}>
              WOMEN TO OWN THEIR <strong style={{ color: '#ed3833' }}>UNTAMED ENERGY.</strong>
            </span>
          </p>
        </div>

        {/* Layer 3.5: Bottom Text DRESSES (GLAM) [25] and CORSETS (WITCH) [7] */}
        <div className="best-bottom-row-left">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem' }}>
            <span className="best-card__name">DRESSES</span>
            <i className="best-card__tag">
              (<strong>GLAM</strong>)
            </i>
          </div>
          <p className="best-card__count">
            <strong>[ </strong>25<strong> ]</strong>
          </p>
        </div>

        <div className="best-bottom-row-right">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem' }}>
            <span className="best-card__name">CORSETS</span>
            <i className="best-card__tag">
              (<strong>WITCH</strong>)
            </i>
          </div>
          <p className="best-card__count">
            <strong>[ </strong>7<strong> ]</strong>
          </p>
        </div>

        {/* Layer 4: Interactive Clickable Links */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
          <Link
            href="/products?category=DRESSES"
            className="best-section__link-dresses"
            aria-label="View Dresses Collection"
          />
          <Link
            href="/products?category=CORSETS"
            className="best-section__link-corsets"
            aria-label="View Corsets Collection"
          />
        </div>

        {/* Layer 5: Desktop Custom Follower Cursor */}
        <div
          ref={cursorRef}
          className={`best-section__cursor ${isCursorVisible ? 'visible' : ''}`}
        >
          <p>
            <strong>[</strong> SEE COLLECTION <strong>]</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
