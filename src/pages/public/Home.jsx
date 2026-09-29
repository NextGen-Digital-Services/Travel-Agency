import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Search, Calendar, Users, Star, ArrowRight, ShieldCheck, Heart,
  Compass, Award, Clock, ChevronLeft, ChevronRight, Send, CheckCircle2,
  Sparkles, Hotel, Plane, MapPin
} from 'lucide-react';
import { SmartImage } from '../../components/common/SmartImage.jsx';
import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { useCounter } from '../../hooks/useCounter.js';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function Home() {
  const { settings, openEnquiryModal } = useApp();
  const navigate = useNavigate();

  // Search state
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchTravelers, setSearchTravelers] = useState('2 Adults');

  // Loaded data
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Testimonial Carousel Index
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const dests = await api.getDestinations();
        const pkgs = await api.getPackages();
        const tests = await api.getTestimonials();
        const blgs = await api.getBlogs();

        setDestinations(dests.filter(d => d.featured).slice(0, 6));
        setPackages(pkgs.filter(p => p.featured && p.active).slice(0, 6));
        setTestimonials(tests.filter(t => t.status === 'approved'));
        setBlogs(blgs.slice(0, 3));
      } catch (err) {
        console.error("Error loading home page data:", err);
      }
    }
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchDestination) params.append('destination', searchDestination);
    if (searchDate) params.append('date', searchDate);
    if (searchTravelers) params.append('travelers', searchTravelers);
    navigate(`/packages?${params.toString()}`);
  };

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setActiveTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Stats Counters
  const countTravelers = useCounter(settings?.statsTravelers || 15000);
  const countDestinations = useCounter(settings?.statsDestinations || 85);
  const countPackages = useCounter(settings?.statsPackages || 120);
  const countYears = useCounter(settings?.statsYears || 14);

  return (
    <>
      <Helmet>
        <title>{settings?.seoTitle || "Roamora Travels | Luxury Travel Agency & Bespoke Holidays"}</title>
        <meta name="description" content={settings?.seoDescription || "Experience bespoke luxury itineraries, curated holiday packages, flight & hotel bookings, visa assistance and personalized concierge travel services."} />
      </Helmet>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="eyebrow">Exquisite Handpicked Journeys</span>
              <h1 className="hero-title">
                {settings?.heroHeadline || "Crafting Unforgettable Journeys Across The Globe"}
              </h1>
              <p className="hero-tagline">
                "{settings?.heroSubtext || "Immerse yourself in handpicked luxury travel experiences curated by seasoned world travel experts."}"
              </p>

              {/* Tabbed Search Bar */}
              <div className="search-bar-container">
                <div className="search-bar-tabs">
                  <span className="search-tab active">Find Your Journey</span>
                </div>
                <form onSubmit={handleSearchSubmit} className="search-fields-grid">
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--adriatic)', display: 'block', marginBottom: '4px' }}>
                      Destination
                    </label>
                    <select
                      className="form-control"
                      value={searchDestination}
                      onChange={(e) => setSearchDestination(e.target.value)}
                    >
                      <option value="">All Destinations</option>
                      <option value="Amalfi Coast & Tuscany">Amalfi Coast & Tuscany</option>
                      <option value="Santorini & Mykonos">Santorini & Mykonos</option>
                      <option value="Maldives Atolls">Maldives Atolls</option>
                      <option value="Dubai & Abu Dhabi">Dubai & Abu Dhabi</option>
                      <option value="Swiss Alps & Lakes">Swiss Alps & Lakes</option>
                      <option value="Bali & Komodo">Bali & Komodo</option>
                      <option value="Kerala Backwaters">Kerala Backwaters</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--adriatic)', display: 'block', marginBottom: '4px' }}>
                      Travel Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--adriatic)', display: 'block', marginBottom: '4px' }}>
                      Travelers
                    </label>
                    <select
                      className="form-control"
                      value={searchTravelers}
                      onChange={(e) => setSearchTravelers(e.target.value)}
                    >
                      <option value="1 Adult">1 Adult</option>
                      <option value="2 Adults">2 Adults</option>
                      <option value="Family (4+)">Family (4+)</option>
                      <option value="Group (6+)">Group (6+)</option>
                    </select>
                  </div>

                  <Button type="submit" variant="primary" icon={Search} style={{ height: '44px' }}>
                    Search Journeys
                  </Button>
                </form>
              </div>
            </div>

            {/* Signature Italian Arched Hero Image */}
            <div className="hero-image-wrapper">
              <div className="hero-image-frame">
                <SmartImage
                  src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80"
                  alt="Amalfi Coast Italy Luxury Riviera"
                  aspectRatio="1/1"
                />
              </div>
              <div className="hero-floating-badge">
                <Sparkles color="var(--gold)" size={28} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--adriatic)' }}>Virtuoso Partner Agency</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>VIP Upgrades & 24/7 Concierge</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Strip */}
      <section className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            <div>
              <div className="stat-number">{countTravelers.toLocaleString()}+</div>
              <div className="stat-label">Happy Travelers</div>
            </div>
            <div>
              <div className="stat-number">{countDestinations}+</div>
              <div className="stat-label">Handpicked Destinations</div>
            </div>
            <div>
              <div className="stat-number">{countPackages}+</div>
              <div className="stat-label">Curated Packages</div>
            </div>
            <div>
              <div className="stat-number">{countYears}+</div>
              <div className="stat-label">Years of Expertise</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <SectionHeading
            eyebrow="World-Class Horizons"
            title="Featured Destinations"
            subtitle="Explore our handpicked collection of the world's most glamorous coastal sanctuaries and royal heritage estates."
          />
          <div className="cards-grid">
            {destinations.map((dest) => (
              <div key={dest.id} className="travel-card" onClick={() => navigate(`/destinations/${dest.slug}`)} style={{ cursor: 'pointer' }}>
                <div className="card-image-box">
                  <SmartImage src={dest.image} alt={dest.name} aspectRatio="4/3" />
                  <div className="card-badge">
                    <Badge variant="gold">{dest.region}</Badge>
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{dest.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.25rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {dest.description}
                  </p>
                  <div className="card-footer">
                    <span style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600 }}>
                      Best: {dest.bestTimeToVisit}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--terracotta)', fontWeight: 600, fontSize: '0.9rem' }}>
                      Explore <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Curated Packages */}
      <section className="section-padding bg-cream">
        <div className="container">
          <SectionHeading
            eyebrow="Bespoke Itineraries"
            title="Signature Curated Packages"
            subtitle="Meticulously crafted holiday journeys blending 5-star palatial stays, private yachts, and gourmet epicurean tours."
          />
          <div className="cards-grid">
            {packages.map((pkg) => (
              <div key={pkg.id} className="travel-card">
                <div className="card-image-box">
                  <SmartImage src={pkg.image} alt={pkg.title} aspectRatio="16/10" />
                  <div className="card-badge">
                    <Badge variant="terracotta">{pkg.theme}</Badge>
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="card-title" style={{ fontSize: '1.35rem' }}>{pkg.title}</h3>
                  <div className="card-meta">
                    <span className="card-meta-item"><Clock size={14} color="var(--gold)" /> {pkg.duration}</span>
                    <span className="card-meta-item"><Star size={14} color="var(--gold)" fill="var(--gold)" /> {pkg.rating} ({pkg.reviewsCount})</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    {pkg.inclusions?.slice(0, 3).map((inc, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', backgroundColor: 'var(--ivory)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--sage)' }}>
                        ✓ {inc}
                      </span>
                    ))}
                  </div>
                  <div className="card-footer">
                    <div className="card-price">
                      <span className="card-price-label">Starting From</span>
                      <span className="card-price-amount">${pkg.price?.toLocaleString()}</span>
                    </div>
                    <Button variant="primary" size="sm" onClick={() => navigate(`/packages/${pkg.slug}`)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Button variant="secondary" size="lg" onClick={() => navigate('/packages')}>
              View All Curated Packages
            </Button>
          </div>
        </div>
      </section>

      {/* Why Roamora */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <SectionHeading
            eyebrow="The Roamora Difference"
            title="Why Discerning Travelers Choose Us"
            subtitle="We blend traditional Italian Riviera warmth with white-glove concierge precision."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { icon: Compass, title: "Dedicated Personal Concierge", desc: "A dedicated regional specialist crafts every detail and remains on standby 24/7." },
              { icon: Hotel, title: "Vetted 5-Star Sanctuaries", desc: "Private island bungalows, historic Tuscan palazzos, and Virtuoso luxury resorts." },
              { icon: Sparkles, title: "Exclusive VIP Experiences", desc: "Private yacht charters, skip-the-line museum passes, and private vineyard tastings." },
              { icon: ShieldCheck, title: "100% Financial Protection", desc: "Comprehensive international insurance support and flexible cancellation policies." }
            ].map((item, idx) => (
              <div key={idx} style={{
                backgroundColor: 'var(--white)',
                padding: '2rem',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--sage)',
                boxShadow: 'var(--box-shadow-sm)'
              }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'var(--cream)', color: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <item.icon size={26} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--adriatic)', marginBottom: '0.5rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#666', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-adriatic">
        <div className="container">
          <SectionHeading
            eyebrow="Seamless Journeys"
            title="How Your Journey Unfolds"
            subtitle="Four effortless steps from inspiration to returning home rejuvenated."
            light
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {[
              { step: "01", title: "Inquire & Inspire", desc: "Share your travel vision via our portal or call our concierge desk." },
              { step: "02", title: "Concierge Consultation", desc: "Your personal trip manager designs a custom day-by-day blueprint." },
              { step: "03", title: "Tailor & Reserve", desc: "Fine-tune excursions, dining, and flights with VIP perks locked in." },
              { step: "04", title: "Depart in Luxury", desc: "Enjoy 24/7 on-ground assistance and white-glove transfers." }
            ].map((s, idx) => (
              <div key={idx} style={{ textCenter: 'center', position: 'relative' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 700, color: 'var(--gold)', opacity: 0.8, marginBottom: '0.5rem' }}>
                  {s.step}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--ivory)', marginBottom: '0.5rem' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(247, 241, 229, 0.8)', margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <SectionHeading
            eyebrow="Guest Stories"
            title="Words from Our Travelers"
            subtitle="Real experiences shared by guests who traveled the world with Roamora."
          />

          {testimonials.length > 0 && (
            <div className="testimonial-carousel">
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '1rem' }}>
                {Array.from({ length: testimonials[activeTestimonialIdx]?.rating || 5 }).map((_, i) => (
                  <Star key={i} size={20} color="var(--gold)" fill="var(--gold)" />
                ))}
              </div>

              <blockquote className="testimonial-quote">
                "{testimonials[activeTestimonialIdx]?.quote}"
              </blockquote>

              <div className="testimonial-author">
                <img
                  src={testimonials[activeTestimonialIdx]?.avatar}
                  alt={testimonials[activeTestimonialIdx]?.name}
                  className="testimonial-avatar"
                />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--adriatic)' }}>
                    {testimonials[activeTestimonialIdx]?.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#777' }}>
                    {testimonials[activeTestimonialIdx]?.location} • <span style={{ color: 'var(--terracotta)' }}>{testimonials[activeTestimonialIdx]?.packageTitle}</span>
                  </div>
                </div>
              </div>

              {/* Prev / Next Controls */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={prevTestimonial} className="btn btn-secondary btn-icon" aria-label="Previous Testimonial">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextTestimonial} className="btn btn-secondary btn-icon" aria-label="Next Testimonial">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Latest Travel Journal */}
      <section className="section-padding bg-cream">
        <div className="container">
          <SectionHeading
            eyebrow="Editorial Journal"
            title="Latest from the Roamora Journal"
            subtitle="Insider travel guides, packing checklists, and epicurean recommendations from our destination editors."
          />
          <div className="cards-grid">
            {blogs.map((blog) => (
              <div key={blog.id} className="travel-card" onClick={() => navigate(`/blog/${blog.slug}`)} style={{ cursor: 'pointer' }}>
                <div className="card-image-box">
                  <SmartImage src={blog.image} alt={blog.title} aspectRatio="16/10" />
                  <div className="card-badge">
                    <Badge variant="olive">{blog.category}</Badge>
                  </div>
                </div>
                <div className="card-body">
                  <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
                    {blog.date} • By {blog.author}
                  </div>
                  <h3 className="card-title" style={{ fontSize: '1.3rem' }}>{blog.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '1rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {blog.excerpt}
                  </p>
                  <span style={{ color: 'var(--terracotta)', fontWeight: 600, fontSize: '0.9rem', marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    Read Article <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Big CTA Banner */}
      <section style={{
        position: 'relative',
        padding: '6rem 0',
        backgroundImage: `linear-gradient(rgba(14, 42, 71, 0.82), rgba(14, 42, 71, 0.82)), url("https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'var(--ivory)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>Your Bespoke Journey Awaits</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', color: 'var(--ivory)', marginBottom: '1rem' }}>
            Ready to Begin Your Next Great Adventure?
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem' }}>
            Connect with our regional travel concierges today and let us tailor an extraordinary itinerary suited to your refined taste.
          </p>
          <Button variant="gold" size="lg" icon={Send} onClick={() => openEnquiryModal()}>
            Plan My Journey Now
          </Button>
        </div>
      </section>
    </>
  );
}
