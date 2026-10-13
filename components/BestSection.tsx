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
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);

  useEffect(() => {
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
      const relX = x / rect.width;
      if (relX < 0.5) {
        if (!isHovered1) {
          setIsHovered1(true);
          setIsHovered2(false);
          if (video2Ref.current) {
            video2Ref.current.pause();
            video2Ref.current.currentTime = 0;
          }
          if (video1Ref.current) {
            video1Ref.current.play().catch(() => {});
          }
        }
      } else {
        if (!isHovered2) {
          setIsHovered2(true);
          setIsHovered1(false);
          if (video1Ref.current) {
            video1Ref.current.pause();
            video1Ref.current.currentTime = 0;
          }
          if (video2Ref.current) {
            video2Ref.current.play().catch(() => {});
          }
        }
      }
    }
  };

  const handleInnerMouseEnter = () => {
    setIsCursorVisible(true);
  };

  const handleInnerMouseLeave = () => {
    setIsCursorVisible(false);
    setIsHovered1(false);
    setIsHovered2(false);
    if (video1Ref.current) {
      video1Ref.current.pause();
      video1Ref.current.currentTime = 0;
    }
    if (video2Ref.current) {
      video2Ref.current.pause();
      video2Ref.current.currentTime = 0;
    }
  };

  return (
    <section className="best-section" id="best" style={{ position: 'relative', width: '100%', padding: '4rem 0 2rem 0' }}>
      <div className="container" style={{ marginBottom: '2.5rem', overflow: 'visible' }}>
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
        onMouseEnter={handleInnerMouseEnter}
        onMouseLeave={handleInnerMouseLeave}
      >
        {/* Torn Paper Seam Graphic Overlay */}
        <picture className="best-section__paper">
          <source media="(min-width: 1024px)" srcSet="/images/paper_desk.webp" type="image/webp" />
          <source media="(min-width: 768px)" srcSet="/images/paper_tablet.webp" type="image/webp" />
          <img src="/images/img_159.webp" alt="" />
        </picture>

        {/* Top Masked Layer: Dresses (masked strictly by paper tear mask) */}
        <div className="best-section__top">
          <div
            className="best-card"
            onMouseEnter={() => {
              setIsHovered1(true);
              setIsHovered2(false);
              video2Ref.current?.pause();
              video1Ref.current?.play().catch(() => {});
            }}
            onMouseLeave={() => {
              setIsHovered1(false);
              video1Ref.current?.pause();
            }}
          >
            <Link
              href="/products/classic-knit-maxi-dress"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                height: '100%',
                textDecoration: 'none',
                color: 'inherit',
                position: 'relative',
              }}
            >
              {/* Background Video */}
              <video
                ref={video1Ref}
                className="best-card__video"
                loop
                muted
                playsInline
                preload="metadata"
                poster="/images/best_img_1.webp"
                style={{
                  opacity: isHovered1 ? 1 : 0.95,
                  transition: 'opacity 0.4s ease',
                }}
              >
                <source src="/videos/campaign_video.webm" type="video/webm" />
                <source src="/videos/nastia.mp4" type="video/mp4" />
              </video>

              {/* Description Text with difference blend */}
              <p className="best-card__text">
                <span>INSPIRED BY BERLIN’S NIGHTLIFE,</span>
                <span>
                  <strong style={{ color: '#2ec8cd' }}>BERLIN VIBES</strong> FW25/26 CELEBRATES
                </span>
                <span>WOMEN’S BOLD SEXUALITY.</span>
              </p>

              {/* Mobile / Tablet Button */}
              <div className="best-card__button">
                <span style={{ fontFamily: 'PP Fraktion Mono, monospace' }}>
                  <strong>[ </strong>See collection<strong> ]</strong>
                </span>
              </div>

              {/* Mobile Language tag */}
              <span className="best-card__lang">(UA)</span>

              {/* Bottom Title & Counter */}
              <div className="best-card__bottom">
                <div className="best-card__title">
                  <p>
                    <span>DRESSES</span>
                  </p>
                  <i>
                    (<strong>GLAM</strong>)
                  </i>
                </div>
                <p className="best-card__count">
                  <strong>[ </strong>25<strong> ]</strong>
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Layer: Corsets */}
        <div className="best-section__bottom">
          <div
            className="best-card"
            onMouseEnter={() => {
              setIsHovered2(true);
              setIsHovered1(false);
              video1Ref.current?.pause();
              video2Ref.current?.play().catch(() => {});
            }}
            onMouseLeave={() => {
              setIsHovered2(false);
              video2Ref.current?.pause();
            }}
          >
            <Link
              href="/products/witch-velvet-corset"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                height: '100%',
                textDecoration: 'none',
                color: 'inherit',
                position: 'relative',
              }}
            >
              {/* Background Video */}
              <video
                ref={video2Ref}
                className="best-card__video"
                loop
                muted
                playsInline
                preload="metadata"
                poster="/images/best_img_2.webp"
                style={{
                  opacity: isHovered2 ? 1 : 0.95,
                  transition: 'opacity 0.4s ease',
                }}
              >
                <source src="/videos/corset.mp4" type="video/mp4" />
              </video>

              {/* Description Text with difference blend */}
              <p className="best-card__text">
                <span>SHEER MESH, LATEX, AND OVERSIZED FAUX FURS</span>
                <span>
                  <strong style={{ color: '#2ec8cd' }}>FRAME</strong> FEARLESS{' '}
                  <strong style={{ color: '#ed3833' }}>SILHOUETTES</strong> THAT EMPOWER
                </span>
                <span>
                  WOMEN TO OWN THEIR <strong style={{ color: '#ed3833' }}>UNTAMED ENERGY.</strong>
                </span>
              </p>

              {/* Mobile / Tablet Button */}
              <div className="best-card__button">
                <span style={{ fontFamily: 'PP Fraktion Mono, monospace' }}>
                  <strong>[ </strong>See collection<strong> ]</strong>
                </span>
              </div>

              {/* Mobile Language tag */}
              <span className="best-card__lang">(UA)</span>

              {/* Bottom Title & Counter */}
              <div className="best-card__bottom">
                <div className="best-card__title">
                  <p>
                    <span>CORSETS</span>
                  </p>
                  <i>
                    (<strong>WITCH</strong>)
                  </i>
                </div>
                <p className="best-card__count">
                  <strong>[ </strong>7<strong> ]</strong>
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Desktop Cursor Follower */}
        <div className={`best-section__cursor ${isCursorVisible ? 'visible' : ''}`} ref={cursorRef}>
          <p>
            <strong>[ </strong>See collection<strong> ]</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
