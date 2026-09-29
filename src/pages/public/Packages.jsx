import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, SlidersHorizontal, Clock, Star, ArrowRight, Package as PackageIcon } from 'lucide-react';
import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { SmartImage } from '../../components/common/SmartImage.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Pagination } from '../../components/common/Pagination.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { SkeletonGrid } from '../../components/common/Skeleton.jsx';
import { api } from '../../services/api.js';

export function Packages() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [packages, setPackages] = useState([]);
  const [destinationsList, setDestinationsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedDestination, setSelectedDestination] = useState(searchParams.get('destination') || '');
  const [selectedTheme, setSelectedTheme] = useState(searchParams.get('theme') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 6000);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const pkgs = await api.getPackages();
        const dests = await api.getDestinations();
        setPackages(pkgs.filter(p => p.active));
        setDestinationsList(dests);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const themes = ['All', 'Luxury', 'Honeymoon', 'Family', 'Adventure', 'Pilgrimage', 'Group Tours'];

  const filteredPackages = useMemo(() => {
    let result = packages.filter((pkg) => {
      const matchesSearch = !searchTerm ||
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.overview.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDest = !selectedDestination || pkg.destinationName.toLowerCase().includes(selectedDestination.toLowerCase());
      const matchesTheme = !selectedTheme || selectedTheme === 'All' || pkg.theme === selectedTheme;
      const matchesPrice = !pkg.price || pkg.price <= maxPrice;

      return matchesSearch && matchesDest && matchesTheme && matchesPrice;
    });

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'duration') {
      result.sort((a, b) => (b.durationDays || 0) - (a.durationDays || 0));
    }

    return result;
  }, [packages, searchTerm, selectedDestination, selectedTheme, maxPrice, sortBy]);

  const totalPages = Math.ceil(filteredPackages.length / pageSize);
  const paginatedPackages = filteredPackages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDestination('');
    setSelectedTheme('');
    setMaxPrice(6000);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <>
      <Helmet>
        <title>Curated Holiday Packages | Roamora Travels</title>
        <meta name="description" content="Discover handpicked luxury holiday itineraries across Italy, Greece, Maldives, Dubai, Switzerland, Bali, and Rajasthan." />
      </Helmet>

      {/* Header Banner */}
      <section className="section-padding bg-adriatic" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Curated Journeys"
            title="Luxury Holiday Packages"
            subtitle="Explore our catalog of tailor-made packages designed by destination specialists."
            light
          />
        </div>
      </section>

      {/* Main Filter & Listing Section */}
      <section className="section-padding bg-ivory">
        <div className="container">
          {/* Top Filter Bar */}
          <div style={{
            backgroundColor: 'var(--white)',
            padding: '1.5rem',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--sage)',
            boxShadow: 'var(--box-shadow-sm)',
            marginBottom: '2.5rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', alignItems: 'end' }}>
              {/* Search */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--adriatic)', display: 'block', marginBottom: '4px' }}>
                  Search Packages
                </label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                  <input
                    type="text"
                    placeholder="Search package name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>

              {/* Destination Filter */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--adriatic)', display: 'block', marginBottom: '4px' }}>
                  Destination
                </label>
                <select
                  className="form-control"
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                >
                  <option value="">All Destinations</option>
                  {destinationsList.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Theme Filter */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--adriatic)', display: 'block', marginBottom: '4px' }}>
                  Travel Theme
                </label>
                <select
                  className="form-control"
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                >
                  {themes.map(t => (
                    <option key={t} value={t === 'All' ? '' : t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Price Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--adriatic)', marginBottom: '4px' }}>
                  <span>Max Price:</span>
                  <span style={{ color: 'var(--terracotta)' }}>${maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="6000"
                  step="250"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--terracotta)', cursor: 'pointer' }}
                />
              </div>

              {/* Sort By */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--adriatic)', display: 'block', marginBottom: '4px' }}>
                  Sort By
                </label>
                <select
                  className="form-control"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Guest Rating</option>
                  <option value="duration">Duration (Longest)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--sage)' }}>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>
                Showing <strong>{filteredPackages.length}</strong> available packages
              </span>
              <button
                onClick={resetFilters}
                style={{ fontSize: '0.85rem', color: 'var(--terracotta)', fontWeight: 600, textDecoration: 'underline' }}
              >
                Reset All Filters
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <SkeletonGrid count={6} />
          ) : filteredPackages.length === 0 ? (
            <EmptyState
              icon={PackageIcon}
              title="No Packages Found"
              description="We couldn't find any packages matching your search criteria. Try adjusting your price slider or theme."
              actionText="Reset Filters"
              onAction={resetFilters}
            />
          ) : (
            <>
              <div className="cards-grid">
                {paginatedPackages.map((pkg) => (
                  <div key={pkg.id} className="travel-card">
                    <div className="card-image-box">
                      <SmartImage src={pkg.image} alt={pkg.title} aspectRatio="16/10" />
                      <div className="card-badge">
                        <Badge variant="terracotta">{pkg.theme}</Badge>
                      </div>
                    </div>
                    <div className="card-body">
                      <div style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        {pkg.destinationName}
                      </div>
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

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                totalItems={filteredPackages.length}
                pageSize={pageSize}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}
