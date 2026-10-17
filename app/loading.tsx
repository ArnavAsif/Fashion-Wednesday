import React from 'react';

export default function RootLoading() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#fff9f7',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'PP Fraktion Mono, monospace',
        fontSize: '1.1rem',
        color: '#666',
        letterSpacing: '0.05em',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <span style={{ color: '#ed3833' }}>●</span>
        <span>[ BONEZ // LOADING ]</span>
      </div>
    </div>
  );
}
