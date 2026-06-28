import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.password2);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const msgs = Object.values(data).flat().join(' ');
        setError(msgs);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div style={styles.page}>
      {/* Left panel — dark navy */}
      <div style={styles.leftPanel}>
        <div style={styles.leftInner}>
          <Link to="/" style={{ display: 'inline-flex' }}>
            <Logo size="lg" light />
          </Link>
          <p style={styles.tagline}>
            Join thousands of buyers and sellers across the Balkans.
          </p>
          <div style={styles.benefits}>
            {[
              'Create your account in seconds',
              'Post your first listing for free',
              'Connect with verified buyers',
              'No hidden fees or commissions',
            ].map((item, i) => (
              <div key={i} style={styles.benefit}>
                <span style={styles.benefitCheck}>✓</span>
                <span style={styles.benefitText}>{item}</span>
              </div>
            ))}
          </div>
          <div style={styles.leftQuote}>
            <p style={styles.quoteText}>"Sold my car in just 3 days through CarMarket. Unbelievably easy!"</p>
            <p style={styles.quoteAuthor}>— Nikola T., Belgrade</p>
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
            <h1 style={styles.formTitle}>Create Account</h1>
            <p style={styles.formSub}>Join CarMarket and start buying or selling today</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Username *</label>
              <input
                style={styles.input}
                placeholder="Choose a username"
                required
                value={form.username}
                onChange={update('username')}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={update('email')}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password *</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Create a strong password"
                required
                value={form.password}
                onChange={update('password')}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Confirm Password *</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Repeat your password"
                required
                value={form.password2}
                onChange={update('password2')}
              />
            </div>

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.switchLink}>Sign in</Link>
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
  leftQuote: {
    marginTop: 40,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: '20px 24px',
  },
  quoteText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 1.6,
    margin: '0 0 8px',
  },
  quoteAuthor: {
    color: '#64748b',
    fontSize: 13,
    margin: 0,
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
    marginBottom: 28,
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
    marginBottom: 18,
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
    marginTop: 8,
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
