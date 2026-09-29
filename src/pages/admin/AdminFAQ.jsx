import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, HelpCircle } from 'lucide-react';
import { Table } from '../../components/common/Table.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FormField } from '../../components/common/FormField.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { ConfirmDialog } from '../../components/common/ConfirmDialog.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function AdminFAQ() {
  const { addToast } = useApp();

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialForm = {
    category: 'Booking & Reservations',
    question: '',
    answer: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const loadFaqs = async () => {
    setLoading(true);
    try {
      const data = await api.getFaqs();
      setFaqs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f) => {
    setEditingFaq(f);
    setFormData(f);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      addToast('Please enter both question and answer.', 'error');
      return;
    }

    try {
      await api.saveFaq(formData);
      addToast(`FAQ ${editingFaq ? 'updated' : 'added'} successfully!`, 'success');
      setIsModalOpen(false);
      loadFaqs();
    } catch (err) {
      addToast('Failed to save FAQ.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.deleteFaq(deleteId);
      addToast('FAQ deleted.', 'success');
      setDeleteId(null);
      loadFaqs();
    } catch (err) {
      addToast('Failed to delete FAQ.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { title: 'Question', key: 'question', render: (row) => <strong>{row.question}</strong> },
    { title: 'Category', key: 'category', render: (row) => <Badge variant="gold">{row.category}</Badge> },
    { title: 'Answer', key: 'answer', render: (row) => <span style={{ fontSize: '0.85rem', color: '#555', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{row.answer}</span> },
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
        <title>Manage FAQs | Roamora Admin</title>
      </Helmet>

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', margin: 0 }}>
            Frequently Asked Questions Management
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Create and edit FAQ items for the public website.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add FAQ
        </Button>
      </div>

      <Table columns={columns} data={faqs} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingFaq ? "Edit FAQ" : "Add FAQ"}>
        <form onSubmit={handleFormSubmit}>
          <FormField
            label="Category"
            name="category"
            type="select"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={['Booking & Reservations', 'Payments & Cancellation', 'Visas & Travel Insurance', 'On-Trip Concierge', 'Corporate & Groups']}
          />

          <FormField
            label="Question"
            name="question"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            required
          />

          <FormField
            label="Answer"
            name="answer"
            type="textarea"
            rows={4}
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--sage)' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save FAQ</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ item?"
        loading={isDeleting}
      />
    </>
  );
}
