'use client';

import React from 'react';

export default function CreditsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
          maxWidth: '480px',
          backgroundColor: '#fff',
          borderRadius: '4px',
          padding: '2.5rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          textAlign: 'center',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
          }}
        >
          ✕
        </button>

        <h3
          style={{
            fontFamily: 'Thunder, sans-serif',
            fontSize: '3.5rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            margin: '0 0 1rem 0',
            lineHeight: 1,
          }}
        >
          Created With Love
        </h3>

        <p
          style={{
            fontFamily: 'PP Fraktion Mono, monospace',
            fontSize: '1.1rem',
            color: '#555',
            margin: '0 0 2rem 0',
          }}
        >
          Made in collaboration by <strong>design and development.</strong>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p style={{ fontFamily: 'PP Fraktion Mono, monospace', fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>
              Creative / Design
            </p>
            <a
              href="https://blacklead.studio/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#000',
                color: '#fff',
                padding: '0.8rem 1.8rem',
                fontFamily: 'PP Fraktion Mono, monospace',
                fontSize: '1rem',
                textDecoration: 'none',
                borderRadius: '2px',
              }}
            >
              [ BL/s® Blacklead Studio ↗ ]
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
