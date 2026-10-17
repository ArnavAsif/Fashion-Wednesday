'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import markerRedData from '@/public/lottie/LOTTIE_MARKER_v1.json';
import markerTurqData from '@/public/lottie/LOTTIE_MARKER_turq_v2.json';

export interface MarkerButtonProps {
  text: string;
  brackets?: boolean;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  cloneLastChar?: boolean;
  active?: boolean;
  disabled?: boolean;
  color?: 'red' | 'turq';
  isHovered?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  fontSize?: string;
  target?: string;
  rel?: string;
}

export default function MarkerButton({
  text,
  brackets = false,
  suffix,
  prefix,
  cloneLastChar = false,
  active = false,
  disabled = false,
  color = 'red',
  isHovered: controlledHover,
  href,
  onClick,
  className = '',
  style = {},
  textStyle = {},
  fontSize,
  target,
  rel,
}: MarkerButtonProps) {
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);
  const [extraChars, setExtraChars] = useState<string[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);

  const markerData = color === 'turq' ? markerTurqData : markerRedData;

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
  };

  // Setup Lottie
  useEffect(() => {
    let isMounted = true;
    const container = lottieContainerRef.current;
    if (!container) return;

    import('lottie-web').then((lottieModule) => {
      if (!isMounted || !container) return;
      const lottie = lottieModule.default;
      
      try {
        const anim = lottie.loadAnimation({
          container,
          renderer: 'canvas',
          loop: false,
          autoplay: false,
          animationData: markerData,
          rendererSettings: {
            preserveAspectRatio: 'none',
            clearCanvas: true,
          },
        });
        anim.setSpeed(2.2);
        animRef.current = anim;
        (container as any).__lottieAnim = anim;

        if (active) {
          anim.goToAndStop(18, true);
        }
      } catch (err) {
        console.error('Lottie load error:', err);
      }
    });

    return () => {
      isMounted = false;
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, []);

  // Update when active state changes
  useEffect(() => {
    if (!animRef.current) return;
    if (active) {
      animRef.current.goToAndStop(18, true);
    } else if (!isHoveredRef.current) {
      animRef.current.goToAndStop(0, true);
    }
  }, [active]);

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    isHoveredRef.current = true;
    clearAllTimeouts();

    if (animRef.current) {
      animRef.current.setDirection(1);
      animRef.current.play();
    }

    if (cloneLastChar && text.length > 0) {
      const lastChar = text[text.length - 1];
      const t1 = setTimeout(() => {
        if (isHoveredRef.current) setExtraChars([lastChar]);
      }, 140);
      const t2 = setTimeout(() => {
        if (isHoveredRef.current) setExtraChars([lastChar, lastChar]);
      }, 280);
      timeoutsRef.current.push(t1, t2);
    }
  }, [disabled, cloneLastChar, text]);

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;
    isHoveredRef.current = false;
    clearAllTimeouts();

    if (animRef.current) {
      if (active) {
        animRef.current.goToAndStop(18, true);
      } else {
        animRef.current.setDirection(-1);
        animRef.current.play();
      }
    }

    if (cloneLastChar) {
      const t1 = setTimeout(() => {
        setExtraChars(prev => prev.slice(0, 1));
      }, 120);
      const t2 = setTimeout(() => {
        setExtraChars([]);
      }, 240);
      timeoutsRef.current.push(t1, t2);
    }
  }, [disabled, cloneLastChar, active]);

  useEffect(() => {
    if (controlledHover === undefined) return;
    if (controlledHover) {
      handleMouseEnter();
    } else {
      handleMouseLeave();
    }
  }, [controlledHover, handleMouseEnter, handleMouseLeave]);

  const content = (
    <span
      className={`marker-btn-root select-none uppercase tracking-normal relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={disabled ? undefined : onClick}
      style={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        fontSize: fontSize || undefined,
        lineHeight: 1,
        verticalAlign: 'middle',
        ...style,
      }}
    >
      {prefix}
      {brackets && (
        <span
          className="bracket select-none"
          style={{
            display: 'inline-block',
            fontWeight: 200,
            color: '#888',
            marginRight: '0.22em',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          [
        </span>
      )}
      <span
        className="inner-label-box relative"
        style={{
          position: 'relative',
          display: 'inline-block',
          whiteSpace: 'nowrap',
          lineHeight: 1,
          padding: '0 2px',
          verticalAlign: 'baseline',
          ...textStyle,
        }}
      >
        <span style={{ display: 'inline', whiteSpace: 'nowrap' }}>{text}</span>
        {extraChars.map((c, i) => (
          <span key={i} className="char-clone" style={{ display: 'inline', whiteSpace: 'nowrap' }}>
            {c}
          </span>
        ))}
        {/* Lottie Marker Overlay */}
        <span
          ref={lottieContainerRef}
          className="marker-lottie-layer pointer-events-none"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: brackets && text.length <= 2 ? '150%' : '115%',
            minWidth: brackets && text.length <= 2 ? '28px' : undefined,
            height: '100%',
            minHeight: '16px',
            maxHeight: '26px',
            zIndex: 5,
            display: 'block',
            pointerEvents: 'none',
            mixBlendMode: 'multiply',
          }}
        />
      </span>
      {brackets && (
        <span
          className="bracket select-none"
          style={{
            display: 'inline-block',
            fontWeight: 200,
            color: '#888',
            marginLeft: '0.22em',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          ]
        </span>
      )}
      {suffix}
    </span>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        style={{
          display: 'inline-flex',
          textDecoration: 'none',
          color: 'inherit',
          whiteSpace: 'nowrap',
          verticalAlign: 'middle',
        }}
      >
        {content}
      </Link>
    );
  }

  return content;
}
