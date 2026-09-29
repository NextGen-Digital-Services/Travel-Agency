import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { SmartImage } from '../../components/common/SmartImage.jsx';
import { api } from '../../services/api.js';

export function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await api.getGallery();
        setGallery(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadGallery();
  }, []);

  const categories = ['All', 'Italy', 'Greece', 'Maldives', 'Dubai', 'Switzerland', 'Bali', 'France', 'India', 'Japan'];

  const filteredItems = gallery.filter(item => activeCategory === 'All' || item.category === activeCategory);

  const handleKeyDown = (e) => {
    if (lightboxIndex === null) return;
    if (e.key === 'ArrowRight') {
      setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowLeft') {
      setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Escape') {
      setLightboxIndex(null);
    }
  };

  useEffect(() => {
    if (lightboxIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  return (
    <>
      <Helmet>
        <title>Visual Photo Gallery | Roamora Travels</title>
        <meta name="description" content="Browse our luxury travel photography gallery featuring Amalfi Coast, Santorini sunsets, Maldives overwater villas, and Swiss mountain peaks." />
      </Helmet>

      {/* Header Banner */}
      <section className="section-padding bg-adriatic" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Visual Wanderlust"
            title="Photo Gallery"
            subtitle="Immerse yourself in breathtaking snapshots captured across our luxury travel destinations."
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

      {/* Gallery Masonry Grid */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--border-radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: 'var(--box-shadow-sm)'
                }}
                className="travel-card"
                onClick={() => setLightboxIndex(index)}
              >
                <SmartImage src={item.image} alt={item.title} aspectRatio="4/3" />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(14, 42, 71, 0.4)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.25rem',
                  color: 'var(--ivory)'
                }}
                className="gallery-hover-overlay"
                >
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--ivory)', margin: 0 }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gold)', textTransform: 'uppercase' }}>
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal with Keyboard & Swipe Navigation */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="lightbox-modal" onClick={() => setLightboxIndex(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Close">
              <X size={28} />
            </button>
            
            <img src={filteredItems[lightboxIndex].image} alt={filteredItems[lightboxIndex].title} />

            <div style={{ position: 'absolute', bottom: '-40px', left: 0, right: 0, textAlign: 'center', color: 'var(--ivory)' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>{filteredItems[lightboxIndex].title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--gold)' }}>{filteredItems[lightboxIndex].category} ({lightboxIndex + 1} of {filteredItems.length})</div>
            </div>

            <button
              className="lightbox-nav prev"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
              }}
              aria-label="Previous"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              className="lightbox-nav next"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
              }}
              aria-label="Next"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
