import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function AdminBreadcrumbs({ items = [] }) {
  return (
    <div className="admin-breadcrumbs">
      <NavLink to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <Home size={14} /> Dashboard
      </NavLink>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={14} color="#999" />
          {item.path ? (
            <NavLink to={item.path}>{item.label}</NavLink>
          ) : (
            <span style={{ color: 'var(--espresso)', fontWeight: 600 }}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
