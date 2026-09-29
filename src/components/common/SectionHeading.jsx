import React from 'react';

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center', // left | center | right
  light = false
}) {
  const alignStyle = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';
  const textAlign = align === 'left' ? 'left' : align === 'right' ? 'right' : 'center';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: alignStyle,
      textAlign: textAlign,
      marginBottom: '3rem'
    }}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {title && (
        <h2 style={{
          color: light ? 'var(--ivory)' : 'var(--adriatic)',
          fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
          fontFamily: 'var(--font-heading)',
          marginTop: '0.25rem'
        }}>
          {title}
        </h2>
      )}
      <div
        className="gold-divider-center"
        style={{
          marginLeft: align === 'left' ? '0' : align === 'right' ? 'auto' : 'auto',
          marginRight: align === 'right' ? '0' : align === 'left' ? 'auto' : 'auto'
        }}
      />
      {subtitle && (
        <p style={{
          color: light ? 'rgba(247, 241, 229, 0.85)' : '#666',
          maxWidth: '650px',
          fontSize: '1.05rem',
          margin: 0
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
