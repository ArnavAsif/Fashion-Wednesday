'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CampaignSection() {
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

      // Subtle video scale parallax
      gsap.fromTo(
        '.campaign-section__bg video',
        { scale: 1.25 },
        {
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: '.campaign-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="campaign-section" id="campaign">
      <div className="campaign-section__content">
        <div className="campaign-section__bg">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/videos/nastia.mp4" type="video/mp4" />
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
