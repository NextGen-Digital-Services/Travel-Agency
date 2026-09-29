import React from 'react';
import { Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function Logo({ light = false, size = 'normal' }) {
  const { settings } = useApp();
  const logoText = settings?.logoText || 'ROAMORA';

  return (
    <div className={`brand-logo ${light ? 'logo-light' : 'logo-dark'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
      <div style={{
        width: size === 'large' ? '48px' : '40px',
        height: size === 'large' ? '48px' : '40px',
        borderRadius: '50%',
        backgroundColor: light ? 'rgba(194, 153, 63, 0.2)' : 'rgba(14, 42, 71, 0.06)',
        border: '1px solid var(--gold)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--gold)',
        flexShrink: 0
      }}>
        <Compass size={size === 'large' ? 26 : 22} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: size === 'large' ? '1.8rem' : '1.4rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: light ? 'var(--ivory)' : 'var(--adriatic)',
          textTransform: 'uppercase'
        }}>
          {logoText}
        </span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: '0.3em',
          color: 'var(--gold)',
          textTransform: 'uppercase'
        }}>
          TRAVELS
        </span>
      </div>
    </div>
  );
}
