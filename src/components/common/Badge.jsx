import React from 'react';

export function Badge({ children, variant = 'gold', icon: Icon, className = '' }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {Icon && <Icon size={12} />}
      <span>{children}</span>
    </span>
  );
}
