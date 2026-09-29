import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SectionHeading } from '../../components/common/SectionHeading.jsx';

export function TermsConditions() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | Roamora Travels</title>
        <meta name="description" content="Terms and conditions governing Roamora Travels luxury holiday packages, booking deposits, and cancellations." />
      </Helmet>

      <section className="section-padding bg-adriatic" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Client Agreement"
            title="Terms & Conditions"
            subtitle="Terms governing booking reservations, payment schedules, and concierge services."
            light
          />
        </div>
      </section>

      <section className="section-padding bg-ivory">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ backgroundColor: 'var(--white)', padding: '3rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)', lineHeight: 1.8, color: '#333' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
              1. Booking Confirmation & Deposits
            </h3>
            <p style={{ marginBottom: '1.5rem' }}>
              A reservation is confirmed upon receipt of the designated package deposit or full payment as outlined in your customized quote. All rates are quoted in USD or local currency equivalent and are subject to availability at the time of locking reservations.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
              2. Cancellation & Refund Policy
            </h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Cancellations made 45 days or more prior to departure qualify for a full refund minus administrative fees and non-refundable vendor deposits (e.g. private jet charters or peak-season luxury villas).
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
              3. Travel Documents & Visas
            </h3>
            <p style={{ marginBottom: '1.5rem' }}>
              While Roamora Travels provides comprehensive visa guidance, clients remain ultimately responsible for holding valid passports (minimum 6 months validity) and required entry visas for destination countries.
            </p>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
              4. Travel Insurance
            </h3>
            <p style={{ margin: 0 }}>
              We strongly advise all guests to obtain comprehensive international travel insurance covering trip interruption, medical emergencies, and luggage protection.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
