import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { AdminSidebar } from './AdminSidebar.jsx';
import { AdminTopbar } from './AdminTopbar.jsx';
import { ToastContainer } from '../common/Toast.jsx';

export function AdminLayout({ pageTitle = "Admin Dashboard" }) {
  const { isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="admin-main">
        <AdminTopbar pageTitle={pageTitle} setMobileOpen={setMobileOpen} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
