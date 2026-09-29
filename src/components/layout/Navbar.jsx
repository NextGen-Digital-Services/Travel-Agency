import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Compass, Send } from 'lucide-react';
import { Logo } from '../common/Logo.jsx';
import { Button } from '../common/Button.jsx';
import { useApp } from '../../context/AppContext.jsx';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openEnquiryModal } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'Packages', path: '/packages' },
    { label: 'Services', path: '/services' },
    { label: 'About Us', path: '/about' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Journal', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-container">
          <NavLink to="/">
            <Logo />
          </NavLink>

          {/* Desktop Nav Links */}
          <nav className="nav-links">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={item.path === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Button
              variant="primary"
              size="sm"
              icon={Send}
              onClick={() => openEnquiryModal()}
              style={{ display: 'none', minWidth: 'auto' }}
              className="desktop-plan-btn"
            >
              Plan Journey
            </Button>
            
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="mobile-nav-toggle"
              aria-label="Open Mobile Menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Full-Screen Slide-in Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <Logo />
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={26} color="var(--adriatic)" />
              </button>
            </div>
            <div className="mobile-nav-links">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                  end={item.path === '/'}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Button
                variant="primary"
                size="lg"
                icon={Send}
                onClick={() => {
                  setMobileMenuOpen(false);
                  openEnquiryModal();
                }}
              >
                Plan My Journey
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/admin/login');
                }}
              >
                Admin Panel Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
