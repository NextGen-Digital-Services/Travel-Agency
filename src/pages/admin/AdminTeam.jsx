import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, UserCheck } from 'lucide-react';
import { Table } from '../../components/common/Table.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { FormField } from '../../components/common/FormField.jsx';
import { Button } from '../../components/common/Button.jsx';
import { ConfirmDialog } from '../../components/common/ConfirmDialog.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function AdminTeam() {
  const { addToast } = useApp();

  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialForm = {
    name: '',
    role: '',
    bio: '',
    image: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const data = await api.getTeam();
      setTeam(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m) => {
    setEditingMember(m);
    setFormData(m);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      addToast('Please enter name and role.', 'error');
      return;
    }

    try {
      await api.saveTeamMember(formData);
      addToast(`Team member ${editingMember ? 'updated' : 'added'} successfully!`, 'success');
      setIsModalOpen(false);
      loadTeam();
    } catch (err) {
      addToast('Failed to save team member.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.deleteTeamMember(deleteId);
      addToast('Team member deleted.', 'success');
      setDeleteId(null);
      loadTeam();
    } catch (err) {
      addToast('Failed to delete team member.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      title: 'Member', key: 'name', render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={row.image} alt={row.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <strong style={{ color: 'var(--adriatic)', display: 'block' }}>{row.name}</strong>
            <span style={{ fontSize: '0.78rem', color: '#777' }}>{row.role}</span>
          </div>
        </div>
      )
    },
    { title: 'Bio', key: 'bio', render: (row) => <span style={{ fontSize: '0.85rem', color: '#555' }}>{row.bio}</span> },
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
        <title>Manage Team | Roamora Admin</title>
      </Helmet>

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', margin: 0 }}>
            Team Management
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Manage About page leadership team members.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add Member
        </Button>
      </div>

      <Table columns={columns} data={team} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMember ? "Edit Team Member" : "Add Team Member"}>
        <form onSubmit={handleFormSubmit}>
          <FormField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <FormField
            label="Role Title"
            name="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="Head of European Journeys"
            required
          />

          <FormField
            label="Photo Image URL"
            name="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://..."
          />

          <FormField
            label="Bio Description"
            name="bio"
            type="textarea"
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--sage)' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Member</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Team Member"
        message="Are you sure you want to delete this team member?"
        loading={isDeleting}
      />
    </>
  );
}
