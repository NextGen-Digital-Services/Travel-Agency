import React from 'react';
import { useCounter } from '../../hooks/useCounter.js';

export function StatCard({
  icon: Icon,
  label,
  value,
  prefix = '',
  suffix = '',
  trend = '',
  trendType = 'up' // up | down
}) {
  const animatedValue = useCounter(value);

  return (
    <div className="admin-stat-card">
      <div>
        <div className="admin-stat-lbl">{label}</div>
        <div className="admin-stat-val">
          {prefix}{animatedValue.toLocaleString()}{suffix}
        </div>
        {trend && (
          <div style={{
            fontSize: '0.75rem',
            marginTop: '0.25rem',
            color: trendType === 'up' ? 'var(--olive)' : 'var(--terracotta)',
            fontWeight: 600
          }}>
            {trend}
          </div>
        )}
      </div>
      {Icon && (
        <div className="admin-stat-icon">
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
