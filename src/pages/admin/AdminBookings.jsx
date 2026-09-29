import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Printer, Search, Calendar, DollarSign } from 'lucide-react';
import { Table } from '../../components/common/Table.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FormField } from '../../components/common/FormField.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { ConfirmDialog } from '../../components/common/ConfirmDialog.jsx';
import { PrintableInvoice } from '../../components/admin/PrintableInvoice.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function AdminBookings() {
  const { addToast } = useApp();

  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  // Printable Invoice State
  const [activeInvoiceBooking, setActiveInvoiceBooking] = useState(null);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialForm = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    packageId: '',
    packageTitle: '',
    travelers: '2 Adults',
    travelDate: new Date().toISOString().split('T')[0],
    totalAmount: 3500,
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card'
  };
  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const bks = await api.getBookings();
      const pkgs = await api.getPackages();
      setBookings(bks);
      setPackages(pkgs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingBooking(null);
    setFormData(initialForm);
    if (packages.length > 0) {
      setFormData(prev => ({
        ...prev,
        packageId: packages[0].id,
        packageTitle: packages[0].title,
        totalAmount: packages[0].price || 3500
      }));
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bk) => {
    setEditingBooking(bk);
    setFormData(bk);
    setIsModalOpen(true);
  };

  const handlePackageSelectChange = (e) => {
    const pkgId = e.target.value;
    const selectedPkg = packages.find(p => p.id === pkgId);
    setFormData(prev => ({
      ...prev,
      packageId: pkgId,
      packageTitle: selectedPkg ? selectedPkg.title : '',
      totalAmount: selectedPkg ? selectedPkg.price : prev.totalAmount
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail) {
      addToast('Please enter customer name and email.', 'error');
      return;
    }

    try {
      await api.saveBooking(formData);
      addToast(`Booking ${editingBooking ? 'updated' : 'created'} successfully!`, 'success');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      addToast('Failed to save booking.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.deleteBooking(deleteId);
      addToast('Booking deleted successfully.', 'success');
      setDeleteId(null);
      loadData();
    } catch (err) {
      addToast('Failed to delete booking.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = bookings.filter(b =>
    b.customerName.toLowerCase().includes(search.toLowerCase()) ||
    b.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
    b.packageTitle.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Booking ID', key: 'id', render: (row) => (
        <strong>INV-{row.id}</strong>
      )
    },
    {
      title: 'Customer', key: 'customerName', render: (row) => (
        <div>
          <strong style={{ color: 'var(--adriatic)', display: 'block' }}>{row.customerName}</strong>
          <span style={{ fontSize: '0.8rem', color: '#666' }}>{row.customerEmail}</span>
        </div>
      )
    },
    { title: 'Package', key: 'packageTitle' },
    { title: 'Travel Date', key: 'travelDate' },
    { title: 'Amount', key: 'totalAmount', render: (row) => <strong>${row.totalAmount?.toLocaleString()}</strong> },
    {
      title: 'Payment Status', key: 'paymentStatus', render: (row) => (
        <Badge variant={row.paymentStatus === 'Paid' ? 'success' : row.paymentStatus === 'Partial' ? 'warning' : 'danger'}>
          {row.paymentStatus}
        </Badge>
      )
    },
    {
      title: 'Actions', key: 'id', render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="sm" variant="gold" icon={Printer} onClick={() => setActiveInvoiceBooking(row)} title="Print Invoice" />
          <Button size="sm" variant="secondary" icon={Edit} onClick={() => handleOpenEdit(row)} />
          <Button size="sm" variant="primary" icon={Trash2} onClick={() => setDeleteId(row.id)} />
        </div>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Manage Bookings | Roamora Admin</title>
      </Helmet>

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', margin: 0 }}>
            Confirmed Bookings Management
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Track reservations, payment statuses, and generate client invoices.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Create New Booking
        </Button>
      </div>

      <div className="table-toolbar">
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Search customer or package..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '38px', height: '38px' }}
          />
        </div>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>Total: {filtered.length} bookings</span>
      </div>

      <Table columns={columns} data={filtered} />

      {/* Booking Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBooking ? "Edit Booking" : "Create New Booking"}>
        <form onSubmit={handleFormSubmit}>
          <FormField
            label="Customer Full Name"
            name="customerName"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField
              label="Customer Email"
              name="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              required
            />
            <FormField
              label="Customer Phone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              required
            />
          </div>

          <FormField
            label="Select Package"
            name="packageId"
            type="select"
            value={formData.packageId}
            onChange={handlePackageSelectChange}
            options={packages.map(p => ({ label: `${p.title} ($${p.price})`, value: p.id }))}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <FormField
              label="Travelers"
              name="travelers"
              value={formData.travelers}
              onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
            />
            <FormField
              label="Travel Date"
              name="travelDate"
              type="date"
              value={formData.travelDate}
              onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
            />
            <FormField
              label="Total Amount ($ USD)"
              name="totalAmount"
              type="number"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField
              label="Payment Status"
              name="paymentStatus"
              type="select"
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              options={['Paid', 'Partial', 'Pending']}
            />
            <FormField
              label="Payment Method"
              name="paymentMethod"
              type="select"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              options={['Credit Card', 'Bank Wire', 'UPI / Online', 'Cash']}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--sage)' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Booking</Button>
          </div>
        </form>
      </Modal>

      {/* Printable Invoice Modal */}
      {activeInvoiceBooking && (
        <PrintableInvoice booking={activeInvoiceBooking} onClose={() => setActiveInvoiceBooking(null)} />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Booking"
        message="Are you sure you want to delete this booking record?"
        loading={isDeleting}
      />
    </>
  );
}
