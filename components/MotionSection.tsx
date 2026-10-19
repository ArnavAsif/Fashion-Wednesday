'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MotionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLParagraphElement>(null);
  const wingsRef = useRef<HTMLDivElement>(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.defaultMuted = true;
              videoRef.current.playsInline = true;
              const p = videoRef.current.play();
              if (p && typeof p.catch === 'function') p.catch(() => {});
            }
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { rootMargin: '350px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldLoad && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.playsInline = true;
      const p = videoRef.current.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  }, [shouldLoad]);

  useEffect(() => {
    const getInitialMaskW = () => {
      if (typeof window === 'undefined') return 30;
      if (window.innerWidth < 768) return 85;
      if (window.innerWidth < 1024) return 55;
      return 30;
    };

    if (maskRef.current) {
      maskRef.current.style.setProperty('--maskW', `${getInitialMaskW()}%`);
    }

    const ctx = gsap.context(() => {
      // Entrance animations for title and intro text
      gsap.from(
        '.motion-section__subtitle',
        {
          scaleY: 0,
          opacity: 0,
          transformOrigin: '50% 100%',
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
        }
      );

      gsap.from(
        '.motion-section__text',
        {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
        }
      );

      // Main ScrollTrigger Pin & Scrub animation through the 4 visual stages
      if (containerRef.current && pinRef.current && maskRef.current) {
        const initW = getInitialMaskW();
        maskRef.current.style.setProperty('--maskW', `${initW}%`);
        maskRef.current.style.transform = 'translateY(40px)';

        // 1. Pin the film scene until the footer reaches the bottom of the screen (no pinSpacing so footer slides over)
        ScrollTrigger.create({
          trigger: pinRef.current,
          start: 'top top',
          endTrigger: '#footer',
          end: 'bottom bottom',
          pin: pinRef.current,
          pinSpacing: false,
        });

        // 2. Timeline for mask expansion and text transitions while scrolling through container
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
            onUpdate: (self) => {
              const p = self.progress;
              setIsFullScreen(p > 0.65);

              // 1. Text fade out in first 25% of scroll
              if (textGroupRef.current) {
                const textOpacity = Math.max(0, 1 - p * 4);
                textGroupRef.current.style.opacity = `${textOpacity}`;
                textGroupRef.current.style.transform = `translateY(-${p * 80}px)`;
              }

              // 2. Tip scroll to dive fades out early
              if (tipRef.current) {
                const tipOpacity = Math.max(0, 1 - p * 4.5);
                tipRef.current.style.opacity = `${tipOpacity}`;
              }

              // 3. Mask size grows from initial up to 440%
              const currentInit = getInitialMaskW();
              const maskScale = currentInit + p * (440 - currentInit);
              if (maskRef.current) {
                maskRef.current.style.setProperty('--maskW', `${maskScale}%`);
                const offsetY = Math.max(0, 40 * (1 - p * 3));
                maskRef.current.style.transform = `translateY(${offsetY}px)`;
              }

              // 4. Wings doodle in stage 3 (progress > 0.5)
              if (wingsRef.current) {
                const wOpacity = p > 0.5 ? Math.min(1, (p - 0.5) * 4) : 0;
                wingsRef.current.style.opacity = `${wOpacity}`;
              }
            },
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="motion-section" id="film" style={{ position: 'relative', overflow: 'hidden', paddingTop: 0 }}>
      <div ref={pinRef} className="motion-section__pin" style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        {/* Stage 1 Intro Header & Subtitle */}
        <div ref={textGroupRef} className="container" style={{ position: 'relative', zIndex: 10, paddingTop: 'clamp(1.5rem, 3.5vh, 2.5rem)', transition: 'opacity 0.2s linear' }}>
          <div className="motion-section__top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="motion-section__title h2" style={{
              color: '#ed3833',
              fontFamily: 'PP Fraktion Mono, monospace',
              fontSize: '1.2rem',
              fontWeight: 700,
              letterSpacing: '-0.05rem',
              textTransform: 'uppercase',
            }}>
              07. ELVAREN FILM
            </h2>
            <div className="motion-section__icons" style={{ display: 'flex', gap: '0.6rem' }}>
              <img src="/images/img_164.svg" alt="care" style={{ width: '2.8rem', height: '2.8rem' }} />
              <img src="/images/img_165.svg" alt="iron" style={{ width: '2.8rem', height: '2.8rem' }} />
            </div>
          </div>

          <div className="motion-section__mid" style={{ textAlign: 'center', maxWidth: '75rem', margin: '0 auto' }}>
            <p className="motion-section__subtitle" style={{
              fontFamily: 'Thunder, sans-serif',
              fontSize: 'clamp(3.8rem, 5.8vw, 6.2rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              lineHeight: 0.9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              marginBottom: '0.8rem',
            }}>
              A VISION IN MOTION. <img src="/images/img_163.webp" alt="" style={{ height: '2.2rem', width: 'auto', display: 'inline-block' }} />
            </p>
            <p className="motion-section__text" style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(0.95rem, 1.1vw, 1.15rem)',
              fontWeight: 600,
              lineHeight: 1.35,
              letterSpacing: '-0.03rem',
              textTransform: 'uppercase',
              color: '#000',
              maxWidth: '62rem',
              margin: '0 auto',
            }}>
              EXPERIENCE THE ESSENCE OF <strong style={{ color: '#ed3833' }}>ELVAREN</strong> THROUGH FILM. OUR <strong style={{ color: '#ed3833' }}>CINEMATIC</strong> JOURNEY BRINGS TO LIFE THE BOLD, ARTISTIC SPIRIT BEHIND EACH COLLECTION. <strong style={{ color: '#ed3833' }}>WATCH</strong> AS OUR DESIGNS MOVE, <strong style={{ color: '#ed3833' }}>INSPIRE,</strong> AND TELL STORIES OF INDIVIDUALITY, STRENGTH, AND REBELLION.
            </p>
          </div>
        </div>

        {/* Center / Expanding Mask Film Scene Container */}
        <div
          ref={maskRef}
          className="motion-section__bottom"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
            pointerEvents: 'auto',
            transform: 'translateY(40px)',
            // @ts-ignore
            '--maskW': '30%',
          }}
        >
          {/* Active Film Video */}
          <video
            ref={videoRef}
            className="motion-section__video"
            loop
            muted
            playsInline
            preload="none"
            poster="/images/motion_poster.webp"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scale(1.08)',
            }}
          >
            {shouldLoad && <source src="/videos/video_2.mp4" type="video/mp4" />}
          </video>


          {/* Doodle Angel Wings Overlay (Stage 3 - Screenshot 14) */}
          <div
            ref={wingsRef}
            style={{
              position: 'absolute',
              top: '48%',
              left: '8%',
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity 0.2s ease',
              zIndex: 15,
            }}
          >
            <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Left wing doodle */}
              <path
                d="M100 70 C70 50, 40 40, 20 60 C15 70, 25 85, 45 80 C35 90, 50 100, 70 88 C60 100, 80 105, 95 85 Z"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Right wing doodle */}
              <path
                d="M110 70 C140 50, 170 40, 190 60 C195 70, 185 85, 165 80 C175 90, 160 100, 140 88 C150 100, 130 105, 115 85 Z"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

        </div>

        {/* Tip: Scroll to dive message at bottom */}
        <p
          ref={tipRef}
          className="motion-section__scroll"
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '-0.03rem',
            color: '#000',
            zIndex: 10,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <strong style={{ color: '#ed3833' }}>tip:</strong> scroll to dive
        </p>
      </div>
    </section>
  );
}
