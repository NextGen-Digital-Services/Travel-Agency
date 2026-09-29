import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Download, Eye, Trash2, Mail, Phone, Calendar, FileText } from 'lucide-react';
import { Table } from '../../components/common/Table.jsx';
import { Drawer } from '../../components/common/Drawer.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { FormField } from '../../components/common/FormField.jsx';
import { ConfirmDialog } from '../../components/common/ConfirmDialog.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api, subscribeToDataChange } from '../../services/api.js';

export function AdminEnquiries() {
  const { addToast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('filter') || 'All');

  // Detail Drawer State
  const [activeEnquiry, setActiveEnquiry] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notesInput, setNotesInput] = useState('');
  const [statusInput, setStatusInput] = useState('New');

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await api.getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
    const unsub = subscribeToDataChange(() => {
      loadEnquiries();
    });
    return () => unsub();
  }, []);

  const handleOpenDrawer = (enq) => {
    setActiveEnquiry(enq);
    setNotesInput(enq.notes || '');
    setStatusInput(enq.status || 'New');
    setIsDrawerOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!activeEnquiry) return;
    try {
      await api.updateEnquiryStatus(activeEnquiry.id, statusInput, notesInput);
      addToast('Enquiry updated successfully.', 'success');
      setIsDrawerOpen(false);
      loadEnquiries();
    } catch (err) {
      addToast('Failed to update enquiry.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.deleteEnquiry(deleteId);
      addToast('Enquiry deleted successfully.', 'success');
      setDeleteId(null);
      loadEnquiries();
    } catch (err) {
      addToast('Failed to delete enquiry.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const exportCSV = () => {
    if (enquiries.length === 0) return;
    const headers = ["ID", "Full Name", "Email", "Phone", "Destination", "Travelers", "Travel Date", "Status", "Source", "Date Created"];
    const rows = filtered.map(e => [
      e.id,
      `"${e.fullName}"`,
      `"${e.email}"`,
      `"${e.phone}"`,
      `"${e.destination || ''}"`,
      `"${e.travelers || ''}"`,
      `"${e.travelDate || ''}"`,
      `"${e.status}"`,
      `"${e.source || ''}"`,
      `"${new Date(e.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Roamora_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Enquiries exported to CSV.', 'success');
  };

  const filtered = enquiries.filter(e => {
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchesSearch = !search ||
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search) ||
      (e.destination && e.destination.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'New': return 'terracotta';
      case 'Contacted': return 'warning';
      case 'Follow-up': return 'info';
      case 'Confirmed': return 'olive';
      case 'Lost': return 'danger';
      default: return 'navy';
    }
  };

  const columns = [
    {
      title: 'Client', key: 'fullName', render: (row) => (
        <div>
          <strong style={{ color: 'var(--adriatic)', display: 'block' }}>{row.fullName}</strong>
          <span style={{ fontSize: '0.8rem', color: '#666' }}>{row.email}</span>
        </div>
      )
    },
    { title: 'Phone', key: 'phone' },
    { title: 'Destination', key: 'destination', render: (row) => row.destination || 'N/A' },
    { title: 'Travelers', key: 'travelers', render: (row) => row.travelers || '2 Adults' },
    { title: 'Status', key: 'status', render: (row) => <Badge variant={getStatusBadgeVariant(row.status)}>{row.status}</Badge> },
    { title: 'Submitted', key: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    {
      title: 'Actions', key: 'id', render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="sm" variant="secondary" icon={Eye} onClick={() => handleOpenDrawer(row)} />
          <Button size="sm" variant="primary" icon={Trash2} onClick={() => setDeleteId(row.id)} />
        </div>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Manage Enquiries | Roamora Admin</title>
      </Helmet>

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', margin: 0 }}>
            Client Enquiries Management
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Track, assign statuses, and manage internal notes for luxury travel enquiries.
          </p>
        </div>
        <Button variant="gold" icon={Download} onClick={exportCSV}>
          Export CSV
        </Button>
      </div>

      <div className="table-toolbar">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input
              type="text"
              placeholder="Search client, email, destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '38px', height: '38px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {['All', 'New', 'Contacted', 'Follow-up', 'Confirmed', 'Lost'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--border-radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: statusFilter === st ? 'var(--gold)' : 'var(--sage)',
                  backgroundColor: statusFilter === st ? 'var(--gold)' : 'var(--white)',
                  color: statusFilter === st ? 'var(--adriatic)' : 'var(--espresso)',
                  cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <span style={{ fontSize: '0.85rem', color: '#666' }}>Showing {filtered.length} entries</span>
      </div>

      <Table columns={columns} data={filtered} />

      {/* Detail & Notes Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Enquiry Detail & Management">
        {activeEnquiry && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--ivory)', padding: '1.25rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--sage)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>Enquiry #{activeEnquiry.id}</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--adriatic)', margin: '0.25rem 0 0.5rem' }}>{activeEnquiry.fullName}</h3>
              <div style={{ fontSize: '0.9rem', color: '#555', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> {activeEnquiry.email}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> {activeEnquiry.phone}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> Travel Date: {activeEnquiry.travelDate || 'Not specified'}</div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--white)', padding: '1.25rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--sage)' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--adriatic)', marginBottom: '0.5rem' }}>
                Requested Details
              </h4>
              <div style={{ fontSize: '0.9rem', color: '#444' }}>
                <div><strong>Destination:</strong> {activeEnquiry.destination || 'General Inquiry'}</div>
                <div><strong>Travelers:</strong> {activeEnquiry.travelers || '2 Adults'}</div>
                <div><strong>Source:</strong> {activeEnquiry.source || 'Website'}</div>
                <div style={{ marginTop: '0.75rem', fontStyle: 'italic', color: '#666', borderLeft: '3px solid var(--gold)', paddingLeft: '0.75rem' }}>
                  "{activeEnquiry.notes || 'No initial message provided.'}"
                </div>
              </div>
            </div>

            {/* Status Update & Internal Notes Form */}
            <div style={{ backgroundColor: 'var(--cream)', padding: '1.25rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--gold)' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
                Status & Internal Notes
              </h4>
              <FormField
                label="Assign Status"
                name="status"
                type="select"
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                options={['New', 'Contacted', 'Follow-up', 'Confirmed', 'Lost']}
              />
              <FormField
                label="Internal Concierge Notes"
                name="notes"
                type="textarea"
                rows={3}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Log phone calls, quote amounts, villa availability..."
              />
              <Button variant="primary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={handleUpdateStatus}>
                Update Enquiry
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Enquiry"
        message="Are you sure you want to delete this client enquiry?"
        loading={isDeleting}
      />
    </>
  );
}
