'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState('INITIALIZING ARCHIVE');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Check if user has already seen the preloader in this session
    const seen = sessionStorage.getItem('bonez_preloader_seen');
    if (seen === 'true') {
      setShouldRender(false);
      return;
    }

    setShouldRender(true);

    // Lock body scroll while preloader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let current = 0;
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 1600; // 1.6s smooth luxury animation

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const ratio = Math.min(elapsed / duration, 1);

      // Non-linear easing: quick start, brief dwell, rapid finish
      // Cubic bezier-like easeInOut
      const eased = ratio < 0.5 ? 4 * ratio * ratio * ratio : 1 - Math.pow(-2 * ratio + 2, 3) / 2;
      current = Math.min(Math.round(eased * 100), 100);

      setProgress(current);

      if (current < 30) {
        setPhaseText('SYSTEM INITIALIZING // 2026');
      } else if (current < 65) {
        setPhaseText('LOADING RUNWAY SILHOUETTES');
      } else if (current < 95) {
        setPhaseText('COMPILING TEXTURES & HARDWARE');
      } else {
        setPhaseText('READY // ENTER BONEZ');
      }

      if (ratio < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setProgress(100);
        setPhaseText('READY // ENTER BONEZ');

        // Hold 100% briefly, then slide out
        setTimeout(() => {
          setIsSlidingOut(true);

          setTimeout(() => {
            setIsCompleted(true);
            setShouldRender(false);
            document.body.style.overflow = originalOverflow;
            sessionStorage.setItem('bonez_preloader_seen', 'true');
          }, 850); // Matches the curtain transition duration
        }, 180);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    // Fallback safety timeout in case RAF is paused or tab unfocused
    const safetyTimeout = setTimeout(() => {
      setProgress(100);
      setIsSlidingOut(true);
      setTimeout(() => {
        setIsCompleted(true);
        setShouldRender(false);
        document.body.style.overflow = originalOverflow;
        sessionStorage.setItem('bonez_preloader_seen', 'true');
      }, 850);
    }, 2800);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(safetyTimeout);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!shouldRender || isCompleted) return null;

  const paddedProgress = String(progress).padStart(3, '0');

  return (
    <div
      id="bonez-preloader"
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
          <span>[ BONEZ SYSTEM // SS_26 ]</span>
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
        {/* Massive Bold BONEZ Logotype */}
        <div style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
          <h1
            style={{
              fontFamily: 'Thunder, sans-serif',
              fontSize: 'clamp(5.5rem, 16vw, 15rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.025em',
              lineHeight: 0.82,
              margin: 0,
              color: '#000000',
            }}
          >
            BONEZ
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
