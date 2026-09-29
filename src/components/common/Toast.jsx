import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} color="var(--olive)" />
          ) : toast.type === 'error' ? (
            <AlertCircle size={18} color="var(--terracotta)" />
          ) : (
            <Info size={18} color="var(--gold)" />
          )}
          <span style={{ flexGrow: 1 }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ color: 'var(--ivory)', opacity: 0.7, cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
