import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Mail, Key, ShieldCheck, ArrowRight } from 'lucide-react';
import { Logo } from '../../components/common/Logo.jsx';
import { FormField } from '../../components/common/FormField.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const [email, setEmail] = useState('admin@roamora.com');
  const [password, setPassword] = useState('Admin@123');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password, remember);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Roamora Travels</title>
      </Helmet>

      <div style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        backgroundColor: 'var(--ivory)'
      }} className="admin-login-grid">
        {/* Left Form Column */}
        <div style={{
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '520px',
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <Logo size="large" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', color: 'var(--adriatic)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              Admin Management Portal
            </h2>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              Sign in to manage luxury holiday packages, client enquiries, bookings, and site settings.
            </p>
          </div>

          {/* Discreet Demo Credentials Notice */}
          <div style={{
            backgroundColor: 'var(--cream)',
            border: '1px solid var(--gold)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            fontSize: '0.85rem',
            color: 'var(--adriatic)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '0.35rem' }}>
              <Key size={16} /> Demo Administrator Credentials:
            </div>
            <div>Email: <strong>admin@roamora.com</strong></div>
            <div>Password: <strong>Admin@123</strong></div>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fce8e6',
              border: '1px solid #fad2cf',
              color: '#c5221f',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--border-radius-sm)',
              marginBottom: '1.5rem',
              fontSize: '0.88rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />
            <FormField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--espresso)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ accentColor: 'var(--terracotta)' }}
                />
                Remember me for 30 days
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              style={{ width: '100%' }}
            >
              Sign In To Admin Dashboard
            </Button>
          </form>

          <div style={{ marginTop: '3rem', fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>
            Protected area. Authorized staff only. © {new Date().getFullYear()} Roamora Travels.
          </div>
        </div>

        {/* Right Split Image Column */}
        <div style={{
          position: 'relative',
          backgroundImage: `linear-gradient(rgba(14, 42, 71, 0.4), rgba(14, 42, 71, 0.7)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '4rem',
          color: 'var(--ivory)'
        }} className="login-image-column">
          <div style={{ borderLeft: '4px solid var(--gold)', paddingLeft: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--ivory)', marginBottom: '0.5rem' }}>
              Italian Riviera Elegance
            </h3>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>
              "Your Journey. Our Expertise." — Managing luxury itineraries with white-glove precision.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
