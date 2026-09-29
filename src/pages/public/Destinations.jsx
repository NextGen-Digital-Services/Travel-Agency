import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, ArrowRight, MapPin } from 'lucide-react';
import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { SmartImage } from '../../components/common/SmartImage.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { SkeletonGrid } from '../../components/common/Skeleton.jsx';
import { api } from '../../services/api.js';

export function Destinations() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeRegion = searchParams.get('region') || 'All';
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await api.getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const regions = ['All', 'Europe', 'Asia', 'Middle East', 'International', 'India'];

  const handleRegionSelect = (reg) => {
    const params = new URLSearchParams(searchParams);
    if (reg === 'All') {
      params.delete('region');
    } else {
      params.set('region', reg);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set('q', val);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const filteredDestinations = destinations.filter(d => {
    const matchesRegion = activeRegion === 'All' || d.region === activeRegion;
    const matchesSearch = !searchTerm ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Curated Destinations | Roamora Travels</title>
        <meta name="description" content="Explore our handpicked collection of luxury destinations across Europe, Asia, the Middle East, India, and tropical island atolls." />
      </Helmet>

      {/* Header Banner */}
      <section className="section-padding bg-adriatic" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Global Sanctuaries"
            title="Curated Destinations"
            subtitle="Journey through world-renowned coastal rivieras, ancient royal kingdoms, and private overwater atolls."
            light
          />

          {/* Region Tabs & Search Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '2rem' }}>
            {/* Live Search Input */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input
                type="text"
                placeholder="Search destination or country..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-control"
                style={{ paddingLeft: '44px', borderRadius: 'var(--border-radius-pill)', backgroundColor: 'var(--ivory)' }}
              />
            </div>

            {/* Region Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {regions.map((reg) => (
                <button
                  key={reg}
                  onClick={() => handleRegionSelect(reg)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: 'var(--border-radius-pill)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    border: '1px solid',
                    borderColor: activeRegion === reg ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                    backgroundColor: activeRegion === reg ? 'var(--gold)' : 'transparent',
                    color: activeRegion === reg ? 'var(--adriatic)' : 'var(--ivory)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="section-padding bg-ivory">
        <div className="container">
          {loading ? (
            <SkeletonGrid count={6} />
          ) : filteredDestinations.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No Destinations Found"
              description={`We couldn't find any destinations matching "${searchTerm || activeRegion}". Try adjusting your filters.`}
              actionText="Reset Filters"
              onAction={() => {
                setSearchTerm('');
                setSearchParams({});
              }}
            />
          ) : (
            <div className="cards-grid">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="travel-card"
                  onClick={() => navigate(`/destinations/${dest.slug}`)}
                  style={{ cursor: 'pointer' }}
                >
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
                        Explore Details <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
