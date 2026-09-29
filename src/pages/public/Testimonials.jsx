import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { SmartImage } from '../../components/common/SmartImage.jsx';
import { FormField } from '../../components/common/FormField.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function Testimonials() {
  const { addToast } = useApp();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Submit Testimonial Form State
  const [form, setForm] = useState({
    name: '',
    location: '',
    packageTitle: '',
    rating: 5,
    quote: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadTestimonials() {
      setLoading(true);
      try {
        const data = await api.getTestimonials();
        setTestimonials(data.filter(t => t.status === 'approved'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.quote) {
      addToast('Please provide your name and review details.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.saveTestimonial({
        ...form,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        status: 'approved'
      });
      addToast('Thank you! Your review has been published.', 'success');
      setForm({
        name: '',
        location: '',
        packageTitle: '',
        rating: 5,
        quote: ''
      });
      const data = await api.getTestimonials();
      setTestimonials(data.filter(t => t.status === 'approved'));
    } catch (err) {
      addToast('Failed to submit review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Guest Reviews & Testimonials | Roamora Travels</title>
        <meta name="description" content="Read authentic reviews from luxury travelers who experienced Roamora's bespoke holiday packages and 24/7 concierge." />
      </Helmet>

      {/* Header Banner */}
      <section className="section-padding bg-adriatic" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Authentic Stories"
            title="Guest Reviews & Testimonials"
            subtitle="Discover how Roamora Travels has crafted unforgettable memories for our guests across the globe."
            light
          />
        </div>
      </section>

      {/* Reviews Grid & Form Section */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            {/* Reviews Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  style={{
                    backgroundColor: 'var(--white)',
                    padding: '1.75rem',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--sage)',
                    boxShadow: 'var(--box-shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} size={16} color="var(--gold)" fill="var(--gold)" />
                    ))}
                  </div>

                  <p style={{ fontSize: '0.95rem', color: '#444', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>
                    "{t.quote}"
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--sage)' }}>
                    <img
                      src={t.avatar}
                      alt={t.name}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--gold)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--adriatic)' }}>{t.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#777' }}>
                        {t.location} • <span style={{ color: 'var(--terracotta)' }}>{t.packageTitle}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Leave a Review Form */}
            <div>
              <div style={{
                position: 'sticky',
                top: '100px',
                backgroundColor: 'var(--white)',
                padding: '2rem',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--gold)',
                boxShadow: 'var(--box-shadow-md)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--adriatic)', marginBottom: '0.5rem' }}>
                  Share Your Experience
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.25rem' }}>
                  Have you recently traveled with Roamora? We would love to hear about your journey.
                </p>
                <form onSubmit={handleSubmit}>
                  <FormField
                    label="Your Name"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. David Sterling"
                    required
                  />
                  <FormField
                    label="City / Country"
                    name="location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="London, UK"
                  />
                  <FormField
                    label="Package / Destination Traveled"
                    name="packageTitle"
                    value={form.packageTitle}
                    onChange={(e) => setForm({ ...form, packageTitle: e.target.value })}
                    placeholder="Amalfi Coast Journey"
                  />
                  <FormField
                    label="Rating"
                    name="rating"
                    type="select"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    options={[
                      { label: '5 Stars ★★★★★', value: 5 },
                      { label: '4 Stars ★★★★☆', value: 4 }
                    ]}
                  />
                  <FormField
                    label="Your Review / Story"
                    name="quote"
                    type="textarea"
                    rows={4}
                    value={form.quote}
                    onChange={(e) => setForm({ ...form, quote: e.target.value })}
                    placeholder="Tell us about the highlights of your trip..."
                    required
                  />
                  <Button variant="primary" type="submit" loading={submitting} icon={Send} style={{ width: '100%', marginTop: '0.5rem' }}>
                    Submit Review
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
