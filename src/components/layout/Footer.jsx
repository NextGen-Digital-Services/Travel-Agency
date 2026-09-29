import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Logo } from '../common/Logo.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function Footer() {
  const { settings, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.subscribeNewsletter(email);
      addToast(res.message, 'success');
      setEmail('');
    } catch (err) {
      addToast('Failed to subscribe. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Logo light size="large" />
            <p>
              {settings?.heroSubtext || "Crafting bespoke luxury travel experiences across the world's most captivating destinations. Your Journey. Our Expertise."}
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <a href={settings?.facebook || '#'} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>
                <Facebook size={20} />
              </a>
              <a href={settings?.instagram || '#'} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>
                <Instagram size={20} />
              </a>
              <a href={settings?.twitter || '#'} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>
                <Twitter size={20} />
              </a>
              <a href={settings?.linkedin || '#'} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <div className="footer-links">
              <NavLink to="/about">About Roamora</NavLink>
              <NavLink to="/destinations">Destinations</NavLink>
              <NavLink to="/packages">Curated Packages</NavLink>
              <NavLink to="/services">Luxury Services</NavLink>
              <NavLink to="/gallery">Photo Gallery</NavLink>
              <NavLink to="/blog">Travel Journal</NavLink>
              <NavLink to="/testimonials">Guest Reviews</NavLink>
              <NavLink to="/faq">Frequently Asked Questions</NavLink>
            </div>
          </div>

          {/* Top Destinations */}
          <div>
            <h4 className="footer-heading">Top Destinations</h4>
            <div className="footer-links">
              <NavLink to="/destinations/amalfi-coast-tuscany">Amalfi Coast & Tuscany</NavLink>
              <NavLink to="/destinations/santorini-mykonos">Santorini & Mykonos</NavLink>
              <NavLink to="/destinations/maldives-atolls">Maldives Atolls</NavLink>
              <NavLink to="/destinations/dubai-abu-dhabi">Dubai & Abu Dhabi</NavLink>
              <NavLink to="/destinations/swiss-alps-lakes">Swiss Alps & Lakes</NavLink>
              <NavLink to="/destinations/bali-komodo">Bali & Komodo</NavLink>
              <NavLink to="/destinations/kerala-backwaters">Kerala Backwaters</NavLink>
              <NavLink to="/destinations/royal-rajasthan">Royal Rajasthan</NavLink>
            </div>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="footer-heading">Join Our Newsletter</h4>
            <p style={{ fontSize: '0.88rem', opacity: 0.8, marginBottom: '1rem' }}>
              Receive handpicked luxury travel itineraries, private villa openings, and exclusive offers directly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--ivory)', border: '1px solid var(--gold)' }}
              />
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-gold"
                style={{ width: '100%' }}
              >
                <Send size={16} /> Subscribe
              </button>
            </form>

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.9 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--gold)" />
                <span>{settings?.phone || '[+91 XXXXX XXXXX]'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--gold)" />
                <span>{settings?.email || '[info@yourdomain.com]'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--gold)" />
                <span>{settings?.address || '[Office Address]'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Roamora Travels. All Rights Reserved. "{settings?.tagline || 'Your Journey. Our Expertise.'}"
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <NavLink to="/privacy-policy" style={{ color: 'inherit' }}>Privacy Policy</NavLink>
            <NavLink to="/terms-and-conditions" style={{ color: 'inherit' }}>Terms & Conditions</NavLink>
            <NavLink to="/admin/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>Admin Portal</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
