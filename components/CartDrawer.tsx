'use client';

import React from 'react';
import { useCart } from '@/lib/cartContext';

export default function CartDrawer() {
  const {
    cart,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          backgroundColor: '#fff',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '2rem',
            borderBottom: '1px solid #eee',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'Thunder, sans-serif',
                fontSize: '2.8rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                margin: 0,
                lineHeight: 1,
              }}
            >
              Your Bag
            </h2>
            <span
              style={{
                fontFamily: 'PP Fraktion Mono, monospace',
                fontSize: '1rem',
                color: '#666',
              }}
            >
              [ {cartCount} - Items ]
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.0769 10L22 10.9231L16.9231 16L22 21.0769L21.0769 22L16 16.9231L10.9231 22L10 21.0769L15.0769 16L10 10.9231L10.9231 10L16 15.0769L21.0769 10Z" fill="#000" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p
                style={{
                  fontFamily: 'PP Fraktion Mono, monospace',
                  fontSize: '1.2rem',
                  color: '#666',
                  marginBottom: '2rem',
                }}
              >
                Your cart is empty.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  padding: '1rem 2rem',
                  fontFamily: 'PP Fraktion Mono, monospace',
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                [ Continue Shopping ]
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cart.map((item, idx) => {
                const img = item.product.images?.[0]?.[0] || '/images/img_102.jpg';
                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${idx}`}
                    style={{
                      display: 'flex',
                      gap: '1.2rem',
                      paddingBottom: '1.5rem',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <div
                      style={{
                        width: '90px',
                        height: '115px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={img}
                        alt={item.product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <h4
                            style={{
                              fontFamily: 'Thunder, sans-serif',
                              fontSize: '1.8rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              margin: 0,
                            }}
                          >
                            {item.product.title}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                            style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '1.2rem' }}
                          >
                            ✕
                          </button>
                        </div>
                        <div style={{ fontFamily: 'PP Fraktion Mono, monospace', fontSize: '0.9rem', color: '#888', marginTop: '0.2rem' }}>
                          Size: {item.selectedSize}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Quantity Controller */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '2px' }}>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                            style={{ padding: '0.2rem 0.6rem', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            -
                          </button>
                          <span style={{ padding: '0.2rem 0.6rem', fontFamily: 'PP Fraktion Mono, monospace', fontSize: '0.9rem' }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                            style={{ padding: '0.2rem 0.6rem', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            +
                          </button>
                        </div>

                        <span
                          style={{
                            fontFamily: 'PP Fraktion Mono, monospace',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                          }}
                        >
                          {(item.product.price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Checkout Section */}
        {cart.length > 0 && (
          <div style={{ padding: '2rem', borderTop: '1px solid #eee', background: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontFamily: 'PP Fraktion Mono, monospace', fontSize: '1.2rem' }}>
              <span>SUBTOTAL</span>
              <strong style={{ fontSize: '1.4rem' }}>{cartTotal.toFixed(2)} €</strong>
            </div>

            <button
              type="button"
              onClick={() => alert('Proceeding to checkout with total: ' + cartTotal.toFixed(2) + ' €')}
              style={{
                width: '100%',
                background: '#000',
                color: '#fff',
                border: 'none',
                padding: '1.2rem',
                fontFamily: 'PP Fraktion Mono, monospace',
                fontSize: '1.1rem',
                textTransform: 'uppercase',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ff2d20')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000')}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
