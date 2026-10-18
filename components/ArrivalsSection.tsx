'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '@/lib/cartContext';
import MarkerButton from '@/components/MarkerButton';
import Swiper from 'swiper';
import 'swiper/css';

gsap.registerPlugin(ScrollTrigger);

export interface ArrivalItem {
  id: number;
  title: string;
  price: string;
  rawPrice: number;
  collection: 'life force' | 'berlin' | 'new drop' | string;
  bestseller: boolean;
  sizes: string[];
  colorSwatch: string;
  href: string;
  images: {
    col1: [string, string];
    col2: [string, string];
    col3: [string, string];
  };
  video?: string;
}

export const ARRIVAL_PRODUCTS: ArrivalItem[] = [
  {
    id: 3,
    title: 'ELVAREN SIGNATURE LEATHER CORSET',
    price: '265,00_€',
    rawPrice: 265,
    collection: 'berlin',
    bestseller: true,
    sizes: ['S', 'M', 'L'],
    colorSwatch: '#111111',
    href: '/products/elvaren-signature-leather-lace-up-corset/',
    images: {
      col1: ['/images/products/product-3/image_01.jpg', '/images/products/product-3/image_02.jpg'],
      col2: ['/images/products/product-3/image_03.jpg', '/images/products/product-3/image_04.jpg'],
      col3: ['/images/products/product-3/image_05.jpg', '/images/products/product-3/image_06.jpg'],
    },
    video: undefined,
  },
  {
    id: 1,
    title: 'ERROR 404 STREETWEAR ZIP HOODIE',
    price: '180,00_€',
    rawPrice: 180,
    collection: 'new drop',
    bestseller: true,
    sizes: ['S', 'M', 'L'],
    colorSwatch: '#1a1a1a',
    href: '/products/error-404-streetwear-zip-hoodie/',
    images: {
      col1: ['/images/products/product-1/image_01.jpg', '/images/products/product-1/image_02.jpg'],
      col2: ['/images/products/product-1/image_03.jpg', '/images/products/product-1/image_04.jpg'],
      col3: ['/images/products/product-1/image_05.jpg', '/images/products/product-1/image_01.jpg'],
    },
    video: undefined,
  },
  {
    id: 6,
    title: 'WHITE HIGH-NECK CORSET BODYSUIT',
    price: '165,00_€',
    rawPrice: 165,
    collection: 'life force',
    bestseller: true,
    sizes: ['S', 'M', 'L'],
    colorSwatch: '#f5f5f5',
    href: '/products/white-high-neck-corset-bodysuit/',
    images: {
      col1: ['/images/products/product-6/image_01.jpg', '/images/products/product-6/image_02.jpg'],
      col2: ['/images/products/product-6/image_03.jpg', '/images/products/product-6/image_04.jpg'],
      col3: ['/images/products/product-6/image_05.jpg', '/images/products/product-6/image_06.jpg'],
    },
    video: undefined,
  },
  {
    id: 5,
    title: 'WASHED DISTRESSED DENIM JACKET',
    price: '320,00_€',
    rawPrice: 320,
    collection: 'berlin',
    bestseller: true,
    sizes: ['S', 'M', 'L'],
    colorSwatch: '#3a4b60',
    href: '/products/washed-distressed-denim-jacket-gothic-cross/',
    images: {
      col1: ['/images/products/product-5/image_01.jpg', '/images/products/product-5/image_02.jpg'],
      col2: ['/images/products/product-5/image_03.jpg', '/images/products/product-5/image_04.jpg'],
      col3: ['/images/products/product-5/image_05.jpg', '/images/products/product-5/image_06.jpg'],
    },
    video: undefined,
  },
  {
    id: 8,
    title: 'ANGEL BODYSUIT & FUR SHRUG SET',
    price: '195,00_€',
    rawPrice: 195,
    collection: 'life force',
    bestseller: true,
    sizes: ['S', 'M', 'L'],
    colorSwatch: '#ffffff',
    href: '/products/angel-graphic-bodysuit-fur-shrug-set/',
    images: {
      col1: ['/images/products/product-8/image_01.jpg', '/images/products/product-8/image_02.jpg'],
      col2: ['/images/products/product-8/image_03.jpg', '/images/products/product-8/image_04.jpg'],
      col3: ['/images/products/product-8/image_05.jpg', '/images/products/product-8/image_06.jpg'],
    },
    video: undefined,
  },
  {
    id: 18,
    title: 'GOTHIC CHAIN-LINK HALTER MAXI DRESS',
    price: '280,00_€',
    rawPrice: 280,
    collection: 'life force',
    bestseller: true,
    sizes: ['S', 'M', 'L'],
    colorSwatch: '#0a0a0a',
    href: '/products/gothic-chain-link-cutout-halter-maxi-dress/',
    images: {
      col1: ['/images/products/product-18/image_01.jpg', '/images/products/product-18/image_02.jpg'],
      col2: ['/images/products/product-18/image_03.jpg', '/images/products/product-18/image_04.jpg'],
      col3: ['/images/products/product-18/image_05.jpg', '/images/products/product-18/image_06.jpg'],
    },
    video: undefined,
  },
  {
    id: 15,
    title: 'SATIN VARSITY BOMBER JACKET',
    price: '345,00_€',
    rawPrice: 345,
    collection: 'berlin',
    bestseller: true,
    sizes: ['S', 'M', 'L'],
    colorSwatch: '#1e1e1e',
    href: '/products/satin-varsity-bomber-jacket-with-8-ball-patches/',
    images: {
      col1: ['/images/products/product-15/image_01.jpg', '/images/products/product-15/image_02.jpg'],
      col2: ['/images/products/product-15/image_03.jpg', '/images/products/product-15/image_04.jpg'],
      col3: ['/images/products/product-15/image_05.jpg', '/images/products/product-15/image_06.jpg'],
    },
    video: undefined,
  },
  {
    id: 23,
    title: 'HEAVY METAL STUDDED MOTO BIKER JACKET',
    price: '420,00_€',
    rawPrice: 420,
    collection: 'berlin',
    bestseller: true,
    sizes: ['S', 'M', 'L'],
    colorSwatch: '#181818',
    href: '/products/heavy-metal-studded-moto-biker-jacket/',
    images: {
      col1: ['/images/products/product-23/image_01.jpg', '/images/products/product-23/image_02.jpg'],
      col2: ['/images/products/product-23/image_03.jpg', '/images/products/product-23/image_04.jpg'],
      col3: ['/images/products/product-23/image_05.jpg', '/images/products/product-23/image_06.jpg'],
    },
    video: undefined,
  },
  {
    id: 16,
    title: 'STRAPLESS RAW-HEM DENIM CORSET',
    price: '185,00_€',
    rawPrice: 185,
    collection: 'berlin',
    bestseller: false,
    sizes: ['S', 'M', 'L'],
    colorSwatch: '#2b3e58',
    href: '/products/strapless-raw-hem-denim-corset-tube-top/',
    images: {
      col1: ['/images/products/product-16/image_01.jpg', '/images/products/product-16/image_02.jpg'],
      col2: ['/images/products/product-16/image_03.jpg', '/images/products/product-16/image_04.jpg'],
      col3: ['/images/products/product-16/image_05.jpg', '/images/products/product-16/image_01.jpg'],
    },
    video: undefined,
  },
  {
    id: 40,
    title: 'SCULPTED METAL HARDWARE CORSET TOP',
    price: '295,00_€',
    rawPrice: 295,
    collection: 'berlin',
    bestseller: false,
    sizes: ['S', 'M', 'L'],
    colorSwatch: '#222222',
    href: '/products/sculpted-metal-hardware-zip-up-corset-top/',
    images: {
      col1: ['/images/products/product-40/image_01.jpg', '/images/products/product-40/image_02.jpg'],
      col2: ['/images/products/product-40/image_03.jpg', '/images/products/product-40/image_04.jpg'],
      col3: ['/images/products/product-40/image_05.jpg', '/images/products/product-40/image_06.jpg'],
    },
    video: undefined,
  },
];

export default function ArrivalsSection() {
  const { addToCart } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [slideDir, setSlideDir] = useState<'next' | 'prev'>('next');
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [addedItem, setAddedItem] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  const isHoveredRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Drag interaction refs
  const groupRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

  // Video refs for center column
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const total = ARRIVAL_PRODUCTS.length;

  // Mobile Swiper & progress refs
  const mobileSwiperRef = useRef<HTMLDivElement>(null);
  const swiperInstanceRef = useRef<Swiper | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileFillRef = useRef<HTMLDivElement>(null);

  // Initialize Swiper for mobile (< 1024px) matching serotoninn.com exact physics
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateMobileProgress = (w: Swiper) => {
      const totalSlides = w.slides ? w.slides.length : 0;
      if (!totalSlides || !mobileScrollRef.current || !mobileFillRef.current) return;

      const maxTranslate = Math.abs(w.maxTranslate());
      const currentTranslate = Math.abs(w.translate);
      const progress = maxTranslate === 0 ? 0 : Math.min(1, Math.max(0, currentTranslate / maxTranslate));

      const trackWidth = mobileScrollRef.current.clientWidth;
      const fillWidth = mobileFillRef.current.offsetWidth;
      const maxTravel = Math.max(0, trackWidth - fillWidth);
      const translateX = progress * maxTravel;

      mobileFillRef.current.style.transform = `translate3d(${translateX}px, 0, 0)`;
    };

    const setupSwiper = () => {
      if (window.innerWidth >= 1024) {
        if (swiperInstanceRef.current) {
          swiperInstanceRef.current.destroy(true, true);
          swiperInstanceRef.current = null;
        }
        return;
      }

      if (mobileSwiperRef.current && !swiperInstanceRef.current) {
        const swiper = new Swiper(mobileSwiperRef.current, {
          slidesPerView: 1.2,
          spaceBetween: 10,
          loop: false,
          threshold: 4,
          touchStartPreventDefault: false,
          preventClicks: true,
          preventClicksPropagation: true,
          slideToClickedSlide: false,
          grabCursor: true,
          resistanceRatio: 0.85,
          on: {
            init(w) {
              updateMobileProgress(w);
              setActiveIndex(w.activeIndex || 0);
            },
            setTranslate(w) {
              updateMobileProgress(w);
            },
            slideChange(w) {
              setActiveIndex(w.activeIndex || 0);
            },
          },
        });

        swiperInstanceRef.current = swiper;
      }
    };

    setupSwiper();

    const handleResize = () => {
      setupSwiper();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(true, true);
        swiperInstanceRef.current = null;
      }
    };
  }, [total]);

  // Navigate to slide using functional state updates to eliminate stale closures
  const goToSlide = useCallback((newIdx: number, dir: 'next' | 'prev') => {
    setActiveIndex(prev => {
      if (prev === newIdx) return prev;
      setPrevIndex(prev);
      setSlideDir(dir);
      return newIdx;
    });
    if (swiperInstanceRef.current) {
      swiperInstanceRef.current.slideTo(newIdx);
    }
  }, []);

  const handleMobileProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!swiperInstanceRef.current || !mobileScrollRef.current) return;
    const rect = mobileScrollRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.min(1, Math.max(0, clickX / rect.width));
    const targetIdx = Math.min(total - 1, Math.max(0, Math.round(ratio * (total - 1))));
    swiperInstanceRef.current.slideTo(targetIdx);
  };

  const handleDesktopProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    const targetIdx = Math.min(total - 1, Math.max(0, Math.floor(ratio * total)));
    goToSlide(targetIdx, targetIdx > activeIndex ? 'next' : 'prev');
  };

  const goNext = useCallback(() => {
    setActiveIndex(prev => {
      const nextIdx = (prev + 1) % total;
      setPrevIndex(prev);
      setSlideDir('next');
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.slideTo(nextIdx);
      }
      return nextIdx;
    });
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIndex(prev => {
      const prevIdx = (prev - 1 + total) % total;
      setPrevIndex(prev);
      setSlideDir('prev');
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.slideTo(prevIdx);
      }
      return prevIdx;
    });
  }, [total]);

  // Display different initial product based on current time
  useEffect(() => {
    const currentMinute = Math.floor(Date.now() / 60000);
    const startIdx = currentMinute % total;
    if (startIdx !== 0) {
      setActiveIndex(startIdx);
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.slideTo(startIdx, 0);
      }
    }
  }, [total]);

  // Periodic automatic rotation to showcase different products over time (pauses on hover or dragging)
  useEffect(() => {
    const el = sectionRef.current;
    if (el) {
      const onEnter = () => {
        isHoveredRef.current = true;
        setIsSectionHovered(true);
      };
      const onLeave = (e?: MouseEvent | PointerEvent) => {
        if (e && (e as any).relatedTarget && el.contains((e as any).relatedTarget as Node)) {
          return;
        }
        isHoveredRef.current = false;
        setIsSectionHovered(false);
      };
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointerleave', onLeave);
      el.addEventListener('mouseover', onEnter);
      el.addEventListener('mouseout', onLeave as EventListener);
      return () => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointerleave', onLeave);
        el.removeEventListener('mouseover', onEnter);
        el.removeEventListener('mouseout', onLeave as EventListener);
      };
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHoveredRef.current && !isDraggingRef.current && !hasMovedRef.current) {
        goNext();
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [goNext]);

  // Video playback management on activeIndex change
  useEffect(() => {
    videoRefs.current.forEach((v, idx) => {
      if (!v) return;
      if (idx === activeIndex) {
        try {
          v.currentTime = 0;
          v.play().catch(() => {});
        } catch (_) {}
      } else {
        try {
          v.pause();
        } catch (_) {}
      }
    });
  }, [activeIndex]);

  // Entrance scroll trigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.arrivals-section__title, .arrivals-section__lang, .arrivals-section__button, .arrivals-section__scroll',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.arrivals-section',
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Keyboard navigation & wheel gesture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Robust pointer & mouse drag on group element + custom event
  useEffect(() => {
    const groupEl = groupRef.current;
    if (!groupEl) return;

    let startX = 0;
    let startY = 0;
    let isDown = false;
    let hasMoved = false;

    const onStart = (clientX: number, clientY: number) => {
      startX = clientX;
      startY = clientY;
      isDown = true;
      hasMoved = false;
      hasMovedRef.current = false;
    };

    const onMove = (clientX: number, clientY: number) => {
      if (!isDown) return;
      const dx = clientX - startX;
      const dy = clientY - startY;

      if (!hasMoved && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
        hasMoved = true;
        hasMovedRef.current = true;
        if (dx < 0) goNext();
        else goPrev();
      }
    };

    const onEnd = () => {
      if (!isDown) return;
      isDown = false;
      setTimeout(() => {
        hasMovedRef.current = false;
      }, 300);
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      onStart(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: PointerEvent) => {
      onMove(e.clientX, e.clientY);
    };

    const handlePointerUp = (e: PointerEvent) => {
      onEnd();
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      onStart(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      onMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      onEnd();
    };

    const handleCustomNext = () => goNext();
    const handleCustomPrev = () => goPrev();

    groupEl.addEventListener('pointerdown', handlePointerDown, { capture: true });
    groupEl.addEventListener('pointermove', handlePointerMove, { capture: true });
    groupEl.addEventListener('pointerup', handlePointerUp, { capture: true });
    groupEl.addEventListener('pointercancel', handlePointerUp, { capture: true });

    groupEl.addEventListener('mousedown', handleMouseDown, { capture: true });
    window.addEventListener('mousemove', handleMouseMove, { capture: true });
    window.addEventListener('mouseup', handleMouseUp, { capture: true });

    window.addEventListener('arrivals:next', handleCustomNext);
    window.addEventListener('arrivals:prev', handleCustomPrev);

    return () => {
      groupEl.removeEventListener('pointerdown', handlePointerDown, { capture: true });
      groupEl.removeEventListener('pointermove', handlePointerMove, { capture: true });
      groupEl.removeEventListener('pointerup', handlePointerUp, { capture: true });
      groupEl.removeEventListener('pointercancel', handlePointerUp, { capture: true });

      groupEl.removeEventListener('mousedown', handleMouseDown, { capture: true });
      window.removeEventListener('mousemove', handleMouseMove, { capture: true });
      window.removeEventListener('mouseup', handleMouseUp, { capture: true });

      window.removeEventListener('arrivals:next', handleCustomNext);
      window.removeEventListener('arrivals:prev', handleCustomPrev);
    };
  }, [goNext, goPrev]);

  // 3D Card Hover flip interaction
  const handleCardMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (window.innerWidth <= 1024) return;
    const cardEl = e.currentTarget;
    const img1 = cardEl.querySelector('.card-hover-img-1') as HTMLElement;
    const img2 = cardEl.querySelector('.card-hover-img-2') as HTMLElement;
    if (!img1 || !img2) return;

    const tl = gsap.timeline();
    tl.to(img1, { scaleX: 0, transformOrigin: 'left center', duration: 0.35, ease: 'power2.inOut' }, 0)
      .to(img2, { scaleX: 1, opacity: 1, transformOrigin: 'right center', duration: 0.35, ease: 'power2.inOut' }, 0)
      .to(img2, { scaleX: 0, transformOrigin: 'left center', duration: 0.3, ease: 'power2.inOut' }, 0.35)
      .to(img1, { scaleX: 1, transformOrigin: 'right center', duration: 0.3, ease: 'power2.inOut' }, 0.35)
      .set(img2, { opacity: 0 });
  };

  const handleSizeClick = (e: React.MouseEvent, item: ArrivalItem, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSizes(prev => ({ ...prev, [item.id]: size }));
    addToCart({
      id: item.id,
      title: `${item.title} (${size})`,
      price: item.rawPrice,
      quantity: 1,
      size: [size],
      color: [item.colorSwatch],
      images: [[item.images.col1[0]]],
      href: item.href,
      bestseller: item.bestseller,
      createdAt: new Date().toISOString(),
    });
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  const handleCardClick = (e: React.MouseEvent, href: string) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  };

  const currentItem = ARRIVAL_PRODUCTS[activeIndex] || ARRIVAL_PRODUCTS[0];

  // Helper to render product card inside a column
  const renderCard = (
    item: ArrivalItem,
    idx: number,
    columnKey: 'col1' | 'col2' | 'col3',
    isCenterCol = false
  ) => {
    const isActive = idx === activeIndex;
    const isPrev = idx === prevIndex;
    const [imgMain, imgHover] = item.images[columnKey];
    const isAdded = addedItem === item.id;

    let liClass = '';
    if (isActive) liClass = 'active';
    else if (isPrev) liClass = slideDir === 'next' ? 'prev' : 'next';

    return (
      <li
        key={item.id}
        className={liClass}
        data-dir={isActive ? slideDir : undefined}
      >
        <Link
          href={item.href}
          className="arrivals-card"
          onClick={(e) => handleCardClick(e, item.href)}
          onMouseEnter={handleCardMouseEnter}
        >
          {item.bestseller && (
            <div className="arrivals-card__best">
              Best seller
            </div>
          )}

          <div className="arrivals-card__inner">
            <div className="arrivals-card__img-wrapper">
              {/* Primary Image */}
              <picture className="arrivals-card__img card-hover-img-1" style={{ zIndex: 1 }}>
                <img
                  src={imgMain}
                  alt={item.title}
                  draggable={false}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </picture>

              {/* Hover Alternate Image */}
              <picture
                className="arrivals-card__img card-hover-img-2"
                style={{
                  zIndex: 2,
                  opacity: 0,
                  transform: 'scaleX(0)',
                  transformOrigin: 'right center',
                }}
              >
                <img
                  src={imgHover}
                  alt={`${item.title} detail`}
                  draggable={false}
                  loading="lazy"
                />
              </picture>

              {/* Video in Center Column */}
              {isCenterCol && item.video && (
                <video
                  ref={el => { videoRefs.current[idx] = el; }}
                  className="arrivals-card__video"
                  src={item.video}
                  muted
                  loop
                  playsInline
                  autoPlay={isActive}
                  style={{
                    display: isActive ? 'block' : 'none',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>
          </div>

          {/* Card Info with 3D Flip to Sizes on Hover */}
          <div className="arrivals-card__info">
            {/* Top State: Title & Price */}
            <div className="arrivals-card__top">
              <h3 className="arrivals-card__title">{item.title}</h3>
              <div className="arrivals-card__prices">
                <p className="arrivals-card__price">{item.price}</p>
              </div>
            </div>

            {/* Bottom Hover State: Size Selector & Color Swatch */}
            <div className="arrivals-card__bottom">
              <ul className="arrivals-card__size">
                {isAdded ? (
                  <li style={{ fontSize: '1.4rem', color: '#ed3833' }}>
                    <strong>[</strong> ADDED TO BAG <strong>]</strong>
                  </li>
                ) : (
                  item.sizes.map(size => (
                    <li
                      key={size}
                      onClick={e => handleSizeClick(e, item, size)}
                      title={`Select ${size} and add to bag`}
                    >
                      <strong>(</strong>{size}<strong>)</strong>
                    </li>
                  ))
                )}
              </ul>

              <ul className="arrivals-card__color">
                <li>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '50%',
                      backgroundColor: item.colorSwatch,
                      border: '1px solid rgba(0,0,0,0.15)',
                    }}
                  />
                </li>
              </ul>
            </div>
          </div>
        </Link>
      </li>
    );
  };

  // Scroll fill percentage (1 out of total segments)
  const fillWidthPercent = (1 / total) * 100;
  const fillTranslatePercent = activeIndex * 100;

  return (
    <section
      ref={sectionRef}
      className="arrivals-section"
      id="arrivals"
      onMouseEnter={() => {
        isHoveredRef.current = true;
        setIsSectionHovered(true);
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        setIsSectionHovered(false);
      }}
    >
      <div className="container">
        {/* Header: Section Title and Collection Drop Indicator */}
        <div className="arrivals-section__header-row">
          <h2 className="arrivals-section__title h2">
            <span style={{ color: '#ed3833' }}>02.</span>{' '}
            <span style={{ color: '#000000' }}>NEW ARRIVALS</span>
          </h2>

          {/* Mobile single active collection indicator with 3D roll transition */}
          <ul className="arrivals-section__text arrivals-section__text--mobile">
            {ARRIVAL_PRODUCTS.map((prod, idx) => (
              <li
                key={idx}
                className={idx === activeIndex ? 'active' : ''}
              >
                ({prod.collection})
              </li>
            ))}
          </ul>

          {/* Desktop collection indicator */}
          <ul className="arrivals-section__text arrivals-section__text--desktop">
            <li className={currentItem.collection === 'life force' ? 'active' : ''}>
              <Link href="/collections/life-force" style={{ color: 'inherit', textDecoration: 'none' }}>
                (life force)
              </Link>
            </li>
            <li className={currentItem.collection === 'berlin' ? 'active' : ''}>
              <Link href="/collections/berlin" style={{ color: 'inherit', textDecoration: 'none' }}>
                (Berlin)
              </Link>
            </li>
            <li className={currentItem.collection === 'new drop' ? 'active' : ''}>
              <Link href="/collections" style={{ color: 'inherit', textDecoration: 'none' }}>
                (new drop)
              </Link>
            </li>
          </ul>
        </div>

        {/* Desktop See All Button (>= 1024px) */}
        <MarkerButton
          text="SEE ALL"
          brackets
          cloneLastChar
          href="/products"
          className="arrivals-section__button link arrivals-section__button--desktop"
        />

        {/* Region Tag */}
        <p className="arrivals-section__lang">(UA)</p>

        {/* 3-Column Synchronized Desktop Track */}
        <div
          ref={groupRef}
          className="arrivals-section__group"
          style={{ touchAction: 'pan-y' }}
        >
          {/* Column 1: Angle 1 (Front View) */}
          <ul className="arrivals-section__group-swiper one">
            {ARRIVAL_PRODUCTS.map((item, idx) => renderCard(item, idx, 'col1', false))}
          </ul>

          {/* Column 2: Angle 2 (Back View / Video / Detail) */}
          <ul className="arrivals-section__group-swiper two">
            {ARRIVAL_PRODUCTS.map((item, idx) => renderCard(item, idx, 'col2', true))}
          </ul>

          {/* Column 3: Angle 3 (Side View) */}
          <ul className="arrivals-section__group-swiper three">
            {ARRIVAL_PRODUCTS.map((item, idx) => renderCard(item, idx, 'col3', false))}
          </ul>
        </div>

        {/* Mobile Swipe Carousel (< 1024px) */}
        <div
          ref={mobileSwiperRef}
          className="arrivals-section__swiper-mob swiper"
        >
          <div className="swiper-wrapper">
            {ARRIVAL_PRODUCTS.map((item, idx) => (
              <div
                key={item.id}
                className="swiper-slide"
              >
                <Link
                  href={item.href}
                  className="arrivals-card"
                >
                  {item.bestseller && (
                    <div className="arrivals-card__best">
                      Best seller
                    </div>
                  )}

                  <div className="arrivals-card__inner">
                    <picture className="arrivals-card__img">
                      <img
                        src={item.images.col1[0]}
                        alt={item.title}
                        draggable={false}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                      />
                    </picture>
                    <img
                      className="arrivals-card__icon"
                      src="/images/plus_icon.svg"
                      alt=""
                    />
                  </div>

                  <div className="arrivals-card__info">
                    <div className="arrivals-card__top">
                      <h3 className="arrivals-card__title">
                        {item.title}
                      </h3>
                      <div className="arrivals-card__prices">
                        <p className="arrivals-card__price">
                          {item.price.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Scroll Progress Bar (>= 1024px) */}
        <div
          className="arrivals-section__scroll scroll arrivals-section__scroll--desktop"
          onClick={handleDesktopProgressBarClick}
        >
          <div
            className="arrivals-section__fill scroll__fill"
            style={{
              width: `${fillWidthPercent}%`,
              transform: `translate3d(${fillTranslatePercent}%, 0, 0)`,
            }}
          >
            <img src="/images/track_img.svg" alt="" />
          </div>
        </div>

        {/* Mobile Bottom Row (< 1024px): Progress Bar & [SEE ALL] Button */}
        <div className="arrivals-section__bottom-mob">
          <div
            ref={mobileScrollRef}
            className="arrivals-section__scroll scroll arrivals-section__scroll--mob"
            onClick={handleMobileProgressBarClick}
          >
            <div
              ref={mobileFillRef}
              className="arrivals-section__fill scroll__fill"
              style={{
                width: `${fillWidthPercent}%`,
              }}
            >
              <img src="/images/track_img.svg" alt="" />
            </div>
          </div>

          <MarkerButton
            text="SEE ALL"
            brackets
            cloneLastChar
            href="/products"
            className="arrivals-section__button-mob"
          />
        </div>
      </div>
    </section>
  );
}
