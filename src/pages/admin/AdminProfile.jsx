import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, Lock, Save, Key } from 'lucide-react';
import { FormField } from '../../components/common/FormField.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApp } from '../../context/AppContext.jsx';

export function AdminProfile() {
  const { adminUser, updateProfile } = useAuth();
  const { addToast } = useApp();

  const [profileForm, setProfileForm] = useState({
    name: adminUser?.name || 'Matteo Bellini',
    email: adminUser?.email || 'admin@roamora.com',
    avatar: adminUser?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
  });

  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      updateProfile(profileForm);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast('Failed to update profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePassSubmit = (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      addToast('New passwords do not match!', 'error');
      return;
    }
    if (passForm.newPassword.length < 6) {
      addToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setSavingPass(true);
    setTimeout(() => {
      addToast('Password changed successfully!', 'success');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSavingPass(false);
    }, 600);
  };

  return (
    <>
      <Helmet>
        <title>Admin Profile & Password | Roamora Admin</title>
      </Helmet>

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', margin: 0 }}>
            Profile & Security
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Manage your administrator profile details and change account password.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Profile Card */}
        <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--adriatic)', marginBottom: '1.5rem', borderBottom: '1px solid var(--sage)', paddingBottom: '0.5rem' }}>
            Administrator Profile
          </h3>
          <form onSubmit={handleProfileSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <img
                src={profileForm.avatar}
                alt="Avatar"
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold)' }}
              />
              <div style={{ flexGrow: 1 }}>
                <FormField
                  label="Avatar Image URL"
                  name="avatar"
                  value={profileForm.avatar}
                  onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                />
              </div>
            </div>

            <FormField
              label="Full Name"
              name="name"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              required
            />

            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              required
            />

            <Button variant="primary" type="submit" loading={savingProfile} icon={Save} style={{ width: '100%', marginTop: '1rem' }}>
              Update Profile Details
            </Button>
          </form>
        </div>

        {/* Change Password Card */}
        <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--adriatic)', marginBottom: '1.5rem', borderBottom: '1px solid var(--sage)', paddingBottom: '0.5rem' }}>
            Change Password
          </h3>
          <form onSubmit={handlePassSubmit}>
            <FormField
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passForm.currentPassword}
              onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
              icon={Lock}
              required
            />

            <FormField
              label="New Password"
              name="newPassword"
              type="password"
              value={passForm.newPassword}
              onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
              icon={Key}
              required
            />

            <FormField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passForm.confirmPassword}
              onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
              icon={Key}
              required
            />

            <Button variant="gold" type="submit" loading={savingPass} icon={Save} style={{ width: '100%', marginTop: '1rem' }}>
              Change Password
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
