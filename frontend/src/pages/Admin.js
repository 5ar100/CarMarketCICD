import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'posts', label: 'Posts', icon: '📋' },
  { key: 'users', label: 'Users', icon: '👥' },
];

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.is_staff) { navigate('/'); return; }
    Promise.all([
      api.get('/admin-panel/posts/'),
      api.get('/admin-panel/users/'),
    ]).then(([postsRes, usersRes]) => {
      setPosts(postsRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    });
  }, [user, navigate]);

  const deletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/admin-panel/posts/${id}/`);
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user? This will also delete all their posts.')) return;
    await api.delete(`/admin-panel/users/${id}/`);
    setUsers(prev => prev.filter(u => u.id !== id));
    setPosts(prev => prev.filter(p => p.author_id !== id));
  };

  const togglePostStatus = async (post) => {
    const fd = new FormData();
    fd.append('is_active', !post.is_active);
    const { data } = await api.patch(`/admin-panel/posts/${post.id}/`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, is_active: data.is_active } : p));
  };

  if (!user?.is_staff) return null;

  const stats = {
    totalPosts: posts.length,
    activePosts: posts.filter(p => p.is_active).length,
    totalUsers: users.length,
    admins: users.filter(u => u.is_staff).length,
  };

  const recentPosts = [...posts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  return (
    <div style={styles.layout}>
      {/* ── SIDEBAR ── */}
      <aside style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.sidebarLogo}>
          <Link to="/">
            <Logo size="sm" light />
          </Link>
          <div style={styles.adminLabel}>Admin Panel</div>
        </div>

        {/* Nav */}
        <nav style={styles.sidebarNav}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              style={{
                ...styles.navItem,
                ...(tab === item.key ? styles.navItemActive : {}),
              }}
              onClick={() => setTab(item.key)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom: current user */}
        <div style={styles.sidebarFooter}>
          <div style={styles.sidebarUser}>
            <div style={styles.sidebarAvatar}>
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={styles.sidebarUsername}>{user.username}</div>
              <div style={styles.sidebarRole}>Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── CONTENT ── */}
      <main style={styles.content}>
        {/* Content header */}
        <div style={styles.contentHeader}>
          <h1 style={styles.contentTitle}>
            {tab === 'dashboard' && 'Dashboard'}
            {tab === 'posts' && 'Manage Posts'}
            {tab === 'users' && 'Manage Users'}
          </h1>
          <div style={styles.contentSub}>
            {tab === 'dashboard' && 'Overview of your marketplace activity'}
            {tab === 'posts' && `${posts.length} total posts`}
            {tab === 'users' && `${users.length} registered users`}
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner} />
            <p style={{ color: '#64748b', marginTop: 16 }}>Loading data...</p>
          </div>
        ) : (
          <>
            {/* ── DASHBOARD TAB ── */}
            {tab === 'dashboard' && (
              <div>
                {/* Stat cards */}
                <div style={styles.statsGrid}>
                  {[
                    { label: 'Total Posts', value: stats.totalPosts, icon: '📋', color: '#e63946', bg: '#fff1f2' },
                    { label: 'Active Posts', value: stats.activePosts, icon: '✅', color: '#16a34a', bg: '#dcfce7' },
                    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#2563eb', bg: '#dbeafe' },
                    { label: 'Admins', value: stats.admins, icon: '⭐', color: '#d97706', bg: '#fef3c7' },
                  ].map((s, i) => (
                    <div key={i} style={styles.statCard}>
                      <div style={{ ...styles.statIconWrap, background: s.bg }}>
                        <span style={styles.statIcon}>{s.icon}</span>
                      </div>
                      <div>
                        <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
                        <div style={styles.statLabel}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent posts */}
                <div style={styles.tableCard}>
                  <div style={styles.tableCardHeader}>
                    <h3 style={styles.tableCardTitle}>Recent Posts</h3>
                    <button style={styles.viewAllBtn} onClick={() => setTab('posts')}>View All</button>
                  </div>
                  <div style={styles.tableWrap}>
                    <table style={styles.table}>
                      <thead>
                        <tr style={styles.thead}>
                          {['Title', 'Seller', 'Price', 'Status', 'Date'].map(h => (
                            <th key={h} style={styles.th}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recentPosts.map(post => (
                          <tr key={post.id} style={styles.tr}>
                            <td style={styles.td}>
                              <a href={`/posts/${post.id}`} style={styles.tdLink} target="_blank" rel="noreferrer">
                                {post.title.length > 35 ? post.title.slice(0, 35) + '…' : post.title}
                              </a>
                            </td>
                            <td style={styles.td}>{post.author_username}</td>
                            <td style={styles.td}>€{Number(post.price).toLocaleString()}</td>
                            <td style={styles.td}>
                              <span style={post.is_active ? styles.badgeActive : styles.badgeHidden}>
                                {post.is_active ? 'Active' : 'Hidden'}
                              </span>
                            </td>
                            <td style={styles.td}>
                              {new Date(post.created_at).toLocaleDateString('en-GB')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── POSTS TAB ── */}
            {tab === 'posts' && (
              <div style={styles.tableCard}>
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.thead}>
                        {['ID', 'Title', 'Price', 'Seller', 'Status', 'Date', 'Actions'].map(h => (
                          <th key={h} style={styles.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map(post => (
                        <tr key={post.id} style={styles.tr}>
                          <td style={{ ...styles.td, color: '#94a3b8', fontSize: 12 }}>#{post.id}</td>
                          <td style={styles.td}>
                            <a href={`/posts/${post.id}`} style={styles.tdLink} target="_blank" rel="noreferrer">
                              {post.title.length > 32 ? post.title.slice(0, 32) + '…' : post.title}
                            </a>
                          </td>
                          <td style={styles.td}>€{Number(post.price).toLocaleString()}</td>
                          <td style={styles.td}>{post.author_username}</td>
                          <td style={styles.td}>
                            <span style={post.is_active ? styles.badgeActive : styles.badgeHidden}>
                              {post.is_active ? 'Active' : 'Hidden'}
                            </span>
                          </td>
                          <td style={styles.td}>
                            {new Date(post.created_at).toLocaleDateString('en-GB')}
                          </td>
                          <td style={styles.td}>
                            <div style={styles.actionBtns}>
                              <button
                                style={styles.toggleBtn}
                                onClick={() => togglePostStatus(post)}
                              >
                                {post.is_active ? 'Hide' : 'Show'}
                              </button>
                              <button
                                style={styles.deleteBtn}
                                onClick={() => deletePost(post.id)}
                              >
                                Del
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── USERS TAB ── */}
            {tab === 'users' && (
              <div style={styles.tableCard}>
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.thead}>
                        {['ID', 'Username', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                          <th key={h} style={styles.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} style={styles.tr}>
                          <td style={{ ...styles.td, color: '#94a3b8', fontSize: 12 }}>#{u.id}</td>
                          <td style={styles.td}>
                            <div style={styles.userCell}>
                              <div style={styles.userAvatar}>
                                {u.username.slice(0, 2).toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 500 }}>{u.username}</span>
                            </div>
                          </td>
                          <td style={styles.td}>{u.email || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                          <td style={styles.td}>
                            <span style={u.is_staff ? styles.badgeAdmin : styles.badgeUser}>
                              {u.is_staff ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td style={styles.td}>
                            {new Date(u.date_joined).toLocaleDateString('en-GB')}
                          </td>
                          <td style={styles.td}>
                            {!u.is_staff && (
                              <button
                                style={styles.deleteBtn}
                                onClick={() => deleteUser(u.id)}
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f8fafc',
  },

  // Sidebar
  sidebar: {
    width: 220,
    background: '#0f172a',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    position: 'sticky',
    top: 64,
    height: 'calc(100vh - 64px)',
    overflowY: 'auto',
  },
  sidebarLogo: {
    padding: '24px 20px 20px',
    borderBottom: '1px solid #1e293b',
  },
  adminLabel: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#475569',
    marginTop: 10,
  },
  sidebarNav: {
    padding: '12px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.1s, color 0.1s',
    width: '100%',
  },
  navItemActive: {
    background: '#1e293b',
    color: '#ffffff',
  },
  navIcon: {
    fontSize: 16,
    flexShrink: 0,
  },
  sidebarFooter: {
    padding: '16px 16px 20px',
    borderTop: '1px solid #1e293b',
  },
  sidebarUser: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  sidebarAvatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: '#e63946',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sidebarUsername: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: 600,
  },
  sidebarRole: {
    color: '#475569',
    fontSize: 11,
  },

  // Content
  content: {
    flex: 1,
    minWidth: 0,
    padding: '32px 32px 64px',
  },
  contentHeader: {
    marginBottom: 28,
    paddingBottom: 20,
    borderBottom: '1px solid #e2e8f0',
  },
  contentTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 4px',
    letterSpacing: '-0.02em',
  },
  contentSub: {
    fontSize: 14,
    color: '#64748b',
  },

  // Loading
  loadingState: {
    textAlign: 'center',
    paddingTop: 60,
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

  // Stats grid (dashboard)
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statIcon: { fontSize: 20 },
  statValue: {
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 500,
  },

  // Table card
  tableCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableCardHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableCardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
  },
  viewAllBtn: {
    background: 'transparent',
    border: '1px solid #e2e8f0',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 600,
    padding: '5px 12px',
    borderRadius: 6,
    cursor: 'pointer',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    background: '#f8fafc',
  },
  th: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    color: '#94a3b8',
    padding: '11px 16px',
    textAlign: 'left',
    borderBottom: '1px solid #e2e8f0',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background 0.1s',
  },
  td: {
    fontSize: 14,
    color: '#374151',
    padding: '12px 16px',
    verticalAlign: 'middle',
  },
  tdLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: 500,
  },

  // Badges
  badgeActive: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    background: '#dcfce7',
    color: '#15803d',
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 9px',
    borderRadius: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  badgeHidden: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    background: '#fef9c3',
    color: '#92400e',
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 9px',
    borderRadius: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  badgeAdmin: {
    display: 'inline-block',
    background: '#dbeafe',
    color: '#1e40af',
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 9px',
    borderRadius: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  badgeUser: {
    display: 'inline-block',
    background: '#f1f5f9',
    color: '#64748b',
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 9px',
    borderRadius: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  // User cell
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: '#e63946',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Action buttons
  actionBtns: {
    display: 'flex',
    gap: 6,
  },
  toggleBtn: {
    padding: '5px 10px',
    background: '#f1f5f9',
    color: '#374151',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '5px 10px',
    background: 'transparent',
    color: '#e63946',
    border: '1px solid #fecdd3',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
