import React from 'react';
import { Compass } from 'lucide-react';
import { Button } from './Button.jsx';

export function EmptyState({
  icon: Icon = Compass,
  title = "No Items Found",
  description = "We couldn't find any results matching your search or filters.",
  actionText,
  onAction
}) {
  return (
    <div style={{
      padding: '4rem 2rem',
      textAlign: 'center',
      backgroundColor: 'var(--white)',
      borderRadius: 'var(--border-radius-md)',
      border: '1px dashed var(--gold)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      margin: '2rem 0'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'var(--cream)',
        color: 'var(--terracotta)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={32} />
      </div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--adriatic)', margin: 0 }}>
        {title}
      </h3>
      <p style={{ color: '#666', maxWidth: '450px', fontSize: '0.95rem', margin: 0 }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction} style={{ marginTop: '0.5rem' }}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
