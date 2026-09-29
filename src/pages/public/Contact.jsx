import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { FormField } from '../../components/common/FormField.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function Contact() {
  const { settings, addToast } = useApp();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    destination: '',
    notes: '',
    source: 'Contact Page Form'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone) {
      addToast('Please complete all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitEnquiry(form);
      addToast('Thank you! Your message has been sent to our concierge desk.', 'success');
      setForm({
        fullName: '',
        email: '',
        phone: '',
        destination: '',
        notes: '',
        source: 'Contact Page Form'
      });
    } catch (err) {
      addToast('Failed to submit message.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Our Concierge Desk | Roamora Travels</title>
        <meta name="description" content="Get in touch with Roamora Travels. Speak directly with our regional travel specialists or visit our luxury concierge office." />
      </Helmet>

      {/* Header Banner */}
      <section className="section-padding bg-adriatic" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Direct Concierge Support"
            title="Get In Touch"
            subtitle="We are delighted to assist you with custom itinerary planning, flight Desk inquiries, or luxury villa bookings."
            light
          />
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '3rem' }}>
            {/* Contact Details & Cards */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', marginBottom: '1.25rem' }}>
                Concierge Contact Information
              </h3>
              <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Whether you prefer a phone call, WhatsApp chat, or in-person consultation, our team is at your disposal 6 days a week.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--white)', padding: '1.25rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--sage)' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--cream)', borderRadius: '50%', color: 'var(--terracotta)' }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#777', textTransform: 'uppercase' }}>Phone Inquiry</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--adriatic)' }}>{settings?.phone || '[+91 XXXXX XXXXX]'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--white)', padding: '1.25rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--sage)' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--cream)', borderRadius: '50%', color: 'var(--terracotta)' }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#777', textTransform: 'uppercase' }}>Email Concierge</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--adriatic)' }}>{settings?.email || '[info@yourdomain.com]'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--white)', padding: '1.25rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--sage)' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--cream)', borderRadius: '50%', color: 'var(--terracotta)' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#777', textTransform: 'uppercase' }}>Office Address</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--adriatic)' }}>{settings?.address || '[Office Address]'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--white)', padding: '1.25rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--sage)' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--cream)', borderRadius: '50%', color: 'var(--terracotta)' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#777', textTransform: 'uppercase' }}>Working Hours</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--adriatic)' }}>{settings?.workingHours || 'Mon - Sat: 9:00 AM - 8:00 PM'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{
              backgroundColor: 'var(--white)',
              padding: '2.5rem',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--gold)',
              boxShadow: 'var(--box-shadow-md)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--adriatic)', marginBottom: '0.5rem' }}>
                Send Us a Message
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
                Fill in your details below and our personal trip manager will get back to you within 12 hours.
              </p>

              <form onSubmit={handleSubmit}>
                <FormField
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g. Alexander Hamilton"
                  required
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="alex@example.com"
                    required
                  />
                  <FormField
                    label="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>

                <FormField
                  label="Interested Destination (Optional)"
                  name="destination"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  placeholder="e.g. Amalfi Coast, Maldives..."
                />

                <FormField
                  label="Message / Inquiry Details"
                  name="notes"
                  type="textarea"
                  rows={4}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="How can we assist you?"
                  required
                />

                <Button variant="primary" type="submit" loading={submitting} icon={Send} style={{ width: '100%', marginTop: '0.5rem' }}>
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Embedded Map Placeholder */}
          <div style={{ marginTop: '4rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--adriatic)', marginBottom: '1.25rem' }}>
              Concierge Location
            </h3>
            <div style={{
              width: '100%',
              height: '350px',
              backgroundColor: 'var(--sage)',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--gold)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--adriatic)'
            }}>
              <MapPin size={48} color="var(--terracotta)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0 }}>Roamora Travels Global Headquarters</h4>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>{settings?.address || '[Office Address, Luxury Towers, Suite 402]'}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
