import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get(`/posts/${id}/`).then(({ data }) => {
      setPost(data);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return;
    setDeleting(true);
    await api.delete(`/posts/${id}/`);
    navigate('/my-posts');
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner} />
        <p style={{ color: '#64748b', marginTop: 16 }}>Loading listing...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={styles.loadingPage}>
        <p style={{ color: '#64748b' }}>Listing not found.</p>
        <Link to="/" style={styles.backLink}>← Back to listings</Link>
      </div>
    );
  }

  const canEdit = user && (user.id === post.author_id || user.is_staff);
  const imgUrl = (img) => img.startsWith('http') ? img : `http://localhost:8000${img}`;

  const initials = post.author_username
    ? post.author_username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Breadcrumb */}
        <nav style={styles.breadcrumb}>
          <Link to="/" style={styles.breadcrumbLink}>Home</Link>
          <span style={styles.breadcrumbSep}>/</span>
          <Link to="/" style={styles.breadcrumbLink}>Listings</Link>
          <span style={styles.breadcrumbSep}>/</span>
          <span style={styles.breadcrumbCurrent}>{post.title}</span>
        </nav>

        {/* Main layout */}
        <div style={styles.layout}>
          {/* Left: Image gallery (55%) */}
          <div style={styles.galleryCol}>
            {post.images.length > 0 ? (
              <>
                <div style={styles.mainImgWrap}>
                  <img
                    src={imgUrl(post.images[activeImg].image)}
                    alt={post.title}
                    style={styles.mainImg}
                  />
                </div>
                {post.images.length > 1 && (
                  <div style={styles.thumbsRow}>
                    {post.images.map((img, i) => (
                      <button
                        key={img.id}
                        style={{
                          ...styles.thumbBtn,
                          ...(i === activeImg ? styles.thumbBtnActive : {}),
                        }}
                        onClick={() => setActiveImg(i)}
                      >
                        <img
                          src={imgUrl(img.image)}
                          alt={`thumb ${i + 1}`}
                          style={styles.thumbImg}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={styles.noImgPlaceholder}>
                <span style={{ fontSize: 64 }}>🚗</span>
                <p style={{ color: '#94a3b8', marginTop: 12, fontSize: 15 }}>No photos available</p>
              </div>
            )}
          </div>

          {/* Right: Details (45%) */}
          <div style={styles.detailsCol}>
            {/* Price */}
            <div style={styles.priceTag}>
              €{Number(post.price).toLocaleString()}
            </div>

            {/* Title */}
            <h1 style={styles.postTitle}>{post.title}</h1>

            {/* Seller info */}
            <div style={styles.sellerRow}>
              <div style={styles.avatarCircle}>{initials}</div>
              <div>
                <div style={styles.sellerLabel}>Listed by</div>
                <div style={styles.sellerName}>{post.author_username}</div>
              </div>
              <div style={styles.dateBadge}>
                {new Date(post.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </div>
            </div>

            {/* Description card */}
            <div style={styles.infoCard}>
              <div style={styles.infoCardHeader}>
                <span style={styles.infoCardIcon}>📝</span>
                <h3 style={styles.infoCardTitle}>Description</h3>
              </div>
              <p style={styles.descText}>{post.description}</p>
            </div>

            {/* Contact card */}
            <div style={styles.infoCard}>
              <div style={styles.infoCardHeader}>
                <span style={styles.infoCardIcon}>📞</span>
                <h3 style={styles.infoCardTitle}>Contact Seller</h3>
              </div>
              <div style={styles.contactValue}>{post.contact_info}</div>
            </div>

            {/* Edit/Delete actions */}
            {canEdit && (
              <div style={styles.actionsRow}>
                <Link to={`/edit-post/${post.id}`} style={styles.editBtn}>
                  ✏️ Edit Listing
                </Link>
                <button
                  onClick={handleDelete}
                  style={styles.deleteBtn}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : '🗑️ Delete Listing'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
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
  loadingPage: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #e63946',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '32px 24px 64px',
    flex: 1,
  },

  // Breadcrumb
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 28,
    fontSize: 14,
  },
  breadcrumbLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontWeight: 500,
  },
  backLink: {
    color: '#e63946',
    textDecoration: 'none',
    fontWeight: 600,
  },
  breadcrumbSep: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  breadcrumbCurrent: {
    color: '#0f172a',
    fontWeight: 600,
    maxWidth: 300,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  // Layout
  layout: {
    display: 'grid',
    gridTemplateColumns: '55% 1fr',
    gap: 40,
    alignItems: 'start',
  },

  // Gallery
  galleryCol: {},
  mainImgWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    background: '#e2e8f0',
  },
  mainImg: {
    width: '100%',
    height: 380,
    objectFit: 'cover',
    display: 'block',
  },
  thumbsRow: {
    display: 'flex',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  thumbBtn: {
    border: '2px solid transparent',
    borderRadius: 8,
    padding: 0,
    cursor: 'pointer',
    background: 'none',
    overflow: 'hidden',
    transition: 'border-color 0.15s',
  },
  thumbBtnActive: {
    borderColor: '#e63946',
  },
  thumbImg: {
    width: 72,
    height: 56,
    objectFit: 'cover',
    display: 'block',
  },
  noImgPlaceholder: {
    background: '#f1f5f9',
    border: '2px dashed #e2e8f0',
    borderRadius: 16,
    height: 380,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Details
  detailsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  priceTag: {
    fontSize: 38,
    fontWeight: 800,
    color: '#e63946',
    letterSpacing: '-0.02em',
  },
  postTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
    lineHeight: 1.3,
  },
  sellerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '12px 16px',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#e63946',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    letterSpacing: '0.05em',
  },
  sellerLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  sellerName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#0f172a',
  },
  dateBadge: {
    marginLeft: 'auto',
    fontSize: 12,
    color: '#64748b',
    background: '#f1f5f9',
    padding: '4px 10px',
    borderRadius: 6,
    flexShrink: 0,
  },
  infoCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '20px',
  },
  infoCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoCardIcon: {
    fontSize: 16,
  },
  infoCardTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    margin: 0,
  },
  descText: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 1.7,
    margin: 0,
  },
  contactValue: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: 500,
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '10px 14px',
  },

  // Actions
  actionsRow: {
    display: 'flex',
    gap: 12,
    marginTop: 4,
  },
  editBtn: {
    flex: 1,
    padding: '11px 16px',
    background: '#0f172a',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'center',
  },
  deleteBtn: {
    flex: 1,
    padding: '11px 16px',
    background: 'transparent',
    border: '2px solid #e63946',
    color: '#e63946',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
