import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Drawer({ isOpen, onClose, title, children, width = '420px', position = 'right' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(14, 42, 71, 0.6)',
        zIndex: 2500,
        display: 'flex',
        justifyContent: position === 'right' ? 'flex-end' : 'flex-start'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: width,
          maxWidth: '100%',
          height: '100%',
          backgroundColor: 'var(--white)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--box-shadow-lg)',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--sage)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--ivory)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--adriatic)', margin: 0 }}>
            {title}
          </h3>
          <button onClick={onClose} style={{ color: 'var(--adriatic)' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '1.5rem', flexGrow: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
