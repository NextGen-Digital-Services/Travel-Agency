import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { Modal } from '../../components/common/Modal.jsx';
import { FormField } from '../../components/common/FormField.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { ConfirmDialog } from '../../components/common/ConfirmDialog.jsx';
import { SmartImage } from '../../components/common/SmartImage.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function AdminGallery() {
  const { addToast } = useApp();

  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialForm = {
    title: '',
    category: 'Italy',
    image: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await api.getGallery();
      setGallery(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      addToast('Please enter title and image URL.', 'error');
      return;
    }

    try {
      await api.saveGalleryItem(formData);
      addToast('Photo added to gallery!', 'success');
      setIsModalOpen(false);
      setFormData(initialForm);
      loadGallery();
    } catch (err) {
      addToast('Failed to add photo.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.deleteGalleryItem(deleteId);
      addToast('Photo deleted.', 'success');
      setDeleteId(null);
      loadGallery();
    } catch (err) {
      addToast('Failed to delete photo.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Gallery | Roamora Admin</title>
      </Helmet>

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', margin: 0 }}>
            Photo Gallery Management
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Upload, categorize, and delete luxury photo gallery items.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Photo
        </Button>
      </div>

      <div className="cards-grid">
        {gallery.map((item) => (
          <div key={item.id} className="travel-card" style={{ position: 'relative' }}>
            <div className="card-image-box">
              <SmartImage src={item.image} alt={item.title} aspectRatio="4/3" />
              <div className="card-badge">
                <Badge variant="gold">{item.category}</Badge>
              </div>
            </div>
            <div className="card-body" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: 'var(--adriatic)', fontSize: '1rem' }}>{item.title}</strong>
              <Button size="sm" variant="primary" icon={Trash2} onClick={() => setDeleteId(item.id)} />
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Gallery Photo">
        <form onSubmit={handleFormSubmit}>
          <FormField
            label="Photo Title / Caption"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Positano Cliffside Sunset"
            required
          />

          <FormField
            label="Category"
            name="category"
            type="select"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={['Italy', 'Greece', 'Maldives', 'Dubai', 'Switzerland', 'Bali', 'France', 'India', 'Japan']}
          />

          <FormField
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--sage)' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Upload Photo</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Photo"
        message="Are you sure you want to delete this photo from the gallery?"
        loading={isDeleting}
      />
    </>
  );
}
