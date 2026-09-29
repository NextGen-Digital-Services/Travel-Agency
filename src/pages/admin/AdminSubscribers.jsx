import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Download, Trash2, Search } from 'lucide-react';
import { Table } from '../../components/common/Table.jsx';
import { Button } from '../../components/common/Button.jsx';
import { ConfirmDialog } from '../../components/common/ConfirmDialog.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api, subscribeToDataChange } from '../../services/api.js';

export function AdminSubscribers() {
  const { addToast } = useApp();

  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const data = await api.getSubscribers();
      setSubscribers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
    const unsub = subscribeToDataChange(() => {
      loadSubscribers();
    });
    return () => unsub();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.deleteSubscriber(deleteId);
      addToast('Subscriber removed.', 'success');
      setDeleteId(null);
      loadSubscribers();
    } catch (err) {
      addToast('Failed to delete subscriber.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const exportCSV = () => {
    if (subscribers.length === 0) return;
    const headers = ["ID", "Email Address", "Subscribed At"];
    const rows = filtered.map(s => [s.id, `"${s.email}"`, `"${s.subscribedAt}"`]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Roamora_Subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Subscribers exported to CSV.', 'success');
  };

  const filtered = subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { title: 'Email Address', key: 'email', render: (row) => <strong>{row.email}</strong> },
    { title: 'Subscribed Date', key: 'subscribedAt' },
    {
      title: 'Action', key: 'id', render: (row) => (
        <Button size="sm" variant="primary" icon={Trash2} onClick={() => setDeleteId(row.id)} />
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Newsletter Subscribers | Roamora Admin</title>
      </Helmet>

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', margin: 0 }}>
            Newsletter Subscribers
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            List of clients opted into newsletter updates.
          </p>
        </div>
        <Button variant="gold" icon={Download} onClick={exportCSV}>
          Export CSV
        </Button>
      </div>

      <div className="table-toolbar">
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Search email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '38px', height: '38px' }}
          />
        </div>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>Total: {filtered.length} subscribers</span>
      </div>

      <Table columns={columns} data={filtered} />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Subscriber"
        message="Are you sure you want to remove this email address from the newsletter list?"
        loading={isDeleting}
      />
    </>
  );
}
