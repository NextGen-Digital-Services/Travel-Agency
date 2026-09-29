import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Search, Image as ImageIcon, Check, X } from 'lucide-react';
import { Table } from '../../components/common/Table.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FormField } from '../../components/common/FormField.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { ConfirmDialog } from '../../components/common/ConfirmDialog.jsx';
import { Pagination } from '../../components/common/Pagination.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function AdminPackages() {
  const { addToast } = useApp();

  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);

  // Confirm Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const initialForm = {
    title: '',
    destinationName: '',
    theme: 'Luxury',
    duration: '7 Days / 6 Nights',
    price: 2500,
    image: '',
    overview: '',
    inclusions: ['5-Star Hotel Stay', 'Private Transfers', 'Daily Breakfast'],
    exclusions: ['International Flights', 'Personal Expenses'],
    itinerary: [
      { day: 1, title: 'Arrival & Welcome', detail: 'Chauffeur pickup and hotel check-in.' },
      { day: 2, title: 'Guided Sightseeing', detail: 'Private tour of key historic landmarks.' }
    ],
    featured: false,
    active: true
  };
  const [formData, setFormData] = useState(initialForm);

  const loadPackagesData = async () => {
    setLoading(true);
    try {
      const pkgs = await api.getPackages();
      const dests = await api.getDestinations();
      setPackages(pkgs);
      setDestinations(dests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackagesData();
  }, []);

  // Image Upload via FileReader to base64 preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAdd = () => {
    setEditingPkg(null);
    setFormData(initialForm);
    if (destinations.length > 0) {
      setFormData(prev => ({ ...prev, destinationName: destinations[0].name }));
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPkg(pkg);
    setFormData({
      ...pkg,
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      itinerary: pkg.itinerary || []
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.destinationName) {
      addToast('Please enter a package title and select a destination.', 'error');
      return;
    }

    try {
      await api.savePackage(formData);
      addToast(`Package ${editingPkg ? 'updated' : 'created'} successfully!`, 'success');
      setIsModalOpen(false);
      loadPackagesData();
    } catch (err) {
      addToast('Failed to save package.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.deletePackage(deleteId);
      addToast('Package deleted successfully.', 'success');
      setDeleteId(null);
      loadPackagesData();
    } catch (err) {
      addToast('Failed to delete package.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Itinerary Item Helpers
  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: 'New Excursion Day', detail: 'Details of the day excursion.' }
      ]
    }));
  };

  const removeItineraryDay = (index) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((item, idx) => ({ ...item, day: idx + 1 }))
    }));
  };

  const filteredPackages = packages.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.destinationName.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Package', key: 'title', render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={row.image} alt={row.title} style={{ width: '48px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
          <div>
            <strong style={{ color: 'var(--adriatic)', display: 'block' }}>{row.title}</strong>
            <span style={{ fontSize: '0.78rem', color: '#777' }}>{row.destinationName}</span>
          </div>
        </div>
      )
    },
    { title: 'Theme', key: 'theme', render: (row) => <Badge variant="terracotta">{row.theme}</Badge> },
    { title: 'Duration', key: 'duration' },
    { title: 'Price', key: 'price', render: (row) => <strong>${row.price?.toLocaleString()}</strong> },
    {
      title: 'Status', key: 'active', render: (row) => (
        <Badge variant={row.active ? 'success' : 'danger'}>{row.active ? 'Active' : 'Inactive'}</Badge>
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
        <title>Manage Packages | Roamora Admin</title>
      </Helmet>

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', margin: 0 }}>
            Package Management
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Create, edit, or remove luxury holiday packages.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add New Package
        </Button>
      </div>

      <div className="table-toolbar">
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Search package name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '38px', height: '38px' }}
          />
        </div>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>Total: {filteredPackages.length} packages</span>
      </div>

      <Table columns={columns} data={filteredPackages} />

      {/* Add / Edit Package Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPkg ? "Edit Package" : "Create New Package"} maxWidth="720px">
        <form onSubmit={handleFormSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField
              label="Package Title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <FormField
              label="Destination"
              name="destinationName"
              type="select"
              value={formData.destinationName}
              onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
              options={destinations.map(d => ({ label: d.name, value: d.name }))}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <FormField
              label="Theme"
              name="theme"
              type="select"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              options={['Luxury', 'Honeymoon', 'Family', 'Adventure', 'Pilgrimage', 'Group Tours']}
            />
            <FormField
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g. 8 Days / 7 Nights"
            />
            <FormField
              label="Price ($ USD)"
              name="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
            />
          </div>

          {/* Image Upload with Preview */}
          <div className="form-group">
            <label className="form-label">Cover Image</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="form-control" />
              {formData.image && (
                <img src={formData.image} alt="Preview" style={{ width: '60px', height: '44px', borderRadius: '4px', objectFit: 'cover' }} />
              )}
            </div>
            <FormField
              label="Or Image URL"
              name="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
              style={{ marginTop: '0.5rem' }}
            />
          </div>

          <FormField
            label="Overview Description"
            name="overview"
            type="textarea"
            rows={3}
            value={formData.overview}
            onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
          />

          {/* Itinerary Builder */}
          <div style={{ marginBottom: '1.5rem', border: '1px solid var(--sage)', padding: '1rem', borderRadius: 'var(--border-radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Day-by-Day Itinerary</label>
              <Button size="sm" variant="gold" onClick={addItineraryDay}>+ Add Day</Button>
            </div>
            {formData.itinerary.map((item, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const newItin = [...formData.itinerary];
                    newItin[idx].title = e.target.value;
                    setFormData({ ...formData, itinerary: newItin });
                  }}
                  className="form-control"
                  placeholder="Day Title"
                />
                <input
                  type="text"
                  value={item.detail}
                  onChange={(e) => {
                    const newItin = [...formData.itinerary];
                    newItin[idx].detail = e.target.value;
                    setFormData({ ...formData, itinerary: newItin });
                  }}
                  className="form-control"
                  placeholder="Day Details"
                />
                <button type="button" onClick={() => removeItineraryDay(idx)} style={{ color: 'var(--terracotta)' }}><X size={18} /></button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              Featured on Home Page
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              Active Listing
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--sage)' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Package</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Package"
        message="Are you sure you want to delete this package? It will no longer appear on the site."
        loading={isDeleting}
      />
    </>
  );
}
