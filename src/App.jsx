import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout.jsx';
import { AdminLayout } from './components/admin/AdminLayout.jsx';

// Public Pages
import { Home } from './pages/public/Home.jsx';
import { Destinations } from './pages/public/Destinations.jsx';
import { DestinationDetail } from './pages/public/DestinationDetail.jsx';
import { Packages } from './pages/public/Packages.jsx';
import { PackageDetail } from './pages/public/PackageDetail.jsx';
import { Services } from './pages/public/Services.jsx';
import { About } from './pages/public/About.jsx';
import { Gallery } from './pages/public/Gallery.jsx';
import { Blog } from './pages/public/Blog.jsx';
import { BlogDetail } from './pages/public/BlogDetail.jsx';
import { Testimonials } from './pages/public/Testimonials.jsx';
import { FAQ } from './pages/public/FAQ.jsx';
import { Contact } from './pages/public/Contact.jsx';
import { PrivacyPolicy } from './pages/public/PrivacyPolicy.jsx';
import { TermsConditions } from './pages/public/TermsConditions.jsx';
import { NotFound } from './pages/public/NotFound.jsx';

// Admin Pages
import { Login } from './pages/admin/Login.jsx';
import { Dashboard } from './pages/admin/Dashboard.jsx';
import { AdminPackages } from './pages/admin/AdminPackages.jsx';
import { AdminDestinations } from './pages/admin/AdminDestinations.jsx';
import { AdminEnquiries } from './pages/admin/AdminEnquiries.jsx';
import { AdminBookings } from './pages/admin/AdminBookings.jsx';
import { AdminCustomers } from './pages/admin/AdminCustomers.jsx';
import { AdminTestimonials } from './pages/admin/AdminTestimonials.jsx';
import { AdminBlog } from './pages/admin/AdminBlog.jsx';
import { AdminGallery } from './pages/admin/AdminGallery.jsx';
import { AdminTeam } from './pages/admin/AdminTeam.jsx';
import { AdminFAQ } from './pages/admin/AdminFAQ.jsx';
import { AdminSubscribers } from './pages/admin/AdminSubscribers.jsx';
import { AdminSettings } from './pages/admin/AdminSettings.jsx';
import { AdminProfile } from './pages/admin/AdminProfile.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public Website Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="destinations/:id" element={<DestinationDetail />} />
        <Route path="packages" element={<Packages />} />
        <Route path="packages/:id" element={<PackageDetail />} />
        <Route path="services" element={<Services />} />
        <Route path="about" element={<About />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogDetail />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-and-conditions" element={<TermsConditions />} />
      </Route>

      {/* Admin Auth Route */}
      <Route path="/admin/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="destinations" element={<AdminDestinations />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="team" element={<AdminTeam />} />
        <Route path="faqs" element={<AdminFAQ />} />
        <Route path="subscribers" element={<AdminSubscribers />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
