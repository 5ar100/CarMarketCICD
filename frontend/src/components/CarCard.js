import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CarCard({ post }) {
  const firstImage = post.images?.[0]?.image;
  const [hovered, setHovered] = useState(false);

  const imgSrc = firstImage
    ? (firstImage.startsWith('http') ? firstImage : `http://localhost:8000${firstImage}`)
    : null;

  const initials = post.author_username
    ? post.author_username.slice(0, 2).toUpperCase()
    : '??';

  const dateStr = post.created_at
    ? new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  const desc = post.description
    ? (post.description.length > 90 ? post.description.slice(0, 90) + '...' : post.description)
    : '';

  const specPills = [
    post.year ? String(post.year) : null,
    post.fuel_type ? (post.fuel_type.charAt(0).toUpperCase() + post.fuel_type.slice(1)) : null,
    post.transmission ? (post.transmission.charAt(0).toUpperCase() + post.transmission.slice(1)) : null,
    post.horsepower ? `${post.horsepower} hp` : null,
    post.mileage ? `${Number(post.mileage).toLocaleString()} km` : null,
  ].filter(Boolean);

  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 16px 40px rgba(0,0,0,0.14)'
          : '0 2px 12px rgba(0,0,0,0.07)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div style={styles.imgArea}>
        {imgSrc ? (
          <img src={imgSrc} alt={post.title} style={styles.img} />
        ) : (
          <div style={styles.noImg}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="40" height="40" rx="8" fill="#e2e8f0" />
              <path d="M10 30 L10 26 L15 26 L19 19 L29 19 L34 24 L38 24 L38 30 Z" fill="#94a3b8" />
              <circle cx="16" cy="30" r="3" fill="#94a3b8" />
              <circle cx="32" cy="30" r="3" fill="#94a3b8" />
            </svg>
            <span style={{ color: '#94a3b8', fontSize: 13, marginTop: 8 }}>No photo</span>
          </div>
        )}
        {/* Price badge overlay */}
        <div style={styles.priceBadge}>
          €{Number(post.price).toLocaleString()}
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {/* Title */}
        <h3 style={styles.title}>{post.title}</h3>

        {/* Spec pills */}
        {specPills.length > 0 && (
          <div style={styles.specPillRow}>
            {specPills.map((pill, i) => (
              <span key={i} style={styles.specPill}>{pill}</span>
            ))}
          </div>
        )}

        {/* Seller row */}
        <div style={styles.sellerRow}>
          <div style={styles.avatarCircle}>{initials}</div>
          <span style={styles.sellerName}>{post.author_username}</span>
          <span style={styles.dateText}>{dateStr}</span>
        </div>

        {/* Description snippet */}
        {desc && <p style={styles.desc}>{desc}</p>}

        {/* Footer row */}
        <div style={styles.footerRow}>
          <Link to={`/posts/${post.id}`} style={styles.viewLink}>
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  },
  imgArea: {
    position: 'relative',
    width: '100%',
    height: 200,
    overflow: 'hidden',
    background: '#f1f5f9',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImg: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    background: '#e63946',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 20,
    letterSpacing: '0.02em',
  },
  body: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  title: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 600,
    margin: 0,
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  sellerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  avatarCircle: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: '#e63946',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    letterSpacing: '0.05em',
  },
  sellerName: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: 500,
    flex: 1,
  },
  dateText: {
    color: '#64748b',
    fontSize: 12,
  },
  desc: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 1.5,
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  viewLink: {
    color: '#e63946',
    fontSize: 13,
    fontWeight: 600,
    textDecoration: 'none',
  },
  specPillRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
  },
  specPill: {
    background: '#f1f5f9',
    color: '#374151',
    fontSize: 12,
    fontWeight: 500,
    padding: '3px 8px',
    borderRadius: 20,
    whiteSpace: 'nowrap',
  },
};
