import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Clock, Star, CheckCircle2, XCircle, Share2, Send, ChevronDown, ChevronUp,
  MapPin, ShieldCheck, HelpCircle, Heart, ArrowRight
} from 'lucide-react';
import { SmartImage } from '../../components/common/SmartImage.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';
import { FormField } from '../../components/common/FormField.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useApp();

  const [pkg, setPkg] = useState(null);
  const [similarPackages, setSimilarPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Accordion open state for day-by-day itinerary
  const [openDays, setOpenDays] = useState({ 1: true });

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelers: '2 Adults',
    travelDate: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadPackage() {
      setLoading(true);
      try {
        const found = await api.getPackageById(id);
        if (!found) {
          setPkg(null);
          setLoading(false);
          return;
        }
        setPkg(found);

        const all = await api.getPackages();
        const similar = all.filter(p => p.id !== found.id && (p.theme === found.theme || p.destinationName === found.destinationName)).slice(0, 3);
        setSimilarPackages(similar);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPackage();
  }, [id]);

  const toggleDay = (dayNum) => {
    setOpenDays(prev => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Package link copied to clipboard!', 'success');
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.fullName || !bookingForm.email || !bookingForm.phone) {
      addToast('Please complete all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitEnquiry({
        ...bookingForm,
        destination: pkg?.destinationName,
        packageId: pkg?.id,
        source: `Package Booking: ${pkg?.title}`
      });
      addToast('Your booking request has been submitted! Our concierge will contact you within 24 hours.', 'success');
      setBookingForm({
        fullName: '',
        email: '',
        phone: '',
        travelers: '2 Adults',
        travelDate: '',
        notes: ''
      });
    } catch (err) {
      addToast('Failed to submit booking request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '400px', width: '100%', borderRadius: 'var(--border-radius-md)' }} />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h2>Package Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/packages')} style={{ marginTop: '1rem' }}>
          Back to Packages
        </Button>
      </div>
    );
  }

  const images = [pkg.image, ...(pkg.gallery || [])];

  return (
    <>
      <Helmet>
        <title>{pkg.title} | Roamora Travels</title>
        <meta name="description" content={pkg.overview} />
      </Helmet>

      {/* Hero Header */}
      <section className="bg-adriatic" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Badge variant="gold">{pkg.theme}</Badge>
                <Badge variant="olive">{pkg.destinationName}</Badge>
              </div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', color: 'var(--ivory)', marginBottom: '0.75rem' }}>
                {pkg.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'rgba(247, 241, 229, 0.85)', fontSize: '0.95rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={16} color="var(--gold)" /> {pkg.duration}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Star size={16} color="var(--gold)" fill="var(--gold)" /> {pkg.rating} ({pkg.reviewsCount} reviews)</span>
              </div>
            </div>

            <Button variant="outline-gold" icon={Share2} onClick={handleShare}>
              Share Package
            </Button>
          </div>
        </div>
      </section>

      {/* Image Gallery Grid */}
      <section className="bg-ivory" style={{ padding: '2rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: images.length > 1 ? '2fr 1fr' : '1fr', gap: '1rem', height: '400px' }}>
            <div
              style={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden', cursor: 'pointer', height: '100%' }}
              onClick={() => { setActiveImageIndex(0); setLightboxOpen(true); }}
            >
              <SmartImage src={images[0]} alt={pkg.title} aspectRatio="auto" style={{ width: '100%', height: '100%' }} />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1rem', height: '100%' }}>
                {images.slice(1, 3).map((img, i) => (
                  <div
                    key={i}
                    style={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden', cursor: 'pointer', height: '100%' }}
                    onClick={() => { setActiveImageIndex(i + 1); setLightboxOpen(true); }}
                  >
                    <SmartImage src={img} alt={`${pkg.title} ${i + 2}`} aspectRatio="auto" style={{ width: '100%', height: '100%' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Details & Booking Section */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            {/* Left Content */}
            <div>
              {/* Overview */}
              <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)', marginBottom: '2.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
                  Journey Overview
                </h3>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#444', margin: 0 }}>
                  {pkg.overview}
                </p>
              </div>

              {/* Day-by-Day Itinerary Accordion */}
              {pkg.itinerary && pkg.itinerary.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--adriatic)', marginBottom: '1.25rem' }}>
                    Day-by-Day Itinerary
                  </h3>
                  {pkg.itinerary.map((item) => (
                    <div key={item.day} className="accordion-item">
                      <button
                        className="accordion-header"
                        onClick={() => toggleDay(item.day)}
                      >
                        <span>
                          <strong style={{ color: 'var(--terracotta)', marginRight: '0.75rem' }}>Day {item.day}:</strong>
                          {item.title}
                        </span>
                        {openDays[item.day] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      {openDays[item.day] && (
                        <div className="accordion-body">
                          <p style={{ margin: 0 }}>{item.detail}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ backgroundColor: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)' }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--olive)', marginBottom: '1rem' }}>
                    What's Included
                  </h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {pkg.inclusions?.map((inc, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--espresso)' }}>
                        <CheckCircle2 size={16} color="var(--olive)" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ backgroundColor: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)' }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--terracotta)', marginBottom: '1rem' }}>
                    Exclusions
                  </h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {pkg.exclusions?.map((exc, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                        <XCircle size={16} color="var(--terracotta)" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Side Booking Box */}
            <div>
              <div style={{
                position: 'sticky',
                top: '100px',
                backgroundColor: 'var(--white)',
                padding: '2rem',
                borderRadius: 'var(--border-radius-md)',
                border: '2px solid var(--gold)',
                boxShadow: 'var(--box-shadow-md)'
              }}>
                <div style={{ borderBottom: '1px solid var(--sage)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#777', textTransform: 'uppercase' }}>Starting Package Price</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--terracotta)', fontWeight: 700 }}>
                    ${pkg.price?.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#777', fontWeight: 400 }}>/ person</span>
                  </div>
                </div>

                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
                  Book This Journey
                </h4>
                <form onSubmit={handleBookingSubmit}>
                  <FormField
                    label="Full Name"
                    name="fullName"
                    value={bookingForm.fullName}
                    onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                    required
                  />
                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                    required
                  />
                  <FormField
                    label="Phone Number"
                    name="phone"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    required
                  />
                  <FormField
                    label="Travelers"
                    name="travelers"
                    type="select"
                    value={bookingForm.travelers}
                    onChange={(e) => setBookingForm({ ...bookingForm, travelers: e.target.value })}
                    options={['1 Adult', '2 Adults', '2 Adults + 1 Child', 'Family (4+)', 'Group (6+)']}
                  />
                  <FormField
                    label="Target Travel Date"
                    name="travelDate"
                    type="date"
                    value={bookingForm.travelDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, travelDate: e.target.value })}
                  />
                  <FormField
                    label="Special Notes"
                    name="notes"
                    type="textarea"
                    rows={2}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="Custom flight or villa requests..."
                  />
                  <Button variant="primary" type="submit" loading={submitting} icon={Send} style={{ width: '100%', marginTop: '0.5rem' }}>
                    Reserve My Spot
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Similar Packages */}
          {similarPackages.length > 0 && (
            <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--sage)' }}>
              <SectionHeading
                eyebrow="Recommendations"
                title="Similar Curated Packages"
              />
              <div className="cards-grid">
                {similarPackages.map((sim) => (
                  <div key={sim.id} className="travel-card" onClick={() => navigate(`/packages/${sim.slug}`)} style={{ cursor: 'pointer' }}>
                    <div className="card-image-box">
                      <SmartImage src={sim.image} alt={sim.title} aspectRatio="16/10" />
                    </div>
                    <div className="card-body">
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--adriatic)', marginBottom: '0.5rem' }}>{sim.title}</h4>
                      <div className="card-footer">
                        <span className="card-price-amount">${sim.price?.toLocaleString()}</span>
                        <span style={{ color: 'var(--terracotta)', fontWeight: 600, fontSize: '0.9rem' }}>View <ArrowRight size={14} /></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="lightbox-modal">
          <div className="lightbox-content">
            <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>×</button>
            <img src={images[activeImageIndex]} alt="Enlarged gallery item" />
          </div>
        </div>
      )}
    </>
  );
}
