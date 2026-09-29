import React from 'react';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Compass, Home } from 'lucide-react';
import { Button } from '../../components/common/Button.jsx';

export function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Roamora Travels</title>
      </Helmet>

      <section style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        backgroundColor: 'var(--ivory)'
      }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--cream)',
            color: 'var(--terracotta)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <Compass size={44} />
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', color: 'var(--adriatic)', marginBottom: '0.5rem' }}>
            404
          </h1>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--terracotta)', marginBottom: '1rem' }}>
            Journey Off The Map
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#666', marginBottom: '2rem', lineHeight: 1.7 }}>
            The destination page you are looking for appears to have moved or does not exist in our catalog. Let us guide you back to our handpicked itineraries.
          </p>

          <NavLink to="/">
            <Button variant="primary" size="lg" icon={Home}>
              Return to Homepage
            </Button>
          </NavLink>
        </div>
      </section>
    </>
  );
}
