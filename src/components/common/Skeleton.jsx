import React from 'react';

export function SkeletonCard() {
  return (
    <div className="travel-card">
      <div className="skeleton" style={{ height: '220px', width: '100%' }} />
      <div className="card-body">
        <div className="skeleton" style={{ height: '24px', width: '70%', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '20px' }} />
        <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '16px', width: '90%', marginBottom: '24px' }} />
        <div className="skeleton" style={{ height: '36px', width: '100%' }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="cards-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}
