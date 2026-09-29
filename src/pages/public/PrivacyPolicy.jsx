import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SectionHeading } from '../../components/common/SectionHeading.jsx';

export function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Roamora Travels</title>
        <meta name="description" content="Roamora Travels privacy policy details how we collect, protect, and handle client personal information." />
      </Helmet>

      <section className="section-padding bg-adriatic" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Data Protection"
            title="Privacy Policy"
            subtitle="Your privacy is paramount. Learn how we safeguard your personal data and travel preferences."
            light
          />
        </div>
      </section>

      <section className="section-padding bg-ivory">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ backgroundColor: 'var(--white)', padding: '3rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)', lineHeight: 1.8, color: '#333' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
              1. Information We Collect
            </h3>
            <p style={{ marginBottom: '1.5rem' }}>
              When you inquire or book a luxury itinerary with Roamora Travels, we collect personal details including your full name, email address, phone number, travel dates, flight preferences, and passport documentation necessary for international visa and hotel reservations.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
              2. How We Use Your Data
            </h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Your information is exclusively utilized to curate your personalized travel itinerary, secure flight seats and Virtuoso hotel upgrades, communicate booking updates, and provide 24/7 on-trip concierge support. We never sell or lease client data to third-party marketing brokers.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
              3. Data Security & Storage
            </h3>
            <p style={{ marginBottom: '1.5rem' }}>
              We implement industry-standard encryption protocols and secure access controls to ensure your personal data remains protected against unauthorized access or disclosure.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
              4. Contact Privacy Desk
            </h3>
            <p style={{ margin: 0 }}>
              If you have any questions regarding our privacy practices or wish to request data deletion, please contact our legal desk via email.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
