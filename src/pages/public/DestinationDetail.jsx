import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Calendar, Star, ArrowRight, CheckCircle2, Clock, Send } from 'lucide-react';
import { SmartImage } from '../../components/common/SmartImage.jsx';
import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { FormField } from '../../components/common/FormField.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openEnquiryModal, addToast } = useApp();

  const [destination, setDestination] = useState(null);
  const [relatedPackages, setRelatedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Side enquiry form state
  const [sideForm, setSideForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelers: '2 Adults',
    travelDate: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      try {
        const dest = await api.getDestinationById(id);
        if (!dest) {
          setDestination(null);
          setLoading(false);
          return;
        }
        setDestination(dest);

        const allPkgs = await api.getPackages();
        const related = allPkgs.filter(p => p.destinationId === dest.id || p.destinationName === dest.name);
        setRelatedPackages(related);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  const handleSideFormSubmit = async (e) => {
    e.preventDefault();
    if (!sideForm.fullName || !sideForm.email || !sideForm.phone) {
      addToast('Please complete all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitEnquiry({
        ...sideForm,
        destination: destination?.name,
        source: `Destination Detail: ${destination?.name}`
      });
      addToast('Your enquiry has been received! Our concierge will contact you shortly.', 'success');
      setSideForm({
        fullName: '',
        email: '',
        phone: '',
        travelers: '2 Adults',
        travelDate: '',
        notes: ''
      });
    } catch (err) {
      addToast('Failed to submit enquiry.', 'error');
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

  if (!destination) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h2>Destination Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/destinations')} style={{ marginTop: '1rem' }}>
          Back to Destinations
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{destination.name} Luxury Holiday | Roamora Travels</title>
        <meta name="description" content={destination.description} />
      </Helmet>

      {/* Hero Banner */}
      <section style={{
        position: 'relative',
        height: '60vh',
        minHeight: '400px',
        overflow: 'hidden'
      }}>
        <SmartImage src={destination.heroImage || destination.image} alt={destination.name} aspectRatio="auto" style={{ width: '100%', height: '100%' }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(14, 42, 71, 0.9) 0%, rgba(14, 42, 71, 0.3) 100%)',
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: '3rem'
        }}>
          <div className="container">
            <Badge variant="gold">{destination.region} • {destination.country}</Badge>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--ivory)', marginTop: '0.5rem' }}>
              {destination.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Detail Content */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            {/* Left Main Content */}
            <div>
              <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)', marginBottom: '2.5rem' }}>
                <span className="eyebrow">Overview</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
                  Experience The Wonder of {destination.name}
                </h2>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#444', marginBottom: '1.5rem' }}>
                  {destination.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--cream)', borderRadius: 'var(--border-radius-sm)', borderLeft: '4px solid var(--gold)' }}>
                  <Calendar size={22} color="var(--terracotta)" />
                  <div>
                    <strong style={{ color: 'var(--adriatic)' }}>Best Time To Visit: </strong>
                    <span>{destination.bestTimeToVisit}</span>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--adriatic)', marginBottom: '1.25rem' }}>
                  Highlights & Exclusive Experiences
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {destination.highlights?.map((hl, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--white)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--sage)' }}>
                      <CheckCircle2 size={20} color="var(--olive)" />
                      <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--adriatic)' }}>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Gallery Grid */}
              {destination.gallery && destination.gallery.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--adriatic)', marginBottom: '1.25rem' }}>
                    Visual Gallery
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {destination.gallery.map((imgUrl, i) => (
                      <div key={i} style={{ borderRadius: 'var(--border-radius-sm)', overflow: 'hidden' }}>
                        <SmartImage src={imgUrl} alt={`${destination.name} photo ${i + 1}`} aspectRatio="4/3" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Packages */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--adriatic)', marginBottom: '1.25rem' }}>
                  Curated Packages in {destination.name}
                </h3>
                {relatedPackages.length === 0 ? (
                  <p style={{ color: '#666' }}>No specific package listed for this destination yet. Inquire for a custom itinerary!</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {relatedPackages.map((pkg) => (
                      <div key={pkg.id} className="travel-card" onClick={() => navigate(`/packages/${pkg.slug}`)} style={{ cursor: 'pointer' }}>
                        <div className="card-image-box">
                          <SmartImage src={pkg.image} alt={pkg.title} aspectRatio="16/10" />
                        </div>
                        <div className="card-body">
                          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--adriatic)', marginBottom: '0.5rem' }}>{pkg.title}</h4>
                          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>{pkg.duration}</div>
                          <div className="card-footer">
                            <span className="card-price-amount">${pkg.price?.toLocaleString()}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--terracotta)', fontWeight: 600 }}>View <ArrowRight size={14} /></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Enquiry Form */}
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
                  Inquire About {destination.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.25rem' }}>
                  Speak directly with our regional specialist to curate your dates and resort stays.
                </p>
                <form onSubmit={handleSideFormSubmit}>
                  <FormField
                    label="Full Name"
                    name="fullName"
                    value={sideForm.fullName}
                    onChange={(e) => setSideForm({ ...sideForm, fullName: e.target.value })}
                    required
                  />
                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={sideForm.email}
                    onChange={(e) => setSideForm({ ...sideForm, email: e.target.value })}
                    required
                  />
                  <FormField
                    label="Phone Number"
                    name="phone"
                    value={sideForm.phone}
                    onChange={(e) => setSideForm({ ...sideForm, phone: e.target.value })}
                    required
                  />
                  <FormField
                    label="Target Date"
                    name="travelDate"
                    type="date"
                    value={sideForm.travelDate}
                    onChange={(e) => setSideForm({ ...sideForm, travelDate: e.target.value })}
                  />
                  <FormField
                    label="Message"
                    name="notes"
                    type="textarea"
                    rows={3}
                    value={sideForm.notes}
                    onChange={(e) => setSideForm({ ...sideForm, notes: e.target.value })}
                    placeholder="Any specific resort or airline preferences..."
                  />
                  <Button variant="primary" type="submit" loading={submitting} icon={Send} style={{ width: '100%', marginTop: '0.5rem' }}>
                    Request Custom Quote
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
