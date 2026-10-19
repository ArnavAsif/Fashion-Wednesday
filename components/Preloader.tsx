'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState('SYSTEM INITIALIZING // 2026');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check if already seen in this session (fast-mode for reloads)
    const seen = sessionStorage.getItem('elvaren_preloader_seen') === 'true';

    // Lock body scroll while preloader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let isMounted = true;
    let animationFrameId: number;
    let isReady = false;
    let currentProgress = 0;
    let targetProgress = seen ? 45 : 15;

    const getPhase = (p: number) => {
      if (p < 30) return 'SYSTEM INITIALIZING // 2026';
      if (p < 65) return 'LOADING RUNWAY SILHOUETTES';
      if (p < 95) return 'COMPILING TEXTURES & HARDWARE';
      return 'READY // ENTER ELVAREN';
    };

    const finishPreloader = () => {
      if (!isMounted) return;
      setProgress(100);
      setPhaseText('READY // ENTER ELVAREN');
      document.body.classList.add('elvaren-ready');
      sessionStorage.setItem('elvaren_preloader_seen', 'true');

      if (prefersReducedMotion) {
        setIsCompleted(true);
        setShouldRender(false);
        document.body.style.overflow = originalOverflow;
        window.dispatchEvent(new CustomEvent('elvaren:revealed'));
        return;
      }

      // Brief dwell at 100%, then slide curtain up smoothly
      setTimeout(() => {
        if (!isMounted) return;
        setIsSlidingOut(true);
        window.dispatchEvent(new CustomEvent('elvaren:revealed'));

        setTimeout(() => {
          if (!isMounted) return;
          setIsCompleted(true);
          setShouldRender(false);
          document.body.style.overflow = originalOverflow;
        }, 750); // Matches curtain slide-out duration
      }, seen ? 60 : 160);
    };

    const startTime = performance.now();
    const tick = () => {
      if (!isMounted) return;

      if (isReady) {
        targetProgress = 100;
      }

      if (currentProgress < targetProgress) {
        const speed = isReady ? (seen ? 6.0 : 4.0) : (seen ? 2.5 : 1.2);
        currentProgress = Math.min(currentProgress + speed, targetProgress);
        setProgress(Math.round(currentProgress));
        setPhaseText(getPhase(Math.round(currentProgress)));
      }

      if (currentProgress >= 100 && isReady) {
        finishPreloader();
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    // Critical Readiness Checker:
    // 1. Critical fonts available (Thunder & PP Fraktion Mono)
    // 2. Above-the-fold hero banner image loaded & decoded
    // 3. Hero mask & seam image loaded
    // 4. Hero container layout stable (valid dimensions)
    async function runReadinessCheck() {
      try {
        targetProgress = seen ? 55 : 35;

        // 1. Document & critical fonts ready
        if ('fonts' in document) {
          await document.fonts.ready;
          await Promise.allSettled([
            document.fonts.load('700 1rem Thunder'),
            document.fonts.load('800 1rem Thunder'),
            document.fonts.load('400 1rem "PP Fraktion Mono"'),
          ]);
        }

        if (!isMounted) return;
        targetProgress = seen ? 80 : 65;

        // 2. Hero banner image decode (if on homepage)
        const isHome = window.location.pathname === '/' || window.location.pathname === '';
        if (isHome) {
          const bannerImg = new Image();
          bannerImg.src = '/images/hero/hero_banner_1.jpg';
          const maskImg = new Image();
          maskImg.src = '/images/mask_img.webp';
          const seamImg = new Image();
          seamImg.src = '/images/img_095.webp';

          await Promise.allSettled([
            bannerImg.complete ? Promise.resolve() : new Promise((r) => { bannerImg.onload = r; bannerImg.onerror = r; }),
            maskImg.complete ? Promise.resolve() : new Promise((r) => { maskImg.onload = r; maskImg.onerror = r; }),
            seamImg.complete ? Promise.resolve() : new Promise((r) => { seamImg.onload = r; seamImg.onerror = r; }),
          ]);

          if ('decode' in bannerImg) {
            await bannerImg.decode().catch(() => {});
          }
        }

        if (!isMounted) return;
        targetProgress = seen ? 95 : 88;

        // 3. Hero layout measurement confirmation
        if (isHome) {
          let attempts = 0;
          while (attempts < 15 && isMounted) {
            const hero = document.getElementById('hero');
            if (hero && hero.offsetHeight > 0 && hero.offsetWidth > 0) {
              break;
            }
            await new Promise((r) => requestAnimationFrame(r));
            attempts++;
          }
        }

        // Pacing: ensure minimum elegant presence on first visit, or brief on reload
        const minDuration = seen ? 180 : 550;
        const elapsed = performance.now() - startTime;
        if (elapsed < minDuration) {
          await new Promise((r) => setTimeout(r, minDuration - elapsed));
        }

        isReady = true;
        targetProgress = 100;
      } catch {
        isReady = true;
        targetProgress = 100;
      }
    }

    runReadinessCheck();

    // Bounded safety fallback timeout (max 2200ms) - user is NEVER trapped!
    const safetyTimeout = setTimeout(() => {
      isReady = true;
      targetProgress = 100;
      currentProgress = 100;
      finishPreloader();
    }, 2200);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      clearTimeout(safetyTimeout);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!shouldRender || isCompleted) return null;

  const paddedProgress = String(progress).padStart(3, '0');

  return (
    <div
      id="elvaren-preloader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#fff9f7',
        color: '#000000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(1.5rem, 3.5vw, 3.5rem)',
        transform: isSlidingOut ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.85s cubic-bezier(0.85, 0, 0.15, 1)',
        pointerEvents: isSlidingOut ? 'none' : 'auto',
        userSelect: 'none',
      }}
    >
      {/* Red Leading Edge Slit Line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: '#ed3833',
          opacity: isSlidingOut ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Top Editorial Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          fontFamily: 'PP Fraktion Mono, monospace',
          fontSize: 'clamp(0.85rem, 0.9vw, 1.15rem)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#555555',
        }}
      >
        <div>
          <span>[ ELVAREN SYSTEM // SS_26 ]</span>
          <div style={{ fontSize: '0.8em', color: '#888', marginTop: '0.2rem' }}>
            WHERE GLAM MEETS GRUNGE
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span>PARIS — BERLIN — KYIV</span>
          <div style={{ fontSize: '0.8em', color: '#ed3833', marginTop: '0.2rem', fontWeight: 600 }}>
            ● EDITORIAL ARCHIVE
          </div>
        </div>
      </div>

      {/* Centerpiece: Brand & Progress Meter */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '700px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Massive Bold ELVAREN Logotype */}
        <div style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
          <h1
            style={{
              fontFamily: 'Thunder, sans-serif',
              fontSize: 'clamp(5.5rem, 16vw, 15rem)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              lineHeight: 0.82,
              margin: 0,
              color: '#000000',
            }}
          >
            ELVAREN
          </h1>
        </div>

        {/* Progress Track and Percentage */}
        <div style={{ width: '100%', maxWidth: '380px', marginBottom: '1.2rem' }}>
          {/* Architectural Thin Line Bar */}
          <div
            style={{
              width: '100%',
              height: '2px',
              backgroundColor: '#e6dedb',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '0.8rem',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: `${progress}%`,
                backgroundColor: '#ed3833',
                transition: 'width 0.1s linear',
              }}
            />
          </div>

          {/* Numbers & Phase text */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'PP Fraktion Mono, monospace',
              fontSize: 'clamp(1rem, 1.1vw, 1.3rem)',
            }}
          >
            <span style={{ color: '#ed3833', fontWeight: 700, letterSpacing: '0.02em' }}>
              [{paddedProgress}%]
            </span>
            <span style={{ color: '#666666', fontSize: '0.9em', letterSpacing: '0.03em' }}>
              {phaseText}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Editorial Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontFamily: 'PP Fraktion Mono, monospace',
          fontSize: 'clamp(0.85rem, 0.9vw, 1.15rem)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#555555',
        }}
      >
        <div>
          <span>(01/01) — RUNWAY RELEASE</span>
        </div>

        <div>
          <span>[ ALL RIGHTS RESERVED ]</span>
        </div>
      </div>
    </div>
  );
}
