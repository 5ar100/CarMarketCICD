import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.grid}>
          {/* Column 1: Logo + tagline */}
          <div style={styles.col}>
            <Logo size="md" light />
            <p style={styles.tagline}>
              The Balkans' premier marketplace for buying and selling quality vehicles.
            </p>
            <p style={styles.copy}>© 2026 CarMarket. All rights reserved.</p>
          </div>

          {/* Column 2: Marketplace */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Marketplace</h4>
            <div style={styles.linkList}>
              <Link to="/listings" style={styles.footerLink}>Browse Cars</Link>
              <Link to="/create-post" style={styles.footerLink}>Sell Your Car</Link>
              <Link to="/my-posts" style={styles.footerLink}>My Listings</Link>
            </div>
          </div>

          {/* Column 3: Company */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Company</h4>
            <div style={styles.linkList}>
              <Link to="/about" style={styles.footerLink}>About Us</Link>
              <Link to="/contact" style={styles.footerLink}>Contact</Link>
              <Link to="/admin" style={styles.footerLink}>Admin</Link>
            </div>
          </div>

          {/* Column 4: Contact info */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Contact Us</h4>
            <div style={styles.linkList}>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📧</span>
                <span style={styles.contactText}>kontakt@carmarket.mk</span>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📞</span>
                <span style={styles.contactText}>+389 2 312 4455</span>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📍</span>
                <span style={styles.contactText}>Blvd. Partizanski Odredi 359, 1000 Skopje, Macedonia</span>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>🕐</span>
                <span style={styles.contactText}>Mon–Fri 09:00–17:00, Sat 10:00–14:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div style={styles.bottom}>
          <p style={styles.bottomText}>Built with ❤️ in the Balkans</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#0f172a',
    marginTop: 'auto',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '56px 24px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 40,
    paddingBottom: 48,
    borderBottom: '1px solid #1e293b',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  tagline: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 1.6,
    marginTop: 4,
  },
  copy: {
    color: '#475569',
    fontSize: 13,
    marginTop: 4,
  },
  colTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 4,
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  footerLink: {
    color: '#64748b',
    fontSize: 14,
    textDecoration: 'none',
    transition: 'color 0.15s',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
  },
  contactIcon: {
    fontSize: 14,
    flexShrink: 0,
    marginTop: 1,
  },
  contactText: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 1.5,
  },
  bottom: {
    padding: '20px 0',
    textAlign: 'center',
  },
  bottomText: {
    color: '#475569',
    fontSize: 13,
  },
};
