import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { SectionHeading } from '../../components/common/SectionHeading.jsx';
import { SmartImage } from '../../components/common/SmartImage.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { SkeletonGrid } from '../../components/common/Skeleton.jsx';
import { api } from '../../services/api.js';

export function Blog() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get('category') || 'All';
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  useEffect(() => {
    async function loadBlogs() {
      setLoading(true);
      try {
        const data = await api.getBlogs();
        setBlogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  const categories = ['All', 'Destination Guides', 'Luxury Travel', 'Food & Wine', 'Travel Tips', 'Honeymoon', 'Culture'];

  const handleCategorySelect = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
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

  const filteredBlogs = blogs.filter(b => {
    const matchesCategory = activeCategory === 'All' || b.category === activeCategory;
    const matchesSearch = !searchTerm ||
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>The Roamora Journal | Luxury Travel Editorial</title>
        <meta name="description" content="Read curated editorial travel guides, hidden culinary spots in Paris, Tuscan packing guides, and luxury resort insider tips." />
      </Helmet>

      {/* Header Banner */}
      <section className="section-padding bg-adriatic" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Editorial & Insights"
            title="The Roamora Journal"
            subtitle="Curated travel guides, epicurean recommendations, and insider tips from our global editors."
            light
          />

          {/* Search & Category Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '2rem' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input
                type="text"
                placeholder="Search articles or authors..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-control"
                style={{ paddingLeft: '44px', borderRadius: 'var(--border-radius-pill)', backgroundColor: 'var(--ivory)' }}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: 'var(--border-radius-pill)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    border: '1px solid',
                    borderColor: activeCategory === cat ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                    backgroundColor: activeCategory === cat ? 'var(--gold)' : 'transparent',
                    color: activeCategory === cat ? 'var(--adriatic)' : 'var(--ivory)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-padding bg-ivory">
        <div className="container">
          {loading ? (
            <SkeletonGrid count={6} />
          ) : filteredBlogs.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No Journal Articles Found"
              description={`We couldn't find any articles matching "${searchTerm || activeCategory}". Try searching for something else.`}
              actionText="Reset Filters"
              onAction={() => {
                setSearchTerm('');
                setSearchParams({});
              }}
            />
          ) : (
            <div className="cards-grid">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="travel-card"
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                  style={{ cursor: 'pointer' }}
                >
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
                    <h3 className="card-title" style={{ fontSize: '1.35rem' }}>{blog.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.25rem', lineClamp: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {blog.excerpt}
                    </p>
                    <div className="card-footer" style={{ marginTop: 'auto' }}>
                      <span style={{ color: 'var(--terracotta)', fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        Read Article <ArrowRight size={16} />
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
