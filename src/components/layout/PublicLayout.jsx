import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { FloatingWhatsApp } from './FloatingWhatsApp.jsx';
import { ScrollToTop } from './ScrollToTop.jsx';
import { EnquiryModal } from './EnquiryModal.jsx';
import { ToastContainer } from '../common/Toast.jsx';

export function PublicLayout() {
  return (
    <div className="public-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <EnquiryModal />
      <ToastContainer />
    </div>
  );
}
