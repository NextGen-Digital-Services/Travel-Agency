import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plane, Hotel, FileCheck, Compass, Briefcase, ShieldCheck, Car, Send } from 'lucide-react';
import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { SmartImage } from '../../components/common/SmartImage.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function Services() {
  const { openEnquiryModal } = useApp();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Plane': return Plane;
      case 'Hotel': return Hotel;
      case 'FileCheck': return FileCheck;
      case 'Compass': return Compass;
      case 'Briefcase': return Briefcase;
      case 'ShieldCheck': return ShieldCheck;
      case 'Car': return Car;
      default: return Compass;
    }
  };

  return (
    <>
      <Helmet>
        <title>Luxury Concierge Services | Roamora Travels</title>
        <meta name="description" content="Explore Roamora's premium concierge travel services: first-class flights, Virtuoso 5-star hotels, visa assistance, corporate MICE retreats, and private jet charters." />
      </Helmet>

      {/* Header Banner */}
      <section className="section-padding bg-adriatic" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div className="container">
          <SectionHeading
            eyebrow="White-Glove Assistance"
            title="Our Luxury Services"
            subtitle="End-to-end travel logistics managed with precision, elegance, and 24/7 personal concierge support."
            light
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {services.map((serv, index) => {
              const ServiceIcon = getIcon(serv.icon);
              const isEven = index % 2 === 0;

              return (
                <div
                  key={serv.id}
                  style={{
                    backgroundColor: 'var(--white)',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--sage)',
                    boxShadow: 'var(--box-shadow-sm)',
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: isEven ? '1fr 1fr' : '1fr 1fr',
                    alignItems: 'center'
                  }}
                  className="service-card-responsive"
                >
                  <div style={{ order: isEven ? 1 : 2, padding: '3rem' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--cream)',
                      color: 'var(--terracotta)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem'
                    }}>
                      <ServiceIcon size={28} />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', marginBottom: '1rem' }}>
                      {serv.title}
                    </h3>
                    <p style={{ fontSize: '1.05rem', color: '#555', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                      {serv.description}
                    </p>
                    <Button
                      variant="primary"
                      icon={Send}
                      onClick={() => openEnquiryModal({ notes: `Inquiry regarding Service: ${serv.title}`, source: `Services Page: ${serv.title}` })}
                    >
                      Inquire About {serv.title.split('&')[0]}
                    </Button>
                  </div>

                  <div style={{ order: isEven ? 2 : 1, height: '100%', minHeight: '320px' }}>
                    <SmartImage src={serv.image} alt={serv.title} aspectRatio="auto" style={{ width: '100%', height: '100%' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
