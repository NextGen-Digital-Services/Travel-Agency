import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, User, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api, subscribeToDataChange } from '../../services/api.js';
import { useNavigate, NavLink } from 'react-router-dom';

export function AdminTopbar({ pageTitle, setMobileOpen }) {
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadEnquiries, setUnreadEnquiries] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const fetchNotificationCount = async () => {
    try {
      const list = await api.getEnquiries();
      const count = list.filter(e => e.status === 'New').length;
      setUnreadEnquiries(count);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotificationCount();
    const unsub = subscribeToDataChange(() => {
      fetchNotificationCount();
    });
    return () => unsub();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/admin/enquiries?search=${encodeURIComponent(globalSearch)}`);
    }
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          onClick={() => setMobileOpen(true)}
          style={{ color: 'var(--adriatic)', display: 'block' }}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--adriatic)', margin: 0 }}>
          {pageTitle}
        </h2>
      </div>

      <div className="admin-topbar-right">
        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="admin-search-input">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search enquiries, bookings..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </form>

        {/* View Public Website */}
        <NavLink
          to="/"
          target="_blank"
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold)' }}
          title="View Public Site"
        >
          <ExternalLink size={16} />
          <span className="hide-on-mobile">Live Site</span>
        </NavLink>

        {/* Notification Bell */}
        <div
          className="notification-bell"
          onClick={() => navigate('/admin/enquiries?filter=New')}
          title="New Enquiries"
        >
          <Bell size={20} color="var(--adriatic)" />
          {unreadEnquiries > 0 && (
            <span className="notification-badge">{unreadEnquiries}</span>
          )}
        </div>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <img
              src={adminUser?.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80"}
              alt="Admin Avatar"
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--gold)' }}
            />
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--adriatic)' }} className="hide-on-mobile">
              {adminUser?.name || 'Matteo Bellini'}
            </span>
          </button>

          {profileDropdownOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--border-radius-md)',
              boxShadow: 'var(--box-shadow-lg)',
              border: '1px solid var(--sage)',
              width: '180px',
              zIndex: 50,
              padding: '0.5rem 0'
            }}>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/admin/profile');
                }}
                style={{ width: '100%', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--espresso)', textAlign: 'left' }}
              >
                <User size={16} /> Edit Profile
              </button>
              <div style={{ height: '1px', backgroundColor: 'var(--sage)', margin: '0.35rem 0' }} />
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                }}
                style={{ width: '100%', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--terracotta)', textAlign: 'left' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
