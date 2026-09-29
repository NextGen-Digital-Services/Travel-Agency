import React from 'react';

export function Table({
  columns, // [{ key, title, render }]
  data,
  keyField = 'id',
  emptyMessage = 'No records found.'
}) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#777', backgroundColor: 'var(--white)', borderRadius: 'var(--border-radius-md)' }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-responsive-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={col.style || {}}>{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row[keyField]}>
                {columns.map((col, idx) => (
                  <td key={idx} style={col.style || {}}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Stacked Mobile View */}
        <div className="stacked-card-list">
          {data.map((row) => (
            <div key={row[keyField]} className="stacked-card">
              {columns.map((col, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adriatic)', textTransform: 'uppercase' }}>
                    {col.title}:
                  </span>
                  <div>{col.render ? col.render(row) : row[col.key]}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
