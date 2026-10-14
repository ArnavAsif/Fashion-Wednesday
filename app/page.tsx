'use client';

import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ArrivalsSection from '@/components/ArrivalsSection';
import CampaignSection from '@/components/CampaignSection';
import CategoriesSection from '@/components/CategoriesSection';
import BestSection from '@/components/BestSection';
import BoldSection from '@/components/BoldSection';
import MotionSection from '@/components/MotionSection';
import FooterSection from '@/components/FooterSection';
import CartDrawer from '@/components/CartDrawer';
import SearchModal from '@/components/SearchModal';
import MenuModal from '@/components/MenuModal';
import NewsletterModal from '@/components/NewsletterModal';
import CreditsModal from '@/components/CreditsModal';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [creditsOpen, setCreditsOpen] = useState(false);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    (window as any).__lenis = lenis;

    lenis.on('scroll', () => {
      ScrollTrigger.update();
      window.dispatchEvent(new Event('scroll'));
    });

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="site-wrapper" style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'clip' }}>
      <Header />

      <main className="main">
        <HeroSection />
        <ArrivalsSection />
        <CampaignSection />
        <CategoriesSection />
        <BestSection />
        <BoldSection />
        <MotionSection />
      </main>

      <FooterSection onOpenCredits={() => setCreditsOpen(true)} />

      {/* Interactive Drawers & Overlays */}
      <CartDrawer />
      <SearchModal />
      <MenuModal />
      <NewsletterModal />
      <CreditsModal isOpen={creditsOpen} onClose={() => setCreditsOpen(false)} />
    </div>
  );
}
