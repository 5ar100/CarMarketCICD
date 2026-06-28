import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import CarCard from '../components/CarCard';
import Footer from '../components/Footer';

const FILTERS = [
  { label: 'All', key: 'all' },
  { label: 'Under €5k', key: '5k' },
  { label: 'Under €10k', key: '10k' },
];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    api.get('/posts/').then(({ data }) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const filtered = posts.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === '5k') return Number(p.price) < 5000;
    if (activeFilter === '10k') return Number(p.price) < 10000;
    return true;
  });

  const uniqueSellers = new Set(posts.map(p => p.author_username)).size;

  return (
    <div style={styles.page}>
      {/* ── HERO ─────────────────────────────────────── */}
      <section style={styles.hero}>
        <div style={styles.heroInner} className="anim-fade-up">
          <div style={styles.heroBadge}>🚗 #1 Car Marketplace in the Balkans</div>
          <h1 style={styles.heroTitle}>Find Your Next Car<br />in the Balkans</h1>
          <p style={styles.heroSub}>
            Browse thousands of quality vehicles from trusted sellers across Bosnia, Serbia, Croatia, and beyond.
          </p>

          {/* Search bar */}
          <div style={styles.searchWrap} className="anim-fade-up-delay-1">
            <div style={styles.searchBox}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                style={styles.searchInput}
                placeholder="Search by make, model, or keyword..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button style={styles.searchBtn}>Search</button>
            </div>
          </div>

          {/* Quick filter pills */}
          <div style={styles.pillRow}>
            {FILTERS.map(f => (
              <button
                key={f.key}
                style={{
                  ...styles.pill,
                  ...(activeFilter === f.key ? styles.pillActive : {}),
                }}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────── */}
      <section style={styles.statsStrip} className="anim-fade-in">
        <div style={styles.statsInner}>
          {[
            { icon: '📋', value: posts.length, label: 'Active Listings' },
            { icon: '👥', value: uniqueSellers, label: 'Registered Sellers' },
            { icon: '📅', value: 'Since 2020', label: 'In Business' },
            { icon: '✅', value: 'Free', label: 'To List Your Car' },
          ].map((stat, i) => (
            <div key={i} style={styles.statItem}>
              <span style={styles.statIcon}>{stat.icon}</span>
              <span style={styles.statValue}>{stat.value}</span>
              <span style={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── LISTINGS ─────────────────────────────────── */}
      <section style={styles.listingsSection}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Latest Listings</h2>
              <p style={styles.sectionSub}>
                {loading ? 'Loading...' : `${filtered.length} vehicle${filtered.length !== 1 ? 's' : ''} available`}
              </p>
            </div>
            <Link to="/listings" style={styles.viewAllLink}>View All →</Link>
          </div>

          {loading ? (
            <div style={styles.loadingState}>
              <div style={styles.spinner} />
              <p style={{ color: '#64748b', marginTop: 16 }}>Loading listings...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={{ fontSize: 48 }}>🚗</span>
              <h3 style={{ color: '#0f172a', marginTop: 16 }}>No listings found</h3>
              <p style={{ color: '#64748b', marginTop: 8 }}>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {filtered.slice(0, 4).map((post, idx) => (
                <div key={post.id} className={`anim-fade-up-delay-${(idx % 4) + 1}`}>
                  <CarCard post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section style={styles.howSection}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={styles.sectionTitle}>How It Works</h2>
            <p style={styles.sectionSub}>Get started in three simple steps</p>
          </div>
          <div style={styles.stepsGrid}>
            {[
              {
                num: '01',
                icon: '👤',
                title: 'Create Account',
                desc: 'Sign up for free in under a minute. No credit card required.',
              },
              {
                num: '02',
                icon: '📸',
                title: 'Post Your Car',
                desc: 'Add photos, set your price, and describe your vehicle in detail.',
              },
              {
                num: '03',
                icon: '🤝',
                title: 'Connect with Buyers',
                desc: 'Receive inquiries directly and close the deal on your terms.',
              },
            ].map((step, i) => (
              <div key={i} style={styles.stepCard} className={`anim-fade-up-delay-${i + 1}`}>
                <div style={styles.stepNum}>{step.num}</div>
                <div style={styles.stepIcon}>{step.icon}</div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────── */}
      <section style={styles.ctaBanner}>
        <div style={styles.ctaInner}>
          <h2 style={styles.ctaTitle}>Ready to Sell Your Car?</h2>
          <p style={styles.ctaSub}>
            Join thousands of sellers across the Balkans. Listing is completely free.
          </p>
          <Link to="/create-post" style={styles.ctaBtn}>
            Post Free Ad
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
  },

  // Hero
  hero: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
    padding: '80px 24px 64px',
  },
  heroInner: {
    maxWidth: 720,
    margin: '0 auto',
    textAlign: 'center',
  },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(230,57,70,0.18)',
    color: '#e63946',
    border: '1px solid rgba(230,57,70,0.35)',
    borderRadius: 20,
    padding: '6px 16px',
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 24,
    letterSpacing: '0.02em',
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 52,
    fontWeight: 800,
    lineHeight: 1.1,
    margin: '0 0 20px',
    letterSpacing: '-0.02em',
  },
  heroSub: {
    color: '#94a3b8',
    fontSize: 18,
    lineHeight: 1.6,
    margin: '0 0 40px',
  },
  searchWrap: {
    marginBottom: 24,
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    borderRadius: 50,
    padding: '6px 6px 6px 20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    maxWidth: 580,
    margin: '0 auto',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: 15,
    color: '#0f172a',
    background: 'transparent',
    padding: '8px 0',
  },
  searchBtn: {
    background: '#e63946',
    color: '#ffffff',
    border: 'none',
    borderRadius: 40,
    padding: '10px 24px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    flexShrink: 0,
  },
  pillRow: {
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  pill: {
    background: 'rgba(255,255,255,0.08)',
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: '7px 18px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  pillActive: {
    background: '#e63946',
    color: '#ffffff',
    border: '1px solid #e63946',
  },

  // Stats strip
  statsStrip: {
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
  },
  statsInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '32px 24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 24,
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    textAlign: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 500,
  },

  // Listings
  listingsSection: {
    padding: '64px 0',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 4px',
    letterSpacing: '-0.02em',
  },
  sectionSub: {
    fontSize: 15,
    color: '#64748b',
    margin: 0,
  },
  viewAllLink: {
    color: '#e63946',
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 24,
  },
  loadingState: {
    textAlign: 'center',
    paddingTop: 60,
    paddingBottom: 60,
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #e63946',
    borderRadius: '50%',
    margin: '0 auto',
    animation: 'spin 0.8s linear infinite',
  },
  emptyState: {
    textAlign: 'center',
    paddingTop: 60,
    paddingBottom: 60,
  },

  // How it works
  howSection: {
    background: '#ffffff',
    padding: '80px 0',
    borderTop: '1px solid #e2e8f0',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 32,
  },
  stepCard: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '32px 24px',
    textAlign: 'center',
    position: 'relative',
  },
  stepNum: {
    fontSize: 12,
    fontWeight: 700,
    color: '#e63946',
    letterSpacing: '0.1em',
    marginBottom: 16,
  },
  stepIcon: {
    fontSize: 36,
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 10px',
  },
  stepDesc: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 1.6,
    margin: 0,
  },

  // CTA Banner
  ctaBanner: {
    background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
    padding: '80px 24px',
  },
  ctaInner: {
    maxWidth: 600,
    margin: '0 auto',
    textAlign: 'center',
  },
  ctaTitle: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 800,
    margin: '0 0 16px',
    letterSpacing: '-0.02em',
  },
  ctaSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 17,
    lineHeight: 1.6,
    margin: '0 0 32px',
  },
  ctaBtn: {
    display: 'inline-block',
    background: '#ffffff',
    color: '#e63946',
    padding: '14px 36px',
    borderRadius: 50,
    fontSize: 16,
    fontWeight: 700,
    textDecoration: 'none',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  },
};
