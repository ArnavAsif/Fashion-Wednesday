'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/lib/cartContext';

export interface MenuItemProduct {
  title: string;
  href: string;
  image: string;
}

export interface CategoryData {
  name: string;
  count: string;
  video: string;
  poster: string;
  products: MenuItemProduct[];
  disabled?: boolean;
}

const DEFAULT_PRODUCTS: MenuItemProduct[] = [
  {
    title: 'Error 404 Streetwear Zip Hoodie',
    href: '/products/error-404-streetwear-zip-hoodie/',
    image: '/images/products/product-1/image_01.jpg',
  },
  {
    title: 'ELVAREN Signature Leather Lace-Up Corset',
    href: '/products/elvaren-signature-leather-lace-up-corset/',
    image: '/images/products/product-3/image_01.jpg',
  },
  {
    title: 'Washed Distressed Denim Jacket & Gothic Cross',
    href: '/products/washed-distressed-denim-jacket-gothic-cross/',
    image: '/images/products/product-5/image_01.jpg',
  },
  {
    title: 'Angel Graphic Bodysuit & Fur Shrug Set',
    href: '/products/angel-graphic-bodysuit-fur-shrug-set/',
    image: '/images/products/product-8/image_01.jpg',
  },
  {
    title: 'Gothic Chain-Link Cutout Halter Maxi Dress',
    href: '/products/gothic-chain-link-cutout-halter-maxi-dress/',
    image: '/images/products/product-18/image_01.jpg',
  },
];

const CATEGORIES_DATA: CategoryData[] = [
  {
    name: 'NEW DROP',
    count: '14',
    video: '/videos/menu/Create_fashion_aesthetic_video_1080p_20261017152019.mp4',
    poster: '/videos/menu/posters/Create_fashion_aesthetic_video_1080p_20261017152019.jpg',
    products: [
      {
        title: 'Error 404 Streetwear Zip Hoodie',
        href: '/products/error-404-streetwear-zip-hoodie/',
        image: '/images/products/product-1/image_01.jpg',
      },
      {
        title: 'Distressed Mohair Shrug & Silver Chain Top',
        href: '/products/distressed-mohair-shrug-silver-chain-top/',
        image: '/images/products/product-2/image_01.jpg',
      },
      {
        title: 'ELVAREN Signature Leather Lace-Up Corset',
        href: '/products/elvaren-signature-leather-lace-up-corset/',
        image: '/images/products/product-3/image_01.jpg',
      },
      {
        title: 'Saturn Orb Pendant Silver Chain Necklace',
        href: '/products/saturn-orb-pendant-silver-chain-necklace/',
        image: '/images/products/product-4/image_01.jpg',
      },
      {
        title: 'Washed Distressed Denim Jacket & Gothic Cross',
        href: '/products/washed-distressed-denim-jacket-gothic-cross/',
        image: '/images/products/product-5/image_01.jpg',
      },
    ],
  },
  {
    name: 'SALE',
    count: '17',
    video: '/videos/menu/Create_fashion_aesthetic_video_1080p_20261017155829.mp4',
    poster: '/videos/menu/posters/Create_fashion_aesthetic_video_1080p_20261017155829.jpg',
    products: [
      {
        title: 'Distressed Mohair Shrug & Silver Chain Top',
        href: '/products/distressed-mohair-shrug-silver-chain-top/',
        image: '/images/products/product-2/image_01.jpg',
      },
      {
        title: 'Saturn Orb Pendant Silver Chain Necklace',
        href: '/products/saturn-orb-pendant-silver-chain-necklace/',
        image: '/images/products/product-4/image_01.jpg',
      },
      {
        title: 'White High-Neck Corset Bodysuit',
        href: '/products/white-high-neck-corset-bodysuit/',
        image: '/images/products/product-6/image_01.jpg',
      },
      {
        title: 'Baby Pink Lace-Up Collared Zip Halter Top',
        href: '/products/baby-pink-lace-up-collared-zip-halter-top/',
        image: '/images/products/product-9/image_01.jpg',
      },
      {
        title: 'Rhinestone Cami Lace-Trim Silk Crop Top',
        href: '/products/rhinestone-cami-lace-trim-silk-crop-top/',
        image: '/images/products/product-11/image_01.jpg',
      },
    ],
  },
  {
    name: 'ACCESSORIES',
    count: '8',
    video: '/videos/menu/Make_fashion_aesthetic_video_1080p_20261017170042.mp4',
    poster: '/videos/menu/posters/Make_fashion_aesthetic_video_1080p_20261017170042.jpg',
    products: [
      {
        title: 'Saturn Orb Pendant Silver Chain Necklace',
        href: '/products/saturn-orb-pendant-silver-chain-necklace/',
        image: '/images/products/product-4/image_01.jpg',
      },
      {
        title: 'Y2K Celestial Star Hair Clip & Rings Set',
        href: '/products/y2k-celestial-star-hair-clip-rings-set/',
        image: '/images/products/product-10/image_01.jpg',
      },
      {
        title: 'Gothic Cross Charm Double Choker Necklace',
        href: '/products/gothic-cross-charm-double-choker-necklace/',
        image: '/images/products/product-27/image_01.jpg',
      },
      {
        title: 'Silver Spiked Chain Link Leather Belt',
        href: '/products/silver-spiked-chain-link-leather-belt/',
        image: '/images/products/product-30/image_01.jpg',
      },
      {
        title: 'Studded Leather Buckle Utility Platform Harness',
        href: '/products/studded-leather-buckle-utility-platform-harness/',
        image: '/images/products/product-35/image_01.jpg',
      },
    ],
  },
  {
    name: 'BODYS',
    count: '3',
    video: '/videos/menu/bodys.mp4',
    poster: '/videos/menu/posters/bodys.jpg',
    products: [
      {
        title: 'White High-Neck Corset Bodysuit',
        href: '/products/white-high-neck-corset-bodysuit/',
        image: '/images/products/product-6/image_01.jpg',
      },
      {
        title: 'Angel Graphic Bodysuit & Fur Shrug Set',
        href: '/products/angel-graphic-bodysuit-fur-shrug-set/',
        image: '/images/products/product-8/image_01.jpg',
      },
      {
        title: 'Faux Leather Structured Lace-Up Bustier',
        href: '/products/faux-leather-structured-lace-up-bustier/',
        image: '/images/products/product-7/image_01.jpg',
      },
      {
        title: 'Strapless Raw-Hem Denim Corset Tube Top',
        href: '/products/strapless-raw-hem-denim-corset-tube-top/',
        image: '/images/products/product-16/image_01.jpg',
      },
      {
        title: 'Ruched Sheer Mesh Bodycon Halter Dress',
        href: '/products/ruched-sheer-mesh-bodycon-halter-dress/',
        image: '/images/products/product-26/image_01.jpg',
      },
    ],
  },
  {
    name: 'COATS',
    count: '3',
    video: '/videos/menu/coats.mp4',
    poster: '/videos/menu/posters/coats.jpg',
    products: [
      {
        title: 'Washed Distressed Denim Jacket & Gothic Cross',
        href: '/products/washed-distressed-denim-jacket-gothic-cross/',
        image: '/images/products/product-5/image_01.jpg',
      },
      {
        title: 'Satin Varsity Bomber Jacket with 8-Ball Patches',
        href: '/products/satin-varsity-bomber-jacket-with-8-ball-patches/',
        image: '/images/products/product-15/image_01.jpg',
      },
      {
        title: 'Heavy Metal Studded Moto Biker Jacket',
        href: '/products/heavy-metal-studded-moto-biker-jacket/',
        image: '/images/products/product-23/image_01.jpg',
      },
      {
        title: 'Heavyweight Boxy Leather Racing Jacket',
        href: '/products/heavyweight-boxy-leather-racing-jacket/',
        image: '/images/products/product-37/image_01.jpg',
      },
      {
        title: 'Vintage Wash Oversized Denim Trucker Jacket',
        href: '/products/vintage-wash-oversized-denim-trucker-jacket/',
        image: '/images/products/product-43/image_01.jpg',
      },
    ],
  },
  {
    name: 'CORSETS',
    count: '8',
    video: '/videos/menu/Make_fashion_aesthetic_video_1080p_20261017165300.mp4',
    poster: '/videos/menu/posters/Make_fashion_aesthetic_video_1080p_20261017165300.jpg',
    products: [
      {
        title: 'ELVAREN Signature Leather Lace-Up Corset',
        href: '/products/elvaren-signature-leather-lace-up-corset/',
        image: '/images/products/product-3/image_01.jpg',
      },
      {
        title: 'White High-Neck Corset Bodysuit',
        href: '/products/white-high-neck-corset-bodysuit/',
        image: '/images/products/product-6/image_01.jpg',
      },
      {
        title: 'Faux Leather Structured Lace-Up Bustier',
        href: '/products/faux-leather-structured-lace-up-bustier/',
        image: '/images/products/product-7/image_01.jpg',
      },
      {
        title: 'Strapless Raw-Hem Denim Corset Tube Top',
        href: '/products/strapless-raw-hem-denim-corset-tube-top/',
        image: '/images/products/product-16/image_01.jpg',
      },
      {
        title: 'Sculpted Metal Hardware Zip-Up Corset Top',
        href: '/products/sculpted-metal-hardware-zip-up-corset-top/',
        image: '/images/products/product-40/image_01.jpg',
      },
    ],
  },
  {
    name: 'DRESSES',
    count: '8',
    video: '/videos/menu/Make_fashion_aesthetic_video_1080p_20261017153802.mp4',
    poster: '/videos/menu/posters/Make_fashion_aesthetic_video_1080p_20261017153802.jpg',
    products: [
      {
        title: 'Gothic Chain-Link Cutout Halter Maxi Dress',
        href: '/products/gothic-chain-link-cutout-halter-maxi-dress/',
        image: '/images/products/product-18/image_01.jpg',
      },
      {
        title: 'Minimalist Ribbed Knit Micro Tube Dress',
        href: '/products/minimalist-ribbed-knit-micro-tube-dress/',
        image: '/images/products/product-19/image_01.jpg',
      },
      {
        title: 'Distressed Open-Knit Spiderweb Maxi Dress',
        href: '/products/distressed-open-knit-spiderweb-maxi-dress/',
        image: '/images/products/product-24/image_01.jpg',
      },
      {
        title: 'Ruched Sheer Mesh Bodycon Halter Dress',
        href: '/products/ruched-sheer-mesh-bodycon-halter-dress/',
        image: '/images/products/product-26/image_01.jpg',
      },
      {
        title: 'Draped Asymmetric Cowl Neck Evening Dress',
        href: '/products/draped-asymmetric-cowl-neck-evening-dress/',
        image: '/images/products/product-41/image_01.jpg',
      },
    ],
  },
  {
    name: 'JACKETS',
    count: '5',
    video: '/videos/menu/Make_fashion_aesthetic_video_1080p_20261017161845.mp4',
    poster: '/videos/menu/posters/Make_fashion_aesthetic_video_1080p_20261017161845.jpg',
    products: [
      {
        title: 'Washed Distressed Denim Jacket & Gothic Cross',
        href: '/products/washed-distressed-denim-jacket-gothic-cross/',
        image: '/images/products/product-5/image_01.jpg',
      },
      {
        title: 'Satin Varsity Bomber Jacket with 8-Ball Patches',
        href: '/products/satin-varsity-bomber-jacket-with-8-ball-patches/',
        image: '/images/products/product-15/image_01.jpg',
      },
      {
        title: 'Heavy Metal Studded Moto Biker Jacket',
        href: '/products/heavy-metal-studded-moto-biker-jacket/',
        image: '/images/products/product-23/image_01.jpg',
      },
      {
        title: 'Heavyweight Boxy Leather Racing Jacket',
        href: '/products/heavyweight-boxy-leather-racing-jacket/',
        image: '/images/products/product-37/image_01.jpg',
      },
      {
        title: 'Vintage Wash Oversized Denim Trucker Jacket',
        href: '/products/vintage-wash-oversized-denim-trucker-jacket/',
        image: '/images/products/product-43/image_01.jpg',
      },
    ],
  },
  {
    name: 'PANTS',
    count: '6',
    video: '/videos/menu/Make_fashion_aesthetic_video_1080p_20261017155924.mp4',
    poster: '/videos/menu/posters/Make_fashion_aesthetic_video_1080p_20261017155924.jpg',
    products: [
      {
        title: 'Asymmetric Off-Shoulder Top & Eyelet Shorts',
        href: '/products/asymmetric-off-shoulder-top-eyelet-shorts/',
        image: '/images/products/product-13/image_01.jpg',
      },
      {
        title: 'Acid-Wash Raw Edge Flare Denim Jeans',
        href: '/products/acid-wash-raw-edge-flare-denim-jeans/',
        image: '/images/products/product-28/image_01.jpg',
      },
      {
        title: 'High-Waisted Buckled Cargo Parachute Pants',
        href: '/products/high-waisted-buckled-cargo-parachute-pants/',
        image: '/images/products/product-39/image_01.jpg',
      },
      {
        title: 'Pleated Low-Rise Buckle Cargo Mini Skirt',
        href: '/products/pleated-low-rise-buckle-cargo-mini-skirt/',
        image: '/images/products/product-22/image_01.jpg',
      },
      {
        title: 'Studded Leather Buckle Utility Platform Harness',
        href: '/products/studded-leather-buckle-utility-platform-harness/',
        image: '/images/products/product-35/image_01.jpg',
      },
    ],
  },
  {
    name: 'SKIRTS',
    count: '3',
    video: '/videos/menu/Make_fashion_aesthetic_skirt_video_20261017153922.mp4',
    poster: '/videos/menu/posters/Make_fashion_aesthetic_skirt_video_20261017153922.jpg',
    products: [
      {
        title: 'Pleated Low-Rise Buckle Cargo Mini Skirt',
        href: '/products/pleated-low-rise-buckle-cargo-mini-skirt/',
        image: '/images/products/product-22/image_01.jpg',
      },
      {
        title: 'Layered Ruffle Tiered Grunge Mini Dress',
        href: '/products/layered-ruffle-tiered-grunge-mini-dress/',
        image: '/images/products/product-33/image_01.jpg',
      },
      {
        title: 'Asymmetric Off-Shoulder Top & Eyelet Shorts',
        href: '/products/asymmetric-off-shoulder-top-eyelet-shorts/',
        image: '/images/products/product-13/image_01.jpg',
      },
      {
        title: 'Ruched Sheer Mesh Bodycon Halter Dress',
        href: '/products/ruched-sheer-mesh-bodycon-halter-dress/',
        image: '/images/products/product-26/image_01.jpg',
      },
      {
        title: 'Gothic Chain-Link Cutout Halter Maxi Dress',
        href: '/products/gothic-chain-link-cutout-halter-maxi-dress/',
        image: '/images/products/product-18/image_01.jpg',
      },
    ],
  },
  {
    name: 'SPECIAL EDITION',
    count: '8',
    video: '/videos/menu/Making_fashion_aesthetic_video_1080p_20261017165527.mp4',
    poster: '/videos/menu/posters/Making_fashion_aesthetic_video_1080p_20261017165527.jpg',
    products: [
      {
        title: 'ELVAREN Signature Leather Lace-Up Corset',
        href: '/products/elvaren-signature-leather-lace-up-corset/',
        image: '/images/products/product-3/image_01.jpg',
      },
      {
        title: 'Angel Graphic Bodysuit & Fur Shrug Set',
        href: '/products/angel-graphic-bodysuit-fur-shrug-set/',
        image: '/images/products/product-8/image_01.jpg',
      },
      {
        title: 'Satin Varsity Bomber Jacket with 8-Ball Patches',
        href: '/products/satin-varsity-bomber-jacket-with-8-ball-patches/',
        image: '/images/products/product-15/image_01.jpg',
      },
      {
        title: 'Heavy Metal Studded Moto Biker Jacket',
        href: '/products/heavy-metal-studded-moto-biker-jacket/',
        image: '/images/products/product-23/image_01.jpg',
      },
      {
        title: 'Studded Leather Buckle Utility Platform Harness',
        href: '/products/studded-leather-buckle-utility-platform-harness/',
        image: '/images/products/product-35/image_01.jpg',
      },
    ],
  },
  {
    name: 'TOPS',
    count: '17',
    video: '/videos/menu/Make_fashion_aesthetic_video_1080p_20261017151845.mp4',
    poster: '/videos/menu/posters/Make_fashion_aesthetic_video_1080p_20261017151845.jpg',
    products: [
      {
        title: 'Error 404 Streetwear Zip Hoodie',
        href: '/products/error-404-streetwear-zip-hoodie/',
        image: '/images/products/product-1/image_01.jpg',
      },
      {
        title: 'Distressed Mohair Shrug & Silver Chain Top',
        href: '/products/distressed-mohair-shrug-silver-chain-top/',
        image: '/images/products/product-2/image_01.jpg',
      },
      {
        title: 'Angel Graphic Bodysuit & Fur Shrug Set',
        href: '/products/angel-graphic-bodysuit-fur-shrug-set/',
        image: '/images/products/product-8/image_01.jpg',
      },
      {
        title: 'Baby Pink Lace-Up Collared Zip Halter Top',
        href: '/products/baby-pink-lace-up-collared-zip-halter-top/',
        image: '/images/products/product-9/image_01.jpg',
      },
      {
        title: 'Cyberpunk Techwear Mesh Panel Crop Top',
        href: '/products/cyberpunk-techwear-mesh-panel-crop-top/',
        image: '/images/products/product-36/image_01.jpg',
      },
    ],
  },
  {
    name: '5-HT',
    count: 'COMING SOON',
    video: '/videos/menu/Create_fashion_aesthetic_video_1080p_20261017152019.mp4',
    poster: '/videos/menu/posters/Create_fashion_aesthetic_video_1080p_20261017152019.jpg',
    products: [],
    disabled: true,
  },
];

const MENU_ITEMS = [
  { label: 'COLLECTIONS', count: '01', href: '/collections' },
  { label: 'CAMPAIGN', count: '02', href: '/#campaign' },
  { label: 'WHO WE ARE', count: '03', href: '/#bold' },
  { label: 'CONTACT', count: '04', href: '/#footer' },
  { label: 'PUBLICATIONS', count: '05', href: '/#film' },
  { label: 'SALE', count: '06', href: '/products?category=SALE' },
];

export default function MenuModal() {
  const router = useRouter();
  const pathname = usePathname();
  const { isMenuOpen, setIsMenuOpen, menuTab } = useCart();
  const [hoveredCatIndex, setHoveredCatIndex] = useState<number>(-1);
  const [hoveredMenuIndex, setHoveredMenuIndex] = useState<number>(-1);
  const [hasOpened, setHasOpened] = useState<boolean>(false);
  const [loadedCatIndices, setLoadedCatIndices] = useState<{ [key: number]: boolean }>({});

  // Auto-close menu when route changes (e.g. SHOP ALL, collections, products)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname, setIsMenuOpen]);

  // References for HTML5 video playback
  const menuVideoRef = useRef<HTMLVideoElement | null>(null);
  const defaultVideoRef = useRef<HTMLVideoElement | null>(null);
  const categoryVideoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const isHoveringProductListRef = useRef<boolean>(false);

  // Activate loading once modal has been opened
  useEffect(() => {
    if (isMenuOpen && !hasOpened) {
      setHasOpened(true);
    }
  }, [isMenuOpen, hasOpened]);

  // Mark hovered category as loaded so it retains its buffer
  useEffect(() => {
    if (hoveredCatIndex >= 0) {
      setLoadedCatIndices((prev) => (prev[hoveredCatIndex] ? prev : { ...prev, [hoveredCatIndex]: true }));
    }
  }, [hoveredCatIndex]);

  // On desktop with broad bandwidth, idle-preload other categories after modal is open
  useEffect(() => {
    if (!isMenuOpen || menuTab !== 'categories') return;
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (min-width: 1024px)').matches;
    if (!isDesktop) return;

    const timer = setTimeout(() => {
      const allLoaded: { [key: number]: boolean } = {};
      CATEGORIES_DATA.forEach((_, idx) => {
        allLoaded[idx] = true;
      });
      setLoadedCatIndices((prev) => ({ ...allLoaded, ...prev }));
    }, 1500);

    return () => clearTimeout(timer);
  }, [isMenuOpen, menuTab]);

  // Reset hover state after modal closing animation completes
  useEffect(() => {
    if (!isMenuOpen) {
      const timer = setTimeout(() => {
        setHoveredCatIndex(-1);
        setHoveredMenuIndex(-1);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen, menuTab]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, setIsMenuOpen]);

  // Video playback management on open, tab switch, and category hover
  useEffect(() => {
    const playSafe = (vid: HTMLVideoElement | null) => {
      if (!vid || !vid.src) return;
      vid.muted = true;
      vid.defaultMuted = true;
      try {
        vid.currentTime = 0;
      } catch (_) {}
      const p = vid.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    };

    if (!isMenuOpen) {
      // Pause videos after menu has finished collapsing elements
      const timer = setTimeout(() => {
        menuVideoRef.current?.pause();
        defaultVideoRef.current?.pause();
        Object.values(categoryVideoRefs.current).forEach((vid) => vid?.pause());
      }, 750);
      return () => clearTimeout(timer);
    }

    if (menuTab === 'menu') {
      // Menu tab active: play menu video, pause categories
      defaultVideoRef.current?.pause();
      Object.values(categoryVideoRefs.current).forEach((vid) => vid?.pause());
      playSafe(menuVideoRef.current);
    } else if (menuTab === 'categories') {
      // Categories tab active: pause menu video
      menuVideoRef.current?.pause();

      if (hoveredCatIndex >= 0) {
        // A specific category is hovered: play that category's video, pause default & others
        defaultVideoRef.current?.pause();
        CATEGORIES_DATA.forEach((_, idx) => {
          const vid = categoryVideoRefs.current[idx];
          if (idx === hoveredCatIndex) {
            playSafe(vid);
          } else {
            vid?.pause();
          }
        });
      } else {
        // No category hovered: pause all categories, play default video
        Object.values(categoryVideoRefs.current).forEach((vid) => vid?.pause());
        playSafe(defaultVideoRef.current);
      }
    }
  }, [isMenuOpen, menuTab, hoveredCatIndex]);

  const activeCat = hoveredCatIndex >= 0 ? CATEGORIES_DATA[hoveredCatIndex] : null;
  const currentTitle = activeCat ? activeCat.name : 'SELECT';

  const handleCategoryClick = (cat: CategoryData, index: number) => {
    if (cat.disabled) return;
    const url = `/products?category=${encodeURIComponent(cat.name)}`;
    const isTouch = typeof window !== 'undefined' && (window.matchMedia('(hover: none)').matches || window.innerWidth < 1024);
    if (isTouch) {
      if (hoveredCatIndex === index) {
        setIsMenuOpen(false);
        router.push(url);
      } else {
        router.prefetch(url);
        setHoveredCatIndex(index);
        const vid = categoryVideoRefs.current[index];
        if (vid) {
          vid.muted = true;
          vid.defaultMuted = true;
          try {
            vid.currentTime = 0;
          } catch (_) {}
          vid.play().catch(() => {});
        }
      }
    } else {
      setHoveredCatIndex(index);
      setIsMenuOpen(false);
      router.push(url);
    }
  };

  const handleProductCardClick = (hrefOrCategory?: string) => {
    setIsMenuOpen(false);
    if (!hrefOrCategory) {
      router.push('/products');
      return;
    }
    if (hrefOrCategory.startsWith('/')) {
      router.push(hrefOrCategory);
    } else {
      router.push(`/products?category=${encodeURIComponent(hrefOrCategory)}`);
    }
  };

  const handleNavigate = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith('/#')) {
      const hash = href.replace('/#', '');
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    router.push(href);
  };

  return (
    <>
      {/* ========================================================
          1. MENU MODAL (menuTab === 'menu')
          ======================================================== */}
      <div
        className={`menu menu--menu is-mounted ${isMenuOpen && menuTab === 'menu' ? 'active' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsMenuOpen(false);
          }
        }}
      >
        <div className="menu__inner">
          {/* Menu Items List */}
          <ul className="menu__list">
            {MENU_ITEMS.map((item, idx) => {
              const isHovered = hoveredMenuIndex === idx;
              return (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    onMouseEnter={() => {
                      setHoveredMenuIndex(idx);
                      if (!item.href.startsWith('/#')) {
                        router.prefetch(item.href);
                      }
                    }}
                    onMouseOver={() => {
                      setHoveredMenuIndex(idx);
                      if (!item.href.startsWith('/#')) {
                        router.prefetch(item.href);
                      }
                    }}
                    onPointerEnter={() => {
                      setHoveredMenuIndex(idx);
                      if (!item.href.startsWith('/#')) {
                        router.prefetch(item.href);
                      }
                    }}
                    onMouseLeave={() => setHoveredMenuIndex(-1)}
                    style={{
                      background: 'none',
                      border: 'none',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.45rem 0',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'PP Fraktion Mono, monospace',
                      fontSize: 'clamp(1.4rem, 1.4vw, 1.95rem)',
                      fontWeight: 600,
                      color: isHovered ? '#ed3833' : '#000000',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.02em',
                      transition: 'color 0.15s ease',
                    }}
                  >
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <span>[ </span>
                      <span>{item.label}</span>
                      <span> ]</span>
                      {isHovered && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '-2px',
                            left: 0,
                            width: '100%',
                            height: '2px',
                            backgroundColor: '#ed3833',
                          }}
                        />
                      )}
                    </div>
                    <div style={{ fontWeight: 400, color: isHovered ? '#ed3833' : '#000000' }}>
                      <span>[ </span>
                      <span>{item.count}</span>
                      <span> ]</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Contact / Footer Links */}
          <ul className="menu__contact-list">
            <li>
              <button
                type="button"
                onClick={() => handleNavigate('/#footer')}
                style={{
                  background: 'none',
                  border: 'none',
                  font: 'inherit',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'left',
                }}
              >
                Shipping and Payment
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNavigate('/#footer')}
                style={{
                  background: 'none',
                  border: 'none',
                  font: 'inherit',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'center',
                }}
              >
                Credits
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNavigate('/#footer')}
                style={{
                  background: 'none',
                  border: 'none',
                  font: 'inherit',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'right',
                }}
              >
                Terms and Conditions
              </button>
            </li>
          </ul>
        </div>

        {/* Collection items: Main video & 5 product cards */}
        <ul className="menu__collection">
          <li className={`menu__item default ${isMenuOpen && menuTab === 'menu' ? 'active' : ''}`}>
            <div
              className="menu__item-main"
              style={{
                overflow: 'hidden',
              }}
            >
              <video
                ref={menuVideoRef}
                src={hasOpened ? "/videos/menu/Create_fashion_aesthetic_video_1080p_20261017152019.mp4" : undefined}
                poster={hasOpened ? "/videos/menu/posters/Create_fashion_aesthetic_video_1080p_20261017152019.jpg" : undefined}
                muted
                loop
                playsInline
                autoPlay={isMenuOpen && menuTab === 'menu'}
                preload={isMenuOpen && menuTab === 'menu' ? 'auto' : 'none'}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to right, rgba(255,249,247,0.7) 0%, rgba(255,249,247,0.35) 35%, transparent 65%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
            <ul className="menu__item-list">
              {DEFAULT_PRODUCTS.map((prod, pIdx) => (
                <li
                  key={pIdx}
                  onClick={() => handleProductCardClick(prod.href)}
                  style={{ cursor: 'pointer' }}
                  title={prod.title}
                >
                  <picture>
                    <img src={hasOpened ? prod.image : undefined} alt={prod.title} loading="lazy" decoding="async" />
                  </picture>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        {/* Bottom indicator */}
        <p className="menu__text">(14)</p>
      </div>

      {/* ========================================================
          2. CATEGORIES MODAL (menuTab === 'categories')
          ======================================================== */}
      <div
        className={`menu menu--categories is-mounted ${isMenuOpen && menuTab === 'categories' ? 'active' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsMenuOpen(false);
          }
        }}
      >
        <div className="menu__inner">
          {/* Category List */}
          <ul
            className="menu__list"
            onMouseLeave={() => {
              setTimeout(() => {
                if (!isHoveringProductListRef.current) {
                  setHoveredCatIndex(-1);
                }
              }, 60);
            }}
          >
            {CATEGORIES_DATA.map((cat, idx) => {
              const isHovered = hoveredCatIndex === idx;
              return (
                <li key={idx} className={cat.disabled ? 'disable' : ''}>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat, idx)}
                    onMouseEnter={() => {
                      if (!cat.disabled) {
                        setHoveredCatIndex(idx);
                        router.prefetch(`/products?category=${encodeURIComponent(cat.name)}`);
                      }
                    }}
                    onMouseOver={() => {
                      if (!cat.disabled) {
                        setHoveredCatIndex(idx);
                        router.prefetch(`/products?category=${encodeURIComponent(cat.name)}`);
                      }
                    }}
                    onPointerEnter={() => {
                      if (!cat.disabled) {
                        setHoveredCatIndex(idx);
                        router.prefetch(`/products?category=${encodeURIComponent(cat.name)}`);
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.28rem 0',
                      cursor: cat.disabled ? 'default' : 'pointer',
                      textAlign: 'left',
                      fontFamily: 'PP Fraktion Mono, monospace',
                      fontSize: 'clamp(1.3rem, 1.25vw, 1.75rem)',
                      fontWeight: 600,
                      color: isHovered ? '#ed3833' : '#000000',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.02em',
                      transition: 'color 0.15s ease',
                      opacity: cat.disabled ? 0.35 : 1,
                    }}
                  >
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <span>[ </span>
                      <span>{cat.name}</span>
                      <span> ]</span>
                      {isHovered && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '-2px',
                            left: 0,
                            width: '100%',
                            height: '2px',
                            backgroundColor: '#ed3833',
                          }}
                        />
                      )}
                    </div>
                    <div style={{ fontWeight: 400, color: isHovered ? '#ed3833' : '#000000' }}>
                      <span>[ </span>
                      <span>{cat.count}</span>
                      <span> ]</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Giant Bottom Title: SELECT (CATEGORIES) */}
          <p className="menu__title">
            <span className="active">
              <span>{currentTitle}</span>{' '}
              <strong>
                <i>(</i>Categories<i>)</i>
              </strong>
            </span>
          </p>

          {/* Bottom Info Row */}
          <ul className="menu__contact-list">
            <li>
              <span>(14)</span>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNavigate('/#footer')}
                style={{
                  background: 'none',
                  border: 'none',
                  font: 'inherit',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Credits
              </button>
            </li>
            <li>
              <a
                href="https://www.instagram.com/elvaren_official/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                IG
              </a>
            </li>
          </ul>
        </div>

        {/* Collection items: Category Videos and 5 Product Cards */}
        <ul className="menu__collection">
          {/* Default state item (when no category is hovered) */}
          <li className={`menu__item default ${isMenuOpen && menuTab === 'categories' && hoveredCatIndex === -1 ? 'active' : ''}`}>
            <div
              className="menu__item-main"
              style={{
                overflow: 'hidden',
              }}
            >
              <video
                ref={defaultVideoRef}
                src={hasOpened ? "/videos/menu/Create_fashion_aesthetic_video_1080p_20261017152019.mp4" : undefined}
                poster={hasOpened ? "/videos/menu/posters/Create_fashion_aesthetic_video_1080p_20261017152019.jpg" : undefined}
                muted
                loop
                playsInline
                autoPlay={isMenuOpen && menuTab === 'categories' && hoveredCatIndex === -1}
                preload={isMenuOpen && menuTab === 'categories' && hoveredCatIndex === -1 ? 'auto' : 'none'}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to right, rgba(255,249,247,0.7) 0%, rgba(255,249,247,0.35) 35%, transparent 65%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
            <ul
              className="menu__item-list"
              onMouseEnter={() => {
                isHoveringProductListRef.current = true;
              }}
              onMouseLeave={() => {
                isHoveringProductListRef.current = false;
                setHoveredCatIndex(-1);
              }}
            >
              {DEFAULT_PRODUCTS.map((prod, pIdx) => (
                <li
                  key={pIdx}
                  onClick={() => handleProductCardClick(prod.href)}
                  style={{ cursor: 'pointer' }}
                  title={prod.title}
                >
                  <picture>
                    <img src={hasOpened ? prod.image : undefined} alt={prod.title} loading="lazy" decoding="async" />
                  </picture>
                </li>
              ))}
            </ul>
          </li>

          {/* Individual Category items */}
          {CATEGORIES_DATA.map((cat, idx) => {
            const isActive = isMenuOpen && menuTab === 'categories' && hoveredCatIndex === idx;
            const isLoaded = hasOpened && (isActive || !!loadedCatIndices[idx]);
            const prods = cat.products.length > 0 ? cat.products : DEFAULT_PRODUCTS;
            return (
              <li key={idx} className={`menu__item ${isActive ? 'active' : ''}`}>
                <div
                  className="menu__item-main"
                  style={{
                    overflow: 'hidden',
                  }}
                >
                  <video
                    ref={(el) => {
                      categoryVideoRefs.current[idx] = el;
                    }}
                    src={isLoaded ? cat.video : undefined}
                    poster={isLoaded ? cat.poster : undefined}
                    muted
                    loop
                    playsInline
                    autoPlay={isActive}
                    preload={isActive ? 'auto' : 'none'}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to right, rgba(255,249,247,0.7) 0%, rgba(255,249,247,0.35) 35%, transparent 65%)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
                <ul
                  className="menu__item-list"
                  onMouseEnter={() => {
                    isHoveringProductListRef.current = true;
                  }}
                  onMouseLeave={() => {
                    isHoveringProductListRef.current = false;
                    setHoveredCatIndex(-1);
                  }}
                >
                  {prods.map((prod, pIdx) => (
                    <li
                      key={pIdx}
                      onClick={() => handleProductCardClick(prod.href)}
                      style={{ cursor: 'pointer' }}
                      title={prod.title}
                    >
                      <picture>
                        <img src={isLoaded ? prod.image : undefined} alt={prod.title} loading="lazy" decoding="async" />
                      </picture>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        {/* Bottom indicator */}
        <p className="menu__text">(14)</p>
      </div>
    </>
  );
}
