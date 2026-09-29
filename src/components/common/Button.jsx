import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary', // primary | secondary | gold | outline-gold
  size = 'md', // sm | md | lg
  icon: Icon,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  style = {},
  ...props
}) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantClass = `btn-${variant}`;

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} style={{ animation: 'spin 1s linear infinite' }} />
      ) : Icon ? (
        <Icon size={18} />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
