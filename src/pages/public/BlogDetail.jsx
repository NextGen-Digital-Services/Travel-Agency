import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import { SmartImage } from '../../components/common/SmartImage.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/api.js';

export function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useApp();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      try {
        const item = await api.getBlogById(id);
        if (!item) {
          setBlog(null);
          setLoading(false);
          return;
        }
        setBlog(item);

        const all = await api.getBlogs();
        const related = all.filter(b => b.id !== item.id).slice(0, 3);
        setRelatedBlogs(related);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Article link copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '350px', width: '100%', borderRadius: 'var(--border-radius-md)' }} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h2>Article Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/blog')} style={{ marginTop: '1rem' }}>
          Back to Journal
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | Roamora Journal</title>
        <meta name="description" content={blog.excerpt} />
      </Helmet>

      {/* Article Header */}
      <section className="bg-adriatic" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <NavLink to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            <ArrowLeft size={16} /> Back to Travel Journal
          </NavLink>
          <div style={{ marginBottom: '0.75rem' }}>
            <Badge variant="gold">{blog.category}</Badge>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', color: 'var(--ivory)', lineHeight: 1.15, marginBottom: '1rem' }}>
            {blog.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'rgba(247, 241, 229, 0.8)', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><User size={16} color="var(--gold)" /> By {blog.author}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={16} color="var(--gold)" /> {blog.date}</span>
          </div>
        </div>
      </section>

      {/* Article Featured Image */}
      <section className="bg-ivory" style={{ padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden', boxShadow: 'var(--box-shadow-md)' }}>
            <SmartImage src={blog.image} alt={blog.title} aspectRatio="16/9" />
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="section-padding bg-ivory" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{
            backgroundColor: 'var(--white)',
            padding: '3rem',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--sage)',
            boxShadow: 'var(--box-shadow-sm)',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: '#333'
          }}>
            <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', fontStyle: 'italic', color: 'var(--terracotta)', borderLeft: '4px solid var(--gold)', paddingLeft: '1rem', marginBottom: '2rem' }}>
              "{blog.excerpt}"
            </p>
            <div style={{ whiteSpace: 'pre-line' }}>
              {blog.content}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--sage)' }}>
              <Button variant="secondary" size="sm" icon={Share2} onClick={handleShare}>
                Share Article
              </Button>
              <NavLink to="/blog" style={{ color: 'var(--terracotta)', fontWeight: 600, fontSize: '0.95rem' }}>
                Explore More Articles →
              </NavLink>
            </div>
          </div>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <div style={{ marginTop: '4rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--adriatic)', marginBottom: '1.5rem' }}>
                Related Articles
              </h3>
              <div className="cards-grid">
                {relatedBlogs.map((rel) => (
                  <div key={rel.id} className="travel-card" onClick={() => navigate(`/blog/${rel.slug}`)} style={{ cursor: 'pointer' }}>
                    <div className="card-image-box">
                      <SmartImage src={rel.image} alt={rel.title} aspectRatio="16/10" />
                    </div>
                    <div className="card-body">
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--adriatic)', marginBottom: '0.5rem' }}>{rel.title}</h4>
                      <div className="card-footer" style={{ marginTop: 'auto' }}>
                        <span style={{ color: 'var(--terracotta)', fontWeight: 600, fontSize: '0.85rem' }}>Read Article <ArrowRight size={14} /></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
