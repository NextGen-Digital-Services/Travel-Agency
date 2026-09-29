import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  MapPin,
  FileText,
  CalendarCheck,
  Users,
  MessageSquare,
  BookOpen,
  Image,
  UserCheck,
  HelpCircle,
  Mail,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Logo } from '../common/Logo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export function AdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Packages', path: '/admin/packages', icon: Package },
    { label: 'Destinations', path: '/admin/destinations', icon: MapPin },
    { label: 'Enquiries', path: '/admin/enquiries', icon: FileText },
    { label: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { label: 'Travel Journal', path: '/admin/blog', icon: BookOpen },
    { label: 'Photo Gallery', path: '/admin/gallery', icon: Image },
    { label: 'Team Members', path: '/admin/team', icon: UserCheck },
    { label: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
    { label: 'Subscribers', path: '/admin/subscribers', icon: Mail },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
    { label: 'Profile & Auth', path: '/admin/profile', icon: User }
  ];

  const SidebarContent = () => (
    <>
      <div className="admin-sidebar-header">
        {!collapsed && <Logo light size="normal" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: 'var(--gold)', display: 'none' }}
          className="desktop-collapse-btn"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen && setMobileOpen(false)}
          >
            <item.icon size={18} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={logout}
          className="admin-nav-item"
          style={{ width: '100%', color: 'var(--terracotta)' }}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="admin-mobile-drawer" onClick={() => setMobileOpen(false)}>
          <div className="admin-mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
