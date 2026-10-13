'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MarkerButton from '@/components/MarkerButton';

gsap.registerPlugin(ScrollTrigger);

export default function BestSection() {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
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

  const handleMouseEnter1 = () => {
    setIsHovered1(true);
    if (video2Ref.current) {
      video2Ref.current.pause();
      video2Ref.current.currentTime = 0;
      setIsHovered2(false);
    }
    if (video1Ref.current) {
      const p = video1Ref.current.play();
      if (p !== undefined) p.catch(() => {});
    }
  };

  const handleMouseLeave1 = () => {
    setIsHovered1(false);
    if (video1Ref.current) {
      video1Ref.current.pause();
      video1Ref.current.currentTime = 0;
    }
  };

  const handleMouseEnter2 = () => {
    setIsHovered2(true);
    if (video1Ref.current) {
      video1Ref.current.pause();
      video1Ref.current.currentTime = 0;
      setIsHovered1(false);
    }
    if (video2Ref.current) {
      const p = video2Ref.current.play();
      if (p !== undefined) p.catch(() => {});
    }
  };

  const handleMouseLeave2 = () => {
    setIsHovered2(false);
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
            fontFamily: 'PP Fraktion Mono, Impact, sans-serif',
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
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(480px, 75vh, 800px)',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        {/* Left Split Block (Dresses) */}
        <div
          onMouseEnter={handleMouseEnter1}
          onMouseLeave={handleMouseLeave1}
          style={{
            width: '50%',
            height: '100%',
            position: 'relative',
            zIndex: 2,
            overflow: 'hidden',
          }}
        >
          <Link
            href="/products/classic-knit-maxi-dress"
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'clamp(2rem, 3vw, 3.5rem)',
              textDecoration: 'none',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
          >
            {/* Background Video with Poster Fallback */}
            <video
              ref={video1Ref}
              loop
              muted
              playsInline
              preload="metadata"
              poster="/images/best_img_1.webp"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
                opacity: isHovered1 ? 1 : 0.9,
                transition: 'opacity 0.4s ease',
              }}
            >
              <source src="/videos/campaign_video.webm" type="video/webm" />
              <source src="/videos/nastia.mp4" type="video/mp4" />
            </video>

            {/* Top Description */}
            <p
              style={{
                position: 'relative',
                zIndex: 2,
                color: '#fff',
                fontSize: 'clamp(1.1rem, 1.3vw, 1.35rem)',
                fontWeight: 600,
                textTransform: 'uppercase',
                lineHeight: 1.35,
                maxWidth: '32rem',
                margin: 0,
              }}
            >
              INSPIRED BY BERLIN’S NIGHTLIFE,<br />
              <strong style={{ color: '#ed3833' }}>BERLIN VIBES</strong> FW25/26 CELEBRATES<br />
              WOMEN’S BOLD SEXUALITY.
            </p>

            {/* Center [ SEE COLLECTION ] Button */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 5,
              }}
            >
              <MarkerButton
                text="SEE COLLECTION"
                brackets
                cloneLastChar
                color="turq"
                isHovered={isHovered1}
                fontSize="1.6rem"
                style={{ fontWeight: 600 }}
              />
            </div>

            {/* Bottom Title & Counter */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
                <MarkerButton
                  text="DRESSES"
                  color="turq"
                  isHovered={isHovered1}
                  fontSize="clamp(3.5rem, 5.5vw, 7.5rem)"
                  style={{ fontWeight: 800, lineHeight: 0.8 }}
                />
                <span
                  style={{
                    fontStyle: 'italic',
                    fontWeight: 800,
                    fontSize: 'clamp(1.5rem, 2.5vw, 2.8rem)',
                    color: '#fff',
                    lineHeight: 1,
                  }}
                >
                  (GLAM)
                </span>
              </div>

              <p
                style={{
                  color: '#fff',
                  fontSize: '1.8rem',
                  fontFamily: 'PP Fraktion Mono, monospace',
                  margin: 0,
                }}
              >
                [ 25 ]
              </p>
            </div>
          </Link>
        </div>

        {/* Right Split Block (Corsets) */}
        <div
          onMouseEnter={handleMouseEnter2}
          onMouseLeave={handleMouseLeave2}
          style={{
            width: '50%',
            height: '100%',
            position: 'relative',
            zIndex: 2,
            overflow: 'hidden',
          }}
        >
          <Link
            href="/products/witch-velvet-corset"
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'clamp(2rem, 3vw, 3.5rem)',
              textDecoration: 'none',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
          >
            {/* Background Video with Poster Fallback */}
            <video
              ref={video2Ref}
              loop
              muted
              playsInline
              preload="metadata"
              poster="/images/best_img_2.webp"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
                opacity: isHovered2 ? 1 : 0.9,
                transition: 'opacity 0.4s ease',
              }}
            >
              <source src="/videos/corset.mp4" type="video/mp4" />
            </video>

            {/* Top Description */}
            <p
              style={{
                position: 'relative',
                zIndex: 2,
                color: '#fff',
                fontSize: 'clamp(1.1rem, 1.3vw, 1.35rem)',
                fontWeight: 600,
                textTransform: 'uppercase',
                lineHeight: 1.35,
                maxWidth: '34rem',
                marginLeft: 'auto',
                textAlign: 'right',
                margin: 0,
              }}
            >
              SHEER MESH, LATEX, AND OVERSIZED FAUX FURS<br />
              <strong style={{ color: '#2ec8cd' }}>FRAME</strong> FEARLESS{' '}
              <strong style={{ color: '#ed3833' }}>SILHOUETTES</strong> THAT EMPOWER<br />
              WOMEN TO OWN THEIR{' '}
              <strong style={{ color: '#ed3833' }}>UNTAMED ENERGY.</strong>
            </p>

            {/* Center [ SEE COLLECTION ] Button */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 5,
              }}
            >
              <MarkerButton
                text="SEE COLLECTION"
                brackets
                cloneLastChar
                color="turq"
                isHovered={isHovered2}
                fontSize="1.6rem"
                style={{ fontWeight: 600 }}
              />
            </div>

            {/* Bottom Title & Counter */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
                <MarkerButton
                  text="CORSETS"
                  color="turq"
                  isHovered={isHovered2}
                  fontSize="clamp(3.5rem, 5.5vw, 7.5rem)"
                  style={{ fontWeight: 800, lineHeight: 0.8 }}
                />
                <span
                  style={{
                    fontStyle: 'italic',
                    fontWeight: 800,
                    fontSize: 'clamp(1.5rem, 2.5vw, 2.8rem)',
                    color: '#fff',
                    lineHeight: 1,
                  }}
                >
                  (WITCH)
                </span>
              </div>

              <p
                style={{
                  color: '#fff',
                  fontSize: '1.8rem',
                  fontFamily: 'PP Fraktion Mono, monospace',
                  margin: 0,
                }}
              >
                [ 7 ]
              </p>
            </div>
          </Link>
        </div>

        {/* Center Paper Tear Line Overlay */}
        <picture
          className="best-section__paper"
          style={{
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'auto',
            height: '100%',
            zIndex: 10,
          }}
        >
          <img
            src="/images/paper_desk.webp"
            alt=""
            style={{ width: 'auto', height: '100%', objectFit: 'cover' }}
          />
        </picture>
      </div>
    </section>
  );
}
