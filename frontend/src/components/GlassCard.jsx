import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ children, title, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-panel ${className}`}
      style={{
        background: 'rgba(20, 20, 30, 0.4)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        color: '#fff',
      }}
    >
      {title && (
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: '500', color: '#c084fc' }}>
          {title}
        </h3>
      )}
      {children}
    </motion.div>
  );
}
