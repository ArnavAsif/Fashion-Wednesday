'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function ProgressContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = () => {
    timerRef.current.forEach(t => clearTimeout(t));
    timerRef.current = [];
  };

  // When pathname or searchParams change, complete the progress bar
  useEffect(() => {
    if (!isVisible && progress === 0) return;

    // Jump to 100%
    setProgress(100);

    const t1 = setTimeout(() => {
      setIsVisible(false);
      const t2 = setTimeout(() => {
        setProgress(0);
      }, 300);
      timerRef.current.push(t2);
    }, 200);

    timerRef.current.push(t1);

    return () => clearTimers();
  }, [pathname, searchParams]);

  // Global click interceptor for internal links
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Ignore external, empty, or new tab links
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || targetAttr === '_blank') {
        return;
      }

      // Ignore hash-only links on same page
      if (href.startsWith('#')) return;

      // Ignore if clicking the exact current URL
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      // Start progress bar
      clearTimers();
      setIsVisible(true);
      setProgress(25);

      const t1 = setTimeout(() => {
        setProgress(65);
      }, 150);

      const t2 = setTimeout(() => {
        setProgress(85);
      }, 500);

      // Safety timeout to reset if navigation is aborted
      const t3 = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setProgress(0), 200);
      }, 4000);

      timerRef.current.push(t1, t2, t3);
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      clearTimers();
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2.5px',
        zIndex: 999998,
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#ed3833',
          boxShadow: '0 0 8px rgba(237, 56, 51, 0.7), 0 0 3px #ed3833',
          transition: progress === 100 ? 'width 0.15s ease-out' : 'width 0.35s cubic-bezier(0.1, 0.5, 0.5, 1)',
        }}
      />
    </div>
  );
}

export default function RouteProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressContent />
    </Suspense>
  );
}
