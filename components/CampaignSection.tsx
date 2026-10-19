'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CampaignSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
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
    const ctx = gsap.context(() => {
      // Text line reveal animation matching We() in main.js
      gsap.fromTo(
        '.campaign-section__title .line, .campaign-section__lang, .campaign-section__size',
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.campaign-section',
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        '.campaign-section__subtitle, .campaign-section__text',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.campaign-section',
            start: 'top 75%',
          },
        }
      );

    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="campaign-section" id="campaign">
      <div className="campaign-section__content">
        <div className="campaign-section__bg" style={{ overflow: 'hidden' }}>
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              transform: 'none',
              display: 'block',
            }}
          >
            {shouldLoad && <source src="/videos/campaign_model.mp4" type="video/mp4" />}
          </video>
        </div>

        <h2 className="campaign-section__title h2" line-wrap-split="">
          <div className="line-wrap" style={{ overflow: 'hidden' }}>
            <span className="line" style={{ display: 'block' }}>
              03. Campaign
            </span>
          </div>
        </h2>

        <p className="campaign-section__text">
          Straight <strong>masculine </strong>design is all you need for an elegant, <strong>ultra-feminine</strong> look.
        </p>

        <div className="campaign-section__subtitle">
          <span>NEW</span>
          <span>
            <strong>(</strong>
            DRESSES
            <strong>)</strong>
          </span>
        </div>

        <p className="campaign-section__lang">(UA)</p>
        <p className="campaign-section__size">(SS_“25)</p>
      </div>
    </section>
  );
}
