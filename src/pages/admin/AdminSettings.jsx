import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { FormField } from '../../components/common/FormField.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function AdminSettings() {
  const { addToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    companyName: 'Roamora Travels',
    logoText: 'ROAMORA',
    tagline: 'Your Journey. Our Expertise.',
    phone: '[+91 XXXXX XXXXX]',
    email: '[info@yourdomain.com]',
    whatsapp: '[+91 XXXXX XXXXX]',
    address: '[Office Address]',
    workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    heroHeadline: 'Crafting Unforgettable Journeys Across The Globe',
    heroSubtext: 'Immerse yourself in handpicked luxury travel experiences curated by seasoned world travel experts.',
    statsTravelers: '15,000+',
    statsDestinations: '85+',
    statsPackages: '120+',
    statsYears: '14+',
    seoTitle: 'Roamora Travels | Luxury Travel Agency & Bespoke Holidays',
    seoDescription: 'Experience bespoke luxury itineraries...'
  });

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const data = await api.getSettings();
        if (data) setForm(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(form);
      addToast('Site settings updated! Changes reflect live across the website.', 'success');
    } catch (err) {
      addToast('Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <>
      <Helmet>
        <title>Site Settings | Roamora Admin</title>
      </Helmet>

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', margin: 0 }}>
            Global Site Settings
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Configure brand text, bracket contact info placeholders, hero banners, and SEO tags.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Brand Information */}
        <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--gold)', marginBottom: '1.25rem', borderBottom: '1px solid var(--sage)', paddingBottom: '0.5rem' }}>
            Brand & Logo Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <FormField label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} required />
            <FormField label="Logo Header Text" name="logoText" value={form.logoText} onChange={handleChange} required />
            <FormField label="Tagline" name="tagline" value={form.tagline} onChange={handleChange} required />
          </div>
        </div>

        {/* Contact Information */}
        <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--gold)', marginBottom: '1.25rem', borderBottom: '1px solid var(--sage)', paddingBottom: '0.5rem' }}>
            Contact & Address Details (Editable Bracket Placeholders)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Phone Placeholder" name="phone" value={form.phone} onChange={handleChange} helpText="e.g. [+91 XXXXX XXXXX]" required />
            <FormField label="Email Placeholder" name="email" value={form.email} onChange={handleChange} helpText="e.g. [info@yourdomain.com]" required />
            <FormField label="WhatsApp Phone" name="whatsapp" value={form.whatsapp} onChange={handleChange} helpText="e.g. [+91 XXXXX XXXXX]" required />
            <FormField label="Working Hours" name="workingHours" value={form.workingHours} onChange={handleChange} required />
          </div>
          <FormField label="Office Address" name="address" value={form.address} onChange={handleChange} helpText="e.g. [Office Address, Luxury Towers...]" required />
        </div>

        {/* Social Media Links */}
        <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--gold)', marginBottom: '1.25rem', borderBottom: '1px solid var(--sage)', paddingBottom: '0.5rem' }}>
            Social Media Links
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Facebook URL" name="facebook" value={form.facebook} onChange={handleChange} />
            <FormField label="Instagram URL" name="instagram" value={form.instagram} onChange={handleChange} />
            <FormField label="Twitter URL" name="twitter" value={form.twitter} onChange={handleChange} />
            <FormField label="LinkedIn URL" name="linkedin" value={form.linkedin} onChange={handleChange} />
          </div>
        </div>

        {/* Hero & Statistics */}
        <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--gold)', marginBottom: '1.25rem', borderBottom: '1px solid var(--sage)', paddingBottom: '0.5rem' }}>
            Hero Banner & Statistics Counters
          </h3>
          <FormField label="Hero Headline" name="heroHeadline" value={form.heroHeadline} onChange={handleChange} required />
          <FormField label="Hero Subtext" name="heroSubtext" type="textarea" rows={2} value={form.heroSubtext} onChange={handleChange} required />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <FormField label="Travelers Count" name="statsTravelers" value={form.statsTravelers} onChange={handleChange} />
            <FormField label="Destinations Count" name="statsDestinations" value={form.statsDestinations} onChange={handleChange} />
            <FormField label="Packages Count" name="statsPackages" value={form.statsPackages} onChange={handleChange} />
            <FormField label="Years Experience" name="statsYears" value={form.statsYears} onChange={handleChange} />
          </div>
        </div>

        {/* SEO Configuration */}
        <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--gold)', marginBottom: '1.25rem', borderBottom: '1px solid var(--sage)', paddingBottom: '0.5rem' }}>
            Global SEO Metadata
          </h3>
          <FormField label="Default SEO Page Title" name="seoTitle" value={form.seoTitle} onChange={handleChange} required />
          <FormField label="Default Meta Description" name="seoDescription" type="textarea" rows={2} value={form.seoDescription} onChange={handleChange} required />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Button variant="primary" type="submit" size="lg" loading={saving} icon={Save}>
            Save All Settings
          </Button>
        </div>
      </form>
    </>
  );
}
