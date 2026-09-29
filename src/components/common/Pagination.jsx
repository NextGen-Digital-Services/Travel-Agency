import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems || (currentPage * pageSize));

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      padding: '1rem 0',
      marginTop: '1rem',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div style={{ fontSize: '0.85rem', color: '#666' }}>
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> {totalItems ? `of ${totalItems} entries` : ''}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '0.4rem 0.75rem',
            border: '1px solid var(--sage)',
            borderRadius: 'var(--border-radius-sm)',
            backgroundColor: 'var(--white)',
            opacity: currentPage === 1 ? 0.5 : 1,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              padding: '0.4rem 0.85rem',
              border: '1px solid',
              borderColor: currentPage === page ? 'var(--gold)' : 'var(--sage)',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: currentPage === page ? 'var(--gold)' : 'var(--white)',
              color: currentPage === page ? 'var(--adriatic)' : 'var(--espresso)',
              fontWeight: currentPage === page ? 600 : 400,
              cursor: 'pointer'
            }}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '0.4rem 0.75rem',
            border: '1px solid var(--sage)',
            borderRadius: 'var(--border-radius-sm)',
            backgroundColor: 'var(--white)',
            opacity: currentPage === totalPages ? 0.5 : 1,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
