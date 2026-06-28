import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/posts/my/').then(({ data }) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    await api.delete(`/posts/${id}/`);
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const imgUrl = (url) => url.startsWith('http') ? url : `http://localhost:8000${url}`;

  const activeCount = posts.filter(p => p.is_active !== false).length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>My Listings</h1>
            <p style={styles.pageSub}>Manage your car listings on CarMarket</p>
          </div>
          <Link to="/create-post" style={styles.newBtn}>
            + New Listing
          </Link>
        </div>

        {/* Stats bar */}
        {!loading && posts.length > 0 && (
          <div style={styles.statsBar}>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{posts.length}</span>
              <span style={styles.statLabel}>Total Listings</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={{ ...styles.statValue, color: '#22c55e' }}>{activeCount}</span>
              <span style={styles.statLabel}>Active</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={{ ...styles.statValue, color: '#f59e0b' }}>{posts.length - activeCount}</span>
              <span style={styles.statLabel}>Hidden</span>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner} />
            <p style={{ color: '#64748b', marginTop: 16 }}>Loading your listings...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIconWrap}>
              <span style={{ fontSize: 56 }}>🚗</span>
            </div>
            <h3 style={styles.emptyTitle}>No listings yet</h3>
            <p style={styles.emptyText}>
              You haven't posted any car listings. Post your first car and start reaching buyers!
            </p>
            <Link to="/create-post" style={styles.emptyBtn}>
              Post Your First Car
            </Link>
          </div>
        ) : (
          <div style={styles.listingsList}>
            {posts.map(post => {
              const thumb = post.images?.[0]?.image;
              const isActive = post.is_active !== false;

              return (
                <div key={post.id} style={styles.listingRow}>
                  {/* Thumbnail */}
                  <div style={styles.thumbWrap}>
                    {thumb ? (
                      <img
                        src={imgUrl(thumb)}
                        alt={post.title}
                        style={styles.thumbImg}
                      />
                    ) : (
                      <div style={styles.noThumb}>
                        <span style={{ fontSize: 24 }}>🚗</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={styles.rowInfo}>
                    <h3 style={styles.rowTitle}>{post.title}</h3>
                    <div style={styles.rowMeta}>
                      <span style={styles.rowPrice}>
                        €{Number(post.price).toLocaleString()}
                      </span>
                      <span style={styles.rowDot}>·</span>
                      <span style={styles.rowDate}>
                        {new Date(post.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                      <span style={styles.rowDot}>·</span>
                      <span style={{
                        ...styles.statusBadge,
                        background: isActive ? '#dcfce7' : '#fef9c3',
                        color: isActive ? '#15803d' : '#92400e',
                      }}>
                        {isActive ? '● Active' : '○ Hidden'}
                      </span>
                    </div>
                    {post.description && (
                      <p style={styles.rowDesc}>
                        {post.description.length > 100
                          ? post.description.slice(0, 100) + '...'
                          : post.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={styles.rowActions}>
                    <button
                      style={styles.viewBtn}
                      onClick={() => navigate(`/posts/${post.id}`)}
                    >
                      View
                    </button>
                    <button
                      style={styles.editBtn}
                      onClick={() => navigate(`/edit-post/${post.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
  container: {
    maxWidth: 960,
    margin: '0 auto',
    padding: '40px 24px 64px',
    flex: 1,
  },

  // Header
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 4px',
    letterSpacing: '-0.02em',
  },
  pageSub: {
    fontSize: 15,
    color: '#64748b',
    margin: 0,
  },
  newBtn: {
    background: '#e63946',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  // Stats bar
  statsBar: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    marginBottom: 24,
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: 500,
  },
  statDivider: {
    width: 1,
    height: 40,
    background: '#e2e8f0',
  },

  // Loading
  loadingState: {
    textAlign: 'center',
    paddingTop: 60,
    paddingBottom: 60,
  },
  spinner: {
    width: 36,
    height: 36,
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #e63946',
    borderRadius: '50%',
    margin: '0 auto',
    animation: 'spin 0.8s linear infinite',
  },

  // Empty state
  emptyState: {
    textAlign: 'center',
    padding: '80px 24px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
  },
  emptyIconWrap: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 10px',
  },
  emptyText: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 1.6,
    margin: '0 auto 28px',
    maxWidth: 400,
  },
  emptyBtn: {
    display: 'inline-block',
    background: '#e63946',
    color: '#ffffff',
    padding: '12px 28px',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    textDecoration: 'none',
  },

  // Listings list
  listingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  listingRow: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    transition: 'box-shadow 0.15s',
  },

  // Thumbnail
  thumbWrap: {
    width: 100,
    height: 76,
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
    background: '#f1f5f9',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  noThumb: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Row info
  rowInfo: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#0f172a',
    margin: '0 0 6px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  rowMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  rowPrice: {
    color: '#e63946',
    fontWeight: 700,
    fontSize: 15,
  },
  rowDot: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  rowDate: {
    color: '#64748b',
    fontSize: 13,
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  rowDesc: {
    fontSize: 13,
    color: '#94a3b8',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  // Row actions
  rowActions: {
    display: 'flex',
    gap: 8,
    flexShrink: 0,
  },
  viewBtn: {
    padding: '7px 14px',
    background: '#f1f5f9',
    color: '#0f172a',
    border: '1px solid #e2e8f0',
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  editBtn: {
    padding: '7px 14px',
    background: '#0f172a',
    color: '#ffffff',
    border: 'none',
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '7px 14px',
    background: 'transparent',
    color: '#e63946',
    border: '1px solid #fecdd3',
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
