import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { api } from '../../services/api.js';

export function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const data = await api.getFaqs();
        setFaqs(data);
        if (data.length > 0) setOpenId(data[0].id);
      } catch (err) {
        console.error(err);
      }
    }
    loadFaqs();
  }, []);

  const categories = ['All', 'Booking & Reservations', 'Payments & Cancellation', 'Visas & Travel Insurance', 'On-Trip Concierge', 'Corporate & Groups'];

  const filteredFaqs = faqs.filter(f => activeCategory === 'All' || f.category === activeCategory);

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | Roamora Travels</title>
        <meta name="description" content="Find answers to common questions about booking luxury packages, custom itineraries, visa assistance, payments, and 24/7 concierge support." />
      </Helmet>

      {/* Header Banner */}
      <section className="section-padding bg-adriatic" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Help & Clarity"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about planning your luxury holiday journey with Roamora."
            light
          />

          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--border-radius-pill)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                  backgroundColor: activeCategory === cat ? 'var(--gold)' : 'transparent',
                  color: activeCategory === cat ? 'var(--adriatic)' : 'var(--ivory)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Grid */}
      <section className="section-padding bg-ivory">
        <div className="container" style={{ maxWidth: '900px' }}>
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => toggleAccordion(faq.id)}
              >
                <span style={{ fontWeight: 600 }}>{faq.question}</span>
                {openId === faq.id ? <ChevronUp size={20} color="var(--terracotta)" /> : <ChevronDown size={20} color="var(--adriatic)" />}
              </button>
              {openId === faq.id && (
                <div className="accordion-body">
                  <p style={{ margin: 0 }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
