'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cartContext';

export default function NewsletterModal() {
  const { isNewsletterOpen, setIsNewsletterOpen } = useCart();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (!isNewsletterOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setIsNewsletterOpen(false);
        setSubscribed(false);
      }, 2500);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#fff',
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Banner Image */}
        <div style={{ width: '100%', height: '220px', position: 'relative', overflow: 'hidden' }}>
          <img
            src="/images/img_033.webp"
            alt="ELVAREN Newsletter"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <button
            type="button"
            onClick={() => setIsNewsletterOpen(false)}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(0,0,0,0.6)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '2.5rem' }}>
          <h3
            style={{
              fontFamily: 'Thunder, sans-serif',
              fontSize: '3.5rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              margin: '0 0 0.5rem 0',
              lineHeight: 0.9,
            }}
          >
            Sign Up
          </h3>
          <p
            style={{
              fontFamily: 'PP Fraktion Mono, monospace',
              fontSize: '1.05rem',
              color: '#555',
              margin: '0 0 2rem 0',
            }}
          >
            GET 10% OFF YOUR FIRST ORDER AND EARLY ACCESS TO NEW DROPS.
          </p>

          {subscribed ? (
            <div
              style={{
                fontFamily: 'PP Fraktion Mono, monospace',
                fontSize: '1.2rem',
                color: '#ff2d20',
                fontWeight: 700,
                textAlign: 'center',
                padding: '1.5rem 0',
              }}
            >
              ✓ THANK YOU FOR SUBSCRIBING!
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL"
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '2px',
                  fontFamily: 'PP Fraktion Mono, monospace',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '2px',
                  fontFamily: 'PP Fraktion Mono, monospace',
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ff2d20')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000')}
              >
                CLAIM 10% DISCOUNT
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
