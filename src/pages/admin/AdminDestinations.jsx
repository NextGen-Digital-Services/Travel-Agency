import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Search, MapPin } from 'lucide-react';
import { Table } from '../../components/common/Table.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FormField } from '../../components/common/FormField.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { ConfirmDialog } from '../../components/common/ConfirmDialog.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function AdminDestinations() {
  const { addToast } = useApp();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState(null);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialForm = {
    name: '',
    region: 'Europe',
    country: '',
    image: '',
    description: '',
    bestTimeToVisit: 'April to October',
    highlights: ['Luxury Villa Stay', 'Private Excursions'],
    featured: true
  };
  const [formData, setFormData] = useState(initialForm);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const data = await api.getDestinations();
      setDestinations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const handleOpenAdd = () => {
    setEditingDest(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dest) => {
    setEditingDest(dest);
    setFormData({ ...dest, highlights: dest.highlights || [] });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.country) {
      addToast('Please provide destination name and country.', 'error');
      return;
    }

    try {
      await api.saveDestination(formData);
      addToast(`Destination ${editingDest ? 'updated' : 'created'} successfully!`, 'success');
      setIsModalOpen(false);
      loadDestinations();
    } catch (err) {
      addToast('Failed to save destination.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.deleteDestination(deleteId);
      addToast('Destination deleted successfully.', 'success');
      setDeleteId(null);
      loadDestinations();
    } catch (err) {
      addToast('Failed to delete destination.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.country.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Destination', key: 'name', render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={row.image} alt={row.name} style={{ width: '48px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
          <div>
            <strong style={{ color: 'var(--adriatic)', display: 'block' }}>{row.name}</strong>
            <span style={{ fontSize: '0.78rem', color: '#777' }}>{row.country}</span>
          </div>
        </div>
      )
    },
    { title: 'Region', key: 'region', render: (row) => <Badge variant="gold">{row.region}</Badge> },
    { title: 'Best Time', key: 'bestTimeToVisit' },
    {
      title: 'Featured', key: 'featured', render: (row) => (
        <Badge variant={row.featured ? 'success' : 'navy'}>{row.featured ? 'Yes' : 'No'}</Badge>
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
        <title>Manage Destinations | Roamora Admin</title>
      </Helmet>

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', margin: 0 }}>
            Destination Management
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Add, edit, or remove global destinations and regional highlights.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add Destination
        </Button>
      </div>

      <div className="table-toolbar">
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Search destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '38px', height: '38px' }}
          />
        </div>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>Total: {filtered.length} destinations</span>
      </div>

      <Table columns={columns} data={filtered} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDest ? "Edit Destination" : "Create Destination"}>
        <form onSubmit={handleFormSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField
              label="Destination Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <FormField
              label="Country"
              name="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField
              label="Region"
              name="region"
              type="select"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              options={['Europe', 'Asia', 'Middle East', 'International', 'India']}
            />
            <FormField
              label="Best Time To Visit"
              name="bestTimeToVisit"
              value={formData.bestTimeToVisit}
              onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
            />
          </div>

          <FormField
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://..."
          />

          <FormField
            label="Description"
            name="description"
            type="textarea"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              Featured Destination on Home Page
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--sage)' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Destination</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Destination"
        message="Are you sure you want to delete this destination?"
        loading={isDeleting}
      />
    </>
  );
}
