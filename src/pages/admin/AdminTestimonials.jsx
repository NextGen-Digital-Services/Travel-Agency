import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Star, CheckCircle2, XCircle } from 'lucide-react';
import { Table } from '../../components/common/Table.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FormField } from '../../components/common/FormField.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { ConfirmDialog } from '../../components/common/ConfirmDialog.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function AdminTestimonials() {
  const { addToast } = useApp();

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialForm = {
    name: '',
    location: '',
    packageTitle: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    quote: '',
    status: 'approved'
  };
  const [formData, setFormData] = useState(initialForm);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const data = await api.getTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setEditingTest(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTest(t);
    setFormData(t);
    setIsModalOpen(true);
  };

  const toggleStatus = async (t) => {
    const newStatus = t.status === 'approved' ? 'hidden' : 'approved';
    try {
      await api.saveTestimonial({ ...t, status: newStatus });
      addToast(`Testimonial ${newStatus === 'approved' ? 'approved' : 'hidden'}.`, 'success');
      loadTestimonials();
    } catch (err) {
      addToast('Failed to toggle status.', 'error');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quote) {
      addToast('Please provide traveler name and review text.', 'error');
      return;
    }

    try {
      await api.saveTestimonial(formData);
      addToast(`Testimonial ${editingTest ? 'updated' : 'created'} successfully!`, 'success');
      setIsModalOpen(false);
      loadTestimonials();
    } catch (err) {
      addToast('Failed to save testimonial.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.deleteTestimonial(deleteId);
      addToast('Testimonial deleted.', 'success');
      setDeleteId(null);
      loadTestimonials();
    } catch (err) {
      addToast('Failed to delete testimonial.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      title: 'Traveler', key: 'name', render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={row.avatar} alt={row.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <strong style={{ color: 'var(--adriatic)', display: 'block' }}>{row.name}</strong>
            <span style={{ fontSize: '0.78rem', color: '#777' }}>{row.location}</span>
          </div>
        </div>
      )
    },
    { title: 'Package', key: 'packageTitle' },
    {
      title: 'Rating', key: 'rating', render: (row) => (
        <div style={{ display: 'flex', gap: '2px', color: 'var(--gold)' }}>
          {Array.from({ length: row.rating || 5 }).map((_, i) => <Star key={i} size={14} fill="var(--gold)" />)}
        </div>
      )
    },
    {
      title: 'Status', key: 'status', render: (row) => (
        <button onClick={() => toggleStatus(row)} style={{ cursor: 'pointer' }}>
          <Badge variant={row.status === 'approved' ? 'success' : 'danger'}>
            {row.status === 'approved' ? 'Approved' : 'Hidden'}
          </Badge>
        </button>
      )
    },
    {
      title: 'Actions', key: 'id', render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="sm" variant="secondary" icon={Edit} onClick={() => handleOpenEdit(row)} />
          <Button size="sm" variant="primary" icon={Trash2} onClick={() => setDeleteId(row.id)} />
        </div>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Manage Testimonials | Roamora Admin</title>
      </Helmet>

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', margin: 0 }}>
            Testimonials & Reviews
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Approve, edit, or hide guest reviews for the public website.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add Review
        </Button>
      </div>

      <Table columns={columns} data={testimonials} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTest ? "Edit Testimonial" : "Add Testimonial"}>
        <form onSubmit={handleFormSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField
              label="Traveler Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <FormField
              label="Location"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField
              label="Package Title"
              name="packageTitle"
              value={formData.packageTitle}
              onChange={(e) => setFormData({ ...formData, packageTitle: e.target.value })}
            />
            <FormField
              label="Rating"
              name="rating"
              type="select"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              options={[{ label: '5 Stars ★★★★★', value: 5 }, { label: '4 Stars ★★★★☆', value: 4 }]}
            />
          </div>

          <FormField
            label="Avatar Image URL"
            name="avatar"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
          />

          <FormField
            label="Review Quote"
            name="quote"
            type="textarea"
            rows={4}
            value={formData.quote}
            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--sage)' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Review</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Testimonial"
        message="Are you sure you want to delete this review?"
        loading={isDeleting}
      />
    </>
  );
}
