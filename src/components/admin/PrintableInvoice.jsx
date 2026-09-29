import React from 'react';
import { Logo } from '../common/Logo.jsx';
import { Button } from '../common/Button.jsx';
import { Printer, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function PrintableInvoice({ booking, onClose }) {
  const { settings } = useApp();

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="printable-invoice-modal" style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(14, 42, 71, 0.7)',
      zIndex: 3000,
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: 'var(--white)',
        maxWidth: '800px',
        width: '100%',
        borderRadius: 'var(--border-radius-md)',
        boxShadow: 'var(--box-shadow-lg)',
        padding: '2.5rem',
        position: 'relative'
      }}>
        {/* Action Bar (hidden on print) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '2rem' }} className="no-print">
          <Button variant="gold" icon={Printer} onClick={handlePrint}>
            Print Invoice
          </Button>
          <button onClick={onClose} style={{ color: 'var(--espresso)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Invoice Printable Document */}
        <div className="printable-invoice">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--gold)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <Logo size="large" />
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                {settings?.address || '[Office Address]'}
                <br />
                Email: {settings?.email || '[info@yourdomain.com]'} | Tel: {settings?.phone || '[+91 XXXXX XXXXX]'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--adriatic)', margin: 0 }}>
                INVOICE
              </h2>
              <div style={{ fontSize: '0.9rem', color: '#555', marginTop: '0.25rem' }}>
                Invoice No: <strong>INV-{booking.id}</strong>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#777' }}>
                Date: {booking.bookingDate || new Date().toISOString().split('T')[0]}
              </div>
            </div>
          </div>

          {/* Customer & Travel Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'var(--ivory)', padding: '1.25rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--sage)' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--gold)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Billed To:
              </h4>
              <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{booking.customerName}</div>
              <div style={{ fontSize: '0.9rem', color: '#555' }}>Email: {booking.customerEmail}</div>
              <div style={{ fontSize: '0.9rem', color: '#555' }}>Phone: {booking.customerPhone}</div>
            </div>

            <div style={{ backgroundColor: 'var(--ivory)', padding: '1.25rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--sage)' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--gold)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Journey Details:
              </h4>
              <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{booking.packageTitle}</div>
              <div style={{ fontSize: '0.9rem', color: '#555' }}>Travelers: {booking.travelers}</div>
              <div style={{ fontSize: '0.9rem', color: '#555' }}>Travel Date: {booking.travelDate}</div>
            </div>
          </div>

          {/* Charges Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--adriatic)', color: 'var(--ivory)', textAlign: 'left', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Description</th>
                <th style={{ padding: '0.75rem 1rem' }}>Travelers</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--sage)' }}>
                <td style={{ padding: '1rem' }}>
                  <strong>{booking.packageTitle}</strong>
                  <div style={{ fontSize: '0.82rem', color: '#666' }}>Includes 5-star hotel accommodations, transfers, and private excursions.</div>
                </td>
                <td style={{ padding: '1rem' }}>{booking.travelers}</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>${booking.totalAmount?.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          {/* Payment Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '2px solid var(--gold)', paddingTop: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>
                Payment Method: <strong>{booking.paymentMethod || 'Credit Card / Wire'}</strong>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                Status: <span style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: booking.paymentStatus === 'Paid' ? '#e6f4ea' : '#fef7e0',
                  color: booking.paymentStatus === 'Paid' ? '#137333' : '#b06000',
                  fontWeight: 600
                }}>{booking.paymentStatus}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Package Amount</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', color: 'var(--terracotta)', fontWeight: 700 }}>
                ${booking.totalAmount?.toLocaleString()}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--sage)', fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>
            Thank you for choosing Roamora Travels. If you have any questions regarding this invoice, please contact our financial desk at {settings?.email || '[info@yourdomain.com]'}.
          </div>
        </div>
      </div>
    </div>
  );
}
