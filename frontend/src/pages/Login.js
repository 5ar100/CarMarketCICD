import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left panel — dark navy */}
      <div style={styles.leftPanel}>
        <div style={styles.leftInner}>
          <Link to="/" style={{ display: 'inline-flex' }}>
            <Logo size="lg" light />
          </Link>
          <p style={styles.tagline}>
            The Balkans' most trusted car marketplace.
          </p>
          <div style={styles.benefits}>
            {[
              'Free to list your vehicle',
              'Reach buyers across the Balkans',
              'Simple and fast — list in minutes',
              'Trusted by thousands of sellers',
            ].map((item, i) => (
              <div key={i} style={styles.benefit}>
                <span style={styles.benefitCheck}>✓</span>
                <span style={styles.benefitText}>{item}</span>
              </div>
            ))}
          </div>
          <div style={styles.leftFooter}>
            <p style={styles.leftFooterText}>© 2026 CarMarket</p>
          </div>
        </div>
      </div>

      {/* Right panel — white */}
      <div style={styles.rightPanel}>
        <div style={styles.formWrap}>
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Welcome Back</h1>
            <p style={styles.formSub}>Sign in to your CarMarket account</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Username</label>
              <input
                style={styles.input}
                placeholder="Enter your username"
                required
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Enter your password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.switchLink}>Create one for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
  },
  leftPanel: {
    flex: '0 0 42%',
    background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)',
    display: 'flex',
    flexDirection: 'column',
    padding: '48px 56px',
  },
  leftInner: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  tagline: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 1.6,
    marginTop: 32,
    marginBottom: 40,
  },
  benefits: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  benefit: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  benefitCheck: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: 'rgba(34,197,94,0.15)',
    color: '#22c55e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },
  benefitText: {
    color: '#cbd5e1',
    fontSize: 15,
  },
  leftFooter: {
    marginTop: 'auto',
    paddingTop: 32,
  },
  leftFooterText: {
    color: '#475569',
    fontSize: 13,
  },

  // Right panel
  rightPanel: {
    flex: 1,
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 40px',
  },
  formWrap: {
    width: '100%',
    maxWidth: 420,
  },
  formHeader: {
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 32,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 8px',
    letterSpacing: '-0.02em',
  },
  formSub: {
    fontSize: 15,
    color: '#64748b',
    margin: 0,
  },
  errorBox: {
    background: '#fff1f2',
    border: '1px solid #fecdd3',
    color: '#be123c',
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 14,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  errorIcon: {
    flexShrink: 0,
  },
  form: {},
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 15,
    color: '#0f172a',
    background: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  submitBtn: {
    width: '100%',
    padding: '13px',
    background: '#e63946',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 4,
    transition: 'background 0.15s',
  },
  switchText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
    marginTop: 24,
  },
  switchLink: {
    color: '#e63946',
    fontWeight: 600,
    textDecoration: 'none',
  },
};
