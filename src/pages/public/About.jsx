import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Compass, Award, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { SmartImage } from '../../components/common/SmartImage.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { api } from '../../services/api.js';

export function About() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    async function loadTeam() {
      try {
        const data = await api.getTeam();
        setTeam(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadTeam();
  }, []);

  return (
    <>
      <Helmet>
        <title>About Roamora Travels | Our Legacy & Vision</title>
        <meta name="description" content="Learn about Roamora Travels, our Italian Riviera design heritage, mission, leadership team, and commitment to bespoke luxury travel." />
      </Helmet>

      {/* Header Banner */}
      <section className="section-padding bg-adriatic" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Our Heritage & Philosophy"
            title="About Roamora Travels"
            subtitle="Founded on the Italian Riviera principle that travel should be an art form—effortless, inspiring, and deeply personal."
            light
          />
        </div>
      </section>

      {/* Story & Arched Image */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="eyebrow">Our Story</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--adriatic)', marginBottom: '1.25rem' }}>
                Born on the Cliffs of Positano, Crafted for the World
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#444', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                Roamora Travels was born from a passion for authentic elegance. Our founders envisioned a travel house where discerning clients never have to compromise between bespoke customization and seamless on-ground execution.
              </p>
              <p style={{ fontSize: '1.05rem', color: '#444', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Over the past 14 years, we have built an elite global network of private villa owners, Virtuoso hoteliers, yacht captains, and regional cultural historians. Every itinerary we design carries our signature guarantee: zero worry, maximum wonder.
              </p>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: 'var(--gold)', fontWeight: 700 }}>14+</div>
                  <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase' }}>Years Experience</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: 'var(--gold)', fontWeight: 700 }}>15,000+</div>
                  <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase' }}>Happy Guests</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: 'var(--gold)', fontWeight: 700 }}>85+</div>
                  <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase' }}>Destinations</div>
                </div>
              </div>
            </div>

            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
              <div className="arch-frame" style={{ border: '2px solid var(--gold)', height: '480px' }}>
                <SmartImage src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1600&q=80" alt="Venetian Grand Canal Luxury Villa" aspectRatio="auto" style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="section-padding bg-cream">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ backgroundColor: 'var(--white)', padding: '2.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(194, 153, 63, 0.15)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Compass size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--adriatic)', marginBottom: '0.75rem' }}>
                Our Mission
              </h3>
              <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.7, margin: 0 }}>
                To create transformative, luxury travel experiences that inspire wonder, foster cultural connection, and respect local heritage while delivering flawless white-glove service.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--white)', padding: '2.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--sage)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(181, 87, 58, 0.15)', color: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--adriatic)', marginBottom: '0.75rem' }}>
                Our Vision
              </h3>
              <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.7, margin: 0 }}>
                To set the global standard for bespoke experiential travel—where every journey is curated like a work of fine art and every client feels like family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Grid */}
      <section className="section-padding bg-ivory">
        <div className="container">
          <SectionHeading
            eyebrow="World Travel Experts"
            title="Meet Our Concierge Leadership"
            subtitle="Seasoned regional specialists passionate about curating extraordinary itineraries."
          />
          <div className="cards-grid">
            {team.map((member) => (
              <div key={member.id} className="travel-card">
                <div className="card-image-box" style={{ height: '280px' }}>
                  <SmartImage src={member.image} alt={member.name} aspectRatio="auto" style={{ width: '100%', height: '100%' }} />
                </div>
                <div className="card-body">
                  <h3 className="card-title" style={{ fontSize: '1.35rem' }}>{member.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--terracotta)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    {member.role}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#666', margin: 0 }}>
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="section-padding bg-cream">
        <div className="container">
          <SectionHeading
            eyebrow="Our Journey"
            title="Milestones of Excellence"
          />
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { year: "2012", title: "Founded in Amalfi, Italy", desc: "Started as a boutique concierge desk servicing private villa guests on the Amalfi Coast." },
              { year: "2016", title: "Expanded to Swiss Alps & French Riviera", desc: "Added high-altitude alpine chalets and private yacht charter operations in Cannes." },
              { year: "2020", title: "Virtuoso Luxury Partner Accreditation", desc: "Recognized among top global luxury travel agencies with exclusive hotel upgrades." },
              { year: "2024", title: "Global Private Aviation Desk Launch", desc: "Introduced 24/7 private jet charters and bespoke helicopter transfers." },
              { year: "2026", title: "Next-Generation Digital Portal", desc: "Launched Roamora Travels full-pass interactive web portal for seamless client bookings." }
            ].map((m, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1.5rem', backgroundColor: 'var(--white)', padding: '1.5rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--sage)' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--gold)', fontWeight: 700, minWidth: '70px' }}>
                  {m.year}
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--adriatic)', marginBottom: '0.25rem' }}>
                    {m.title}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
