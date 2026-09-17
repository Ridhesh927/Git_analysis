import React from 'react';

export default function LoadingOverlay() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff'
    }}>
      <div style={{
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(14, 165, 233, 0.4)',
        border: '2px solid rgba(56, 189, 248, 0.5)',
        marginBottom: '24px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#020617'
      }}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        >
          <source src="/pls_wait.mp4" type="video/mp4" />
        </video>
      </div>
      <h2 style={{ 
        fontFamily: 'Orbitron, sans-serif',
        background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: 0
      }}>
        Analyzing Deep Space...
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.9rem' }}>
        Extracting repositories, issues, and contributor constellations
      </p>
    </div>
  );
}
