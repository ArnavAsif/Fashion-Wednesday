'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '@/lib/cartContext';

gsap.registerPlugin(ScrollTrigger);

export default function FooterSection({ onOpenCredits }: { onOpenCredits?: () => void }) {
  const { setIsNewsletterOpen } = useCart();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const discountLottieRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);
  const tweenRef = useRef<any>(null);
  const tweenObj = useRef({ frame: 58 });

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
        anim.addEventListener('DOMLoaded', () => {
          anim.goToAndStop(58, true);
        });
        anim.goToAndStop(58, true);
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const footer = document.querySelector('.footer');
      if (footer) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: footer,
            start: 'top 85%',
            once: true,
          },
        });

        tl.fromTo(
          '.footer__logo',
          { yPercent: 40, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1, ease: 'power3.out' },
          0
        );

        tl.fromTo(
          '.footer__img',
          { yPercent: 30, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
          0.1
        );

        tl.fromTo(
          '.footer__form',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
          0.2
        );

        tl.fromTo(
          '.footer__title',
          { scaleY: 0, transformOrigin: '50% 100%' },
          { scaleY: 1, duration: 0.8, ease: 'power3.out' },
          0.3
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3500);
      setEmail('');
    }
  };

  return (
    <footer className="footer" id="footer" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      {/* Torn paper top doodles (lips and crown from Screenshot 15) */}
      <div className="hidden md:block" style={{ position: 'absolute', top: '1.2rem', left: '26%', zIndex: 12, pointerEvents: 'none' }}>
        <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 12 C12 6, 20 6, 24 10 C28 6, 36 6, 44 12 C36 18, 28 18, 24 14 C20 18, 12 18, 4 12 Z" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M12 12 C20 10, 28 10, 36 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="hidden md:block" style={{ position: 'absolute', top: '0.8rem', left: '46%', zIndex: 12, pointerEvents: 'none' }}>
        <svg width="60" height="35" viewBox="0 0 60 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 28 L15 10 L28 20 L40 6 L52 28 Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>

      {/* Torn Paper background mask */}
      <picture className="footer__bg">
        <source media="(min-width: 1024px)" srcSet="/images/footer_bg_desk.webp" type="image/webp" />
        <source media="(min-width: 768px)" srcSet="/images/footer_bg_tablet.webp" type="image/webp" />
        <img src="/images/img_166.webp" alt="" />
      </picture>

      {/* Model Cutout (Blue backless dress) */}
      <picture className="footer__img" style={{ pointerEvents: 'none' }}>
        <img src="/images/img_167.webp" alt="Model" />
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

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Top Navigation Links */}
        <div className="footer__top">
          <ul className="footer__nav">
            <li>
              <a href="#arrivals">
                <span aria-hidden="true" />
                <span>Shop all</span>
              </a>
            </li>
            <li>
              <a href="#categories">
                <span aria-hidden="true" />
                <span>Categories</span>
              </a>
            </li>
            <li>
              <a href="#bold">
                <span aria-hidden="true" />
                <span>Who we are</span>
              </a>
            </li>
            <li>
              <a href="#campaign">
                <span aria-hidden="true" />
                <span>Campaign</span>
              </a>
            </li>
            <li>
              <a href="#footer">
                <span aria-hidden="true" />
                <span>Contact</span>
              </a>
            </li>
            <li>
              <a href="#arrivals">
                <span aria-hidden="true" />
                <span>Collections</span>
              </a>
            </li>
            <li>
              <a href="#arrivals">
                <span aria-hidden="true" />
                <span>Sale</span>
              </a>
            </li>
            <li>
              <a href="#" className="disable">
                <span aria-hidden="true" />
                <span>5-ht</span>
              </a>
            </li>
          </ul>

          <ul className="footer__nav">
            <li>
              <a href="#">
                <span aria-hidden="true" />
                <span>Return</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span aria-hidden="true" />
                <span>Impressum</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span aria-hidden="true" />
                <span>Shipping and Payment</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span aria-hidden="true" />
                <span>FAQ</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Mid Section: Logo, Title, and Form */}
        <div className="footer__mid">
          <a href="/" className="footer__logo">
            <img src="/images/img_168.svg" alt="SEROTONINN" />
          </a>

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
          <div>©2026_SEROTONINN</div>

          <a href="#">
            <span aria-hidden="true" />
            <span>PRIVACY POLICY (DSGVO)</span>
          </a>

          <button
            type="button"
            className="footer__dev"
            onClick={onOpenCredits}
            style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: 'inherit' }}
          >
            <span aria-hidden="true" />
            <span>Credits</span>
          </button>

          <a
            href="https://www.instagram.com/serotoninn_official/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span aria-hidden="true" />
            <span>IG</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
