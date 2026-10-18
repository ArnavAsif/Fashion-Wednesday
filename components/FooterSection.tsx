'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '@/lib/cartContext';
import MarkerButton from '@/components/MarkerButton';

gsap.registerPlugin(ScrollTrigger);

export default function FooterSection({ onOpenCredits }: { onOpenCredits?: () => void }) {
  const router = useRouter();
  const { setIsNewsletterOpen } = useCart();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const discountLottieRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);
  const tweenRef = useRef<any>(null);
  const tweenObj = useRef({ frame: 58 });

  // Lottie Discount Badge Animation
  useEffect(() => {
    let isMounted = true;
    let anim: any = null;

    import('lottie-web')
      .then((lottie) => {
        if (!isMounted || !discountLottieRef.current) return;
        anim = lottie.default.loadAnimation({
          container: discountLottieRef.current,
          renderer: 'canvas',
          loop: false,
          autoplay: false,
          path: '/lottie/FOOTER_LOTTIE_v1.json',
        });
        animRef.current = anim;
        const isMobile =
          typeof window !== 'undefined' &&
          (window.innerWidth < 768 || !window.matchMedia('(hover: hover) and (pointer: fine)').matches);

        anim.addEventListener('DOMLoaded', () => {
          if (isMobile) {
            anim.goToAndStop(118, true);
          } else {
            anim.goToAndStop(58, true);
          }
        });

        if (isMobile) {
          anim.goToAndStop(118, true);
        } else {
          anim.goToAndStop(58, true);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
      if (tweenRef.current) tweenRef.current.kill();
      if (anim) anim.destroy();
    };
  }, []);

  const handleDiscountMouseEnter = () => {
    if (animRef.current) {
      if (tweenRef.current) tweenRef.current.kill();
      tweenRef.current = gsap.to(tweenObj.current, {
        frame: 118,
        duration: 0.45,
        ease: 'power2.out',
        onUpdate: () => {
          if (animRef.current) animRef.current.goToAndStop(tweenObj.current.frame, true);
        },
      });
    }
  };

  const handleDiscountMouseLeave = () => {
    if (animRef.current) {
      if (tweenRef.current) tweenRef.current.kill();
      tweenRef.current = gsap.to(tweenObj.current, {
        frame: 58,
        duration: 0.45,
        ease: 'power2.out',
        onUpdate: () => {
          if (animRef.current) animRef.current.goToAndStop(tweenObj.current.frame, true);
        },
      });
    }
  };

  // Dynamic Entrance Animation matching video and homepage motion
  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;

    let hasAnimated = false;

    // Initial state: hidden for entrance slide-in
    gsap.set('.footer__logo', { yPercent: 150, opacity: 0 });
    gsap.set('.footer__img', { yPercent: 80, opacity: 0 });
    gsap.set('.footer__form', { opacity: 0, y: 20 });
    gsap.set('.footer__title', { scaleY: 0, transformOrigin: '50% 100%' });

    const triggerAnimation = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      gsap.to('.footer__logo', {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
      });

      gsap.to('.footer__img', {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.05,
      });

      gsap.to('.footer__form', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.15,
      });

      gsap.to('.footer__title', {
        scaleY: 1,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.2,
      });
    };

    // ScrollTrigger entrance (triggers when footer top enters 85% of viewport)
    const st = ScrollTrigger.create({
      trigger: footerEl,
      start: 'top 88%',
      once: true,
      onEnter: () => triggerAnimation(),
    });

    // Secondary observer for pages without active ScrollTrigger updates
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.08 }
    );

    observer.observe(footerEl);

    return () => {
      st.kill();
      observer.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3500);
      setEmail('');
    }
  };

  const handleAnchorClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    const el = document.getElementById(sectionId);
    if (el) {
      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(el, { duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents jump to top of page!
  };

  return (
    <footer
      ref={footerRef}
      className="footer"
      id="footer"
      style={{ position: 'relative', width: '100%', overflow: 'hidden' }}
    >
      {/* Torn paper top doodles (lips and crown) - hidden on mobile */}
      <div
        className="footer__doodle hidden md:block"
        style={{ position: 'absolute', top: '1.2rem', left: '26%', zIndex: 12, pointerEvents: 'none' }}
      >
        <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 12 C12 6, 20 6, 24 10 C28 6, 36 6, 44 12 C36 18, 28 18, 24 14 C20 18, 12 18, 4 12 Z"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M12 12 C20 10, 28 10, 36 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="footer__doodle hidden md:block"
        style={{ position: 'absolute', top: '0.8rem', left: '46%', zIndex: 12, pointerEvents: 'none' }}
      >
        <svg width="60" height="35" viewBox="0 0 60 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 28 L15 10 L28 20 L40 6 L52 28 Z"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Torn Paper background mask */}
      <picture className="footer__bg">
        <source media="(min-width: 1024px)" srcSet="/images/footer_bg_desk.webp" type="image/webp" />
        <source media="(min-width: 768px)" srcSet="/images/footer_bg_tablet.webp" type="image/webp" />
        <img src="/images/img_166.webp" alt="" />
      </picture>

      {/* Model Cutout (ELVAREN Model) */}
      <picture className="footer__img" style={{ pointerEvents: 'none' }}>
        <img src="/images/footer_model.png" alt="ELVAREN Model" />
      </picture>

      {/* DISCOUNT 10% Torn Paper Badge - Interactive Hover Controlled Lottie */}
      <div
        className="footer__discount"
        onClick={() => setIsNewsletterOpen(true)}
        onMouseEnter={handleDiscountMouseEnter}
        onMouseLeave={handleDiscountMouseLeave}
        style={{
          cursor: 'pointer',
          zIndex: 35,
        }}
        title="Get 10% Discount"
      >
        <div
          ref={discountLottieRef}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        />
        <button
          type="button"
          aria-label="Get 10% Discount"
          onFocus={handleDiscountMouseEnter}
          onBlur={handleDiscountMouseLeave}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            opacity: 0,
          }}
        />
      </div>

      <div className="container" style={{ position: 'relative' }}>
        {/* Top Navigation Links */}
        <div className="footer__top">
          <ul className="footer__nav">
            <li>
              <MarkerButton
                text="Shop all"
                cloneLastChar
                href="/products"
                fontSize="1.3rem"
              />
            </li>
            <li>
              <MarkerButton
                text="Categories"
                cloneLastChar
                href="/#categories"
                onClick={(e) => handleAnchorClick(e, 'categories')}
                fontSize="1.3rem"
              />
            </li>
            <li>
              <MarkerButton
                text="Who we are"
                cloneLastChar
                href="/#bold"
                onClick={(e) => handleAnchorClick(e, 'bold')}
                fontSize="1.3rem"
              />
            </li>
            <li>
              <MarkerButton
                text="Campaign"
                cloneLastChar
                href="/#campaign"
                onClick={(e) => handleAnchorClick(e, 'campaign')}
                fontSize="1.3rem"
              />
            </li>
            <li>
              <MarkerButton
                text="Contact"
                cloneLastChar
                href="#footer"
                onClick={(e) => handleAnchorClick(e, 'footer')}
                fontSize="1.3rem"
              />
            </li>
            <li>
              <MarkerButton
                text="Collections"
                cloneLastChar
                href="/collections"
                fontSize="1.3rem"
              />
            </li>
            <li>
              <MarkerButton
                text="Sale"
                cloneLastChar
                href="/products?category=SALE"
                fontSize="1.3rem"
              />
            </li>
            <li>
              <MarkerButton
                text="5-ht"
                disabled
                fontSize="1.3rem"
              />
            </li>
          </ul>

          <ul className="footer__nav">
            <li>
              <MarkerButton
                text="Return"
                cloneLastChar
                onClick={handleComingSoon}
                fontSize="1.3rem"
              />
            </li>
            <li>
              <MarkerButton
                text="Impressum"
                cloneLastChar
                onClick={handleComingSoon}
                fontSize="1.3rem"
              />
            </li>
            <li>
              <MarkerButton
                text="Shipping and Payment"
                cloneLastChar
                onClick={handleComingSoon}
                fontSize="1.3rem"
              />
            </li>
            <li>
              <MarkerButton
                text="FAQ"
                cloneLastChar
                onClick={handleComingSoon}
                fontSize="1.3rem"
              />
            </li>
          </ul>
        </div>

        {/* Mid Section: Logo, Title, and Form */}
        <div className="footer__mid">
          <Link href="/" className="footer__logo">
            <img
              src="/images/elvaren-logo-white.png"
              alt="ELVAREN"
              className="footer__logo-img"
            />
          </Link>

          <p className="footer__title">
            Subscribe <span><strong>(</strong>latest news<strong>)</strong></span>
          </p>

          <form className="footer__form" onSubmit={handleSubmit} noValidate>
            <label className="footer__label input">
              <span className="input__label">Email</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL"
                required
              />
            </label>
            <button type="submit" className="footer__submit">
              <span aria-hidden="true" />
              <span>{submitted ? 'THANK YOU' : 'Subscribe'}</span>
            </button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <div>©2026_ELVAREN</div>

          <MarkerButton
            text="PRIVACY POLICY (DSGVO)"
            cloneLastChar
            onClick={handleComingSoon}
            fontSize="1.3rem"
          />

          <MarkerButton
            text="Credits"
            cloneLastChar
            onClick={onOpenCredits}
            fontSize="1.3rem"
          />

          <MarkerButton
            text="IG"
            cloneLastChar
            href="https://www.instagram.com/elvaren_official/"
            target="_blank"
            rel="noopener noreferrer"
            fontSize="1.3rem"
          />
        </div>
      </div>
    </footer>
  );
}
