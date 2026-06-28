import React from 'react';
import Footer from '../components/Footer';

const TEAM = [
  { initials: 'АП', name: 'Александар Петровски', title: 'CEO' },
  { initials: 'МТ', name: 'Марија Тодоровска', title: 'Marketing' },
  { initials: 'НЈ', name: 'Никола Јовановски', title: 'Engineering' },
  { initials: 'АС', name: 'Ана Стефановска', title: 'Support' },
];

const FEATURES = [
  {
    icon: '🔒',
    title: 'Security & Trust',
    desc: 'All listings are reviewed to ensure authenticity. We protect both buyers and sellers throughout every transaction.',
  },
  {
    icon: '⚡',
    title: 'Easy to Use',
    desc: 'Post your car in under 5 minutes. Our streamlined interface makes buying and selling effortless.',
  },
  {
    icon: '🎁',
    title: 'Completely Free',
    desc: 'No hidden fees, no commissions. List your vehicle and connect with buyers at absolutely no cost.',
  },
];

export default function About() {
  return (
    <div style={styles.page}>
      {/* ── PAGE HERO ── */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroBadge}>Our Story</div>
          <h1 style={styles.heroTitle}>About CarMarket</h1>
          <p style={styles.heroSub}>
            Connecting car buyers and sellers across Macedonia and the Balkans since 2020, Est. in Skopje. We believe buying and selling a car should be simple, transparent, and free.
          </p>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section style={styles.missionSection}>
        <div style={styles.container}>
          <div style={styles.missionGrid}>
            <div style={styles.missionText}>
              <div style={styles.sectionTag}>Our Mission</div>
              <h2 style={styles.missionTitle}>Empowering the Macedonian and Balkan Car Market</h2>
              <p style={styles.missionDesc}>
                CarMarket was founded in Скопје, Македонија with a simple mission: to create the most trusted and accessible car marketplace in Southeast Europe. We saw a fragmented market where buyers struggled to find reliable listings and sellers couldn't reach the right audience.
              </p>
              <p style={styles.missionDesc}>
                Today, we serve thousands of users across Macedonia, Serbia, Croatia, Bosnia & Herzegovina, Montenegro, and beyond — providing a unified Balkan platform that makes the process of buying and selling vehicles as smooth as possible.
              </p>
              <p style={styles.missionDesc}>
                We are committed to transparency, quality, and community. Every feature we build is designed to save you time and give you confidence in your car transaction across the Balkans.
              </p>
              <div style={styles.missionHighlights}>
                {['Free to list — no commissions', 'Verified seller profiles', 'Multi-photo listings', 'Direct buyer contact'].map((item, i) => (
                  <div key={i} style={styles.highlight}>
                    <span style={styles.checkmark}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.missionImageWrap}>
              <div style={styles.missionImagePlaceholder}>
                <div style={styles.carEmoji}>🚗</div>
                <div style={styles.mapEmoji}>🗺️</div>
                <p style={styles.imagePlaceholderText}>The Balkans</p>
                <p style={styles.imagePlaceholderSub}>Your trusted car marketplace</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={styles.statsSection}>
        <div style={styles.container}>
          <div style={styles.statsGrid}>
            {[
              { value: '7+', label: 'Active Listings', icon: '📋' },
              { value: '7+', label: 'Registered Sellers', icon: '👥' },
              { value: '6', label: 'Countries Covered', icon: '🌍' },
              { value: '2020', label: 'Est. in Skopje', icon: '🏆' },
            ].map((stat, i) => (
              <div key={i} style={styles.statCard}>
                <span style={styles.statIcon}>{stat.icon}</span>
                <span style={styles.statValue}>{stat.value}</span>
                <span style={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section style={styles.whySection}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={styles.sectionTag}>Why CarMarket</div>
            <h2 style={styles.sectionTitle}>Built for Buyers and Sellers</h2>
            <p style={styles.sectionSub}>Everything you need to buy or sell with confidence</p>
          </div>
          <div style={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} style={styles.featureCard}>
                <div style={styles.featureIcon}>{f.icon}</div>
                <h3 style={styles.featureTitle}>{f.title}</h3>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={styles.teamSection}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={styles.sectionTag}>The Team</div>
            <h2 style={styles.sectionTitle}>Meet the People Behind CarMarket</h2>
            <p style={styles.sectionSub}>A passionate team dedicated to transforming the Balkan car market</p>
          </div>
          <div style={styles.teamGrid}>
            {TEAM.map((member, i) => (
              <div key={i} style={styles.teamCard}>
                <div style={styles.teamAvatar}>{member.initials}</div>
                <h3 style={styles.teamName}>{member.name}</h3>
                <p style={styles.teamTitle}>{member.title}</p>
              </div>
            ))}
          </div>
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
  hero: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
    padding: '80px 24px 72px',
  },
  heroInner: {
    maxWidth: 680,
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
    marginBottom: 20,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 800,
    margin: '0 0 16px',
    letterSpacing: '-0.02em',
  },
  heroSub: {
    color: '#94a3b8',
    fontSize: 18,
    lineHeight: 1.6,
    margin: 0,
  },

  // Mission
  missionSection: {
    background: '#ffffff',
    padding: '80px 0',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
  },
  missionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 64,
    alignItems: 'center',
  },
  missionText: {},
  sectionTag: {
    display: 'inline-block',
    color: '#e63946',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 12,
  },
  missionTitle: {
    fontSize: 32,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 20px',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  missionDesc: {
    color: '#64748b',
    fontSize: 15,
    lineHeight: 1.7,
    margin: '0 0 16px',
  },
  missionHighlights: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  highlight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#0f172a',
    fontSize: 15,
    fontWeight: 500,
  },
  checkmark: {
    color: '#22c55e',
    fontWeight: 700,
    fontSize: 16,
  },
  missionImageWrap: {},
  missionImagePlaceholder: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    borderRadius: 20,
    padding: 48,
    textAlign: 'center',
    minHeight: 320,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carEmoji: { fontSize: 64, marginBottom: 8 },
  mapEmoji: { fontSize: 40, marginBottom: 16 },
  imagePlaceholderText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 700,
    margin: '0 0 8px',
  },
  imagePlaceholderSub: {
    color: '#64748b',
    fontSize: 14,
    margin: 0,
  },

  // Stats
  statsSection: {
    background: '#f8fafc',
    padding: '64px 0',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 24,
  },
  statCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '32px 16px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  statIcon: { fontSize: 28, marginBottom: 4 },
  statValue: {
    fontSize: 36,
    fontWeight: 800,
    color: '#e63946',
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: 500,
  },

  // Why Us
  whySection: {
    background: '#ffffff',
    padding: '80px 0',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 8px',
    letterSpacing: '-0.02em',
  },
  sectionSub: {
    fontSize: 16,
    color: '#64748b',
    margin: 0,
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24,
  },
  featureCard: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '32px 24px',
    textAlign: 'center',
  },
  featureIcon: { fontSize: 40, marginBottom: 16 },
  featureTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 10px',
  },
  featureDesc: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 1.6,
    margin: 0,
  },

  // Team
  teamSection: {
    background: '#f8fafc',
    padding: '80px 0',
    borderTop: '1px solid #e2e8f0',
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 24,
  },
  teamCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '36px 24px',
    textAlign: 'center',
  },
  teamAvatar: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: '#e63946',
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  teamName: {
    fontSize: 17,
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 6px',
  },
  teamTitle: {
    fontSize: 14,
    color: '#64748b',
    margin: 0,
  },
};
