'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './products';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  menuTab: 'menu' | 'categories';
  setMenuTab: (tab: 'menu' | 'categories') => void;
  openMenu: (tab?: 'menu' | 'categories') => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNewsletterOpen: boolean;
  setIsNewsletterOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTab, setMenuTab] = useState<'menu' | 'categories'>('menu');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  const openMenu = (tab: 'menu' | 'categories' = 'menu') => {
    setMenuTab(tab);
    setIsMenuOpen(true);
  };

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('elvaren_cart') || localStorage.getItem('serotoninn_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('elvaren_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const addToCart = (product: Product, size?: string) => {
    const chosenSize = size || (product.size && product.size.length > 0 ? product.size[0] : 'One Size');
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedSize === chosenSize
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === chosenSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedSize: chosenSize }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number, size: string) => {
    setCart((prev) => prev.filter(
      (item) => !(item.product.id === productId && item.selectedSize === size)
    ));
  };

  const updateQuantity = (productId: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isMenuOpen,
        setIsMenuOpen,
        menuTab,
        setMenuTab,
        openMenu,
        isSearchOpen,
        setIsSearchOpen,
        isNewsletterOpen,
        setIsNewsletterOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
