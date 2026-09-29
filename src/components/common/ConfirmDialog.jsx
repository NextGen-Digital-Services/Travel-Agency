import React from 'react';
import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action? This step cannot be undone.",
  confirmText = "Delete",
  confirmVariant = "primary",
  loading = false
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="480px">
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ padding: '0.65rem', backgroundColor: '#fce8e6', borderRadius: '50%', color: 'var(--terracotta)' }}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <p style={{ color: 'var(--espresso)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--sage)' }}>
        <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant={confirmVariant} size="sm" onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
