import React, { useState } from 'react';
import Footer from '../components/Footer';

const CONTACT_INFO = [
  {
    icon: '📍',
    label: 'Our Address',
    value: 'Blvd. Partizanski Odredi 359, 1000 Skopje\nMacedonia',
  },
  {
    icon: '📞',
    label: 'Phone Number',
    value: '+389 2 312 4455',
  },
  {
    icon: '📧',
    label: 'Email Address',
    value: 'kontakt@carmarket.mk',
  },
  {
    icon: '🕐',
    label: 'Working Hours',
    value: 'Mon–Fri: 09:00–17:00\nSat: 10:00–14:00',
  },
];

const TEAM = [
  {
    initials: 'AP',
    name: 'Aleksandar Petrovski',
    title: 'Founder & CEO',
    bio: 'Aleksandar founded CarMarket in 2020 with a vision to transform how people buy and sell cars across the Balkans.',
  },
  {
    initials: 'MT',
    name: 'Marija Todorovska',
    title: 'Head of Marketing',
    bio: 'Marija drives brand growth and digital strategy, making sure CarMarket reaches buyers and sellers across the region.',
  },
  {
    initials: 'NJ',
    name: 'Nikola Jovanovski',
    title: 'Lead Engineer',
    bio: 'Nikola leads the technical team and ensures the platform runs smoothly, securely, and at scale.',
  },
  {
    initials: 'AS',
    name: 'Ana Stefanovska',
    title: 'Customer Support',
    bio: 'Ana is always here to help — from posting your first listing to resolving any technical questions you might have.',
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div style={styles.page}>
      {/* ── PAGE HERO ── */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroBadge}>Get in Touch</div>
          <h1 style={styles.heroTitle}>Contact Us</h1>
          <p style={styles.heroSub}>
            Have a question or need help? Our team is here for you. We typically respond within one business day.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section style={styles.mainSection}>
        <div style={styles.container}>
          <div style={styles.grid}>
            {/* Left: Contact info cards */}
            <div style={styles.infoCol}>
              <h2 style={styles.colTitle}>Contact Information</h2>
              <p style={styles.colSub}>Reach us through any of the following channels.</p>

              <div style={styles.infoCards}>
                {CONTACT_INFO.map((item, i) => (
                  <div key={i} style={styles.infoCard}>
                    <div style={styles.infoIconWrap}>
                      <span style={styles.infoIcon}>{item.icon}</span>
                    </div>
                    <div style={styles.infoContent}>
                      <div style={styles.infoLabel}>{item.label}</div>
                      <div style={styles.infoValue}>
                        {item.value.split('\n').map((line, j) => (
                          <span key={j}>
                            {line}
                            {j < item.value.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social note */}
              <div style={styles.socialNote}>
                <p style={styles.socialNoteText}>
                  You can also reach us on social media or through the feedback form on this page. We read every message.
                </p>
              </div>
            </div>

            {/* Right: Contact form */}
            <div style={styles.formCol}>
              <div style={styles.formCard}>
                <h2 style={styles.formTitle}>Send Us a Message</h2>
                <p style={styles.formSub}>Fill out the form below and we'll get back to you shortly.</p>

                {submitted ? (
                  <div style={styles.successBox}>
                    <div style={styles.successIcon}>✅</div>
                    <h3 style={styles.successTitle}>Message Sent!</h3>
                    <p style={styles.successText}>
                      Thank you for reaching out. We've received your message and will respond within one business day.
                    </p>
                    <button
                      style={styles.resetBtn}
                      onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setSubmitted(false); }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formRow}>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Your Name *</label>
                        <input
                          style={styles.input}
                          placeholder="e.g. Marko Kovačević"
                          required
                          value={form.name}
                          onChange={update('name')}
                        />
                      </div>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Email Address *</label>
                        <input
                          style={styles.input}
                          type="email"
                          placeholder="your@email.com"
                          required
                          value={form.email}
                          onChange={update('email')}
                        />
                      </div>
                    </div>

                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Subject *</label>
                      <input
                        style={styles.input}
                        placeholder="What is your message about?"
                        required
                        value={form.subject}
                        onChange={update('subject')}
                      />
                    </div>

                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Message *</label>
                      <textarea
                        style={{ ...styles.input, height: 140, resize: 'vertical' }}
                        placeholder="Write your message here..."
                        required
                        value={form.message}
                        onChange={update('message')}
                      />
                    </div>

                    <button type="submit" style={styles.submitBtn}>
                      Send Message →
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM SECTION ── */}
      <section style={styles.teamSection}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={styles.teamSectionTitle}>Meet the Team</h2>
            <p style={styles.teamSectionSub}>The people behind CarMarket</p>
          </div>
          <div style={styles.teamGrid}>
            {TEAM.map((member, i) => (
              <div key={i} style={styles.teamCard}>
                <div style={styles.teamAvatar}>{member.initials}</div>
                <h3 style={styles.teamName}>{member.name}</h3>
                <p style={styles.teamTitle}>{member.title}</p>
                <p style={styles.teamBio}>{member.bio}</p>
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
    maxWidth: 640,
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

  // Main section
  mainSection: {
    padding: '72px 0 80px',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.4fr',
    gap: 48,
    alignItems: 'start',
  },

  // Info column
  infoCol: {},
  colTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 8px',
    letterSpacing: '-0.01em',
  },
  colSub: {
    fontSize: 15,
    color: '#64748b',
    margin: '0 0 28px',
  },
  infoCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  infoCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
  },
  infoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: '#fff0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoContent: {},
  infoLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  socialNote: {
    marginTop: 24,
    background: '#f0f4ff',
    border: '1px solid #c7d2fe',
    borderRadius: 12,
    padding: '16px 20px',
  },
  socialNoteText: {
    fontSize: 14,
    color: '#3730a3',
    margin: 0,
    lineHeight: 1.6,
  },

  // Form column
  formCol: {},
  formCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '36px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 6px',
  },
  formSub: {
    fontSize: 14,
    color: '#64748b',
    margin: '0 0 28px',
  },
  form: {},
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
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
    padding: '11px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 14,
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
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 4,
  },

  // Success
  successBox: {
    textAlign: 'center',
    padding: '32px 16px',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 10px',
  },
  successText: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 1.6,
    margin: '0 0 24px',
  },
  resetBtn: {
    background: 'transparent',
    border: '2px solid #e63946',
    color: '#e63946',
    borderRadius: 8,
    padding: '10px 24px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },

  // Team
  teamSection: {
    background: '#f8fafc',
    padding: '72px 0 80px',
    borderTop: '1px solid #e2e8f0',
  },
  teamSectionTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 8px',
    letterSpacing: '-0.02em',
  },
  teamSectionSub: {
    fontSize: 15,
    color: '#64748b',
    margin: 0,
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
    padding: '28px 20px',
    textAlign: 'center',
  },
  teamAvatar: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: '#e63946',
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 14px',
  },
  teamName: {
    fontSize: 15,
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 4px',
  },
  teamTitle: {
    fontSize: 13,
    color: '#e63946',
    fontWeight: 600,
    margin: '0 0 10px',
  },
  teamBio: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 1.5,
    margin: 0,
  },
};
