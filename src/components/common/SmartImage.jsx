import React, { useState } from 'react';
import { IMAGES } from '../../data/images.js';

export function SmartImage({
  src,
  alt = 'Travel Image',
  aspectRatio = '16/9',
  className = '',
  style = {},
  fallback = IMAGES.fallback,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imgSrc = error ? fallback : (src || fallback);

  return (
    <div
      className={`smart-image-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: aspectRatio,
        backgroundColor: 'var(--sage)',
        overflow: 'hidden',
        ...style
      }}
    >
      {!loaded && !error && (
        <div
          className="skeleton"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1
          }}
        />
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out',
          display: 'block'
        }}
        {...props}
      />
    </div>
  );
}
