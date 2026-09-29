import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Search, BookOpen, Bold, Italic, Heading, Quote } from 'lucide-react';
import { Table } from '../../components/common/Table.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FormField } from '../../components/common/FormField.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { ConfirmDialog } from '../../components/common/ConfirmDialog.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function AdminBlog() {
  const { addToast } = useApp();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialForm = {
    title: '',
    category: 'Destination Guides',
    author: 'Elena Rostova',
    image: '',
    excerpt: '',
    content: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await api.getBlogs();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBlog(b);
    setFormData(b);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      addToast('Please fill in title and article content.', 'error');
      return;
    }

    try {
      await api.saveBlog(formData);
      addToast(`Article ${editingBlog ? 'updated' : 'published'} successfully!`, 'success');
      setIsModalOpen(false);
      loadBlogs();
    } catch (err) {
      addToast('Failed to save article.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.deleteBlog(deleteId);
      addToast('Article deleted.', 'success');
      setDeleteId(null);
      loadBlogs();
    } catch (err) {
      addToast('Failed to delete article.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Simple Rich Text Formatting Toolbar Helper
  const appendFormat = (symbol) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + `\n${symbol} `
    }));
  };

  const filtered = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Article Title', key: 'title', render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={row.image} alt={row.title} style={{ width: '48px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
          <div>
            <strong style={{ color: 'var(--adriatic)', display: 'block' }}>{row.title}</strong>
            <span style={{ fontSize: '0.78rem', color: '#777' }}>By {row.author}</span>
          </div>
        </div>
      )
    },
    { title: 'Category', key: 'category', render: (row) => <Badge variant="olive">{row.category}</Badge> },
    { title: 'Publish Date', key: 'date' },
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
        <title>Manage Travel Journal | Roamora Admin</title>
      </Helmet>

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', margin: 0 }}>
            Travel Journal & Editorial Blog
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Publish, edit, and categorize travel editorial guides.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          New Article
        </Button>
      </div>

      <div className="table-toolbar">
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Search article title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '38px', height: '38px' }}
          />
        </div>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>Total: {filtered.length} articles</span>
      </div>

      <Table columns={columns} data={filtered} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBlog ? "Edit Journal Article" : "Create Article"} maxWidth="720px">
        <form onSubmit={handleFormSubmit}>
          <FormField
            label="Article Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField
              label="Category"
              name="category"
              type="select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={['Destination Guides', 'Luxury Travel', 'Food & Wine', 'Travel Tips', 'Honeymoon', 'Culture']}
            />
            <FormField
              label="Author Name"
              name="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
          </div>

          <FormField
            label="Cover Image URL"
            name="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://..."
          />

          <FormField
            label="Short Excerpt"
            name="excerpt"
            type="textarea"
            rows={2}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          />

          {/* Simple Rich Formatting Toolbar */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="form-label" style={{ margin: 0 }}>Article Content</label>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button type="button" onClick={() => appendFormat('##')} className="btn btn-secondary btn-sm" title="Add Subheading"><Heading size={14} /></button>
                <button type="button" onClick={() => appendFormat('**')} className="btn btn-secondary btn-sm" title="Add Bold text"><Bold size={14} /></button>
                <button type="button" onClick={() => appendFormat('>')} className="btn btn-secondary btn-sm" title="Add Pull Quote"><Quote size={14} /></button>
              </div>
            </div>
            <textarea
              className="form-control"
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--sage)' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Publish Article</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Article"
        message="Are you sure you want to delete this journal article?"
        loading={isDeleting}
      />
    </>
  );
}
