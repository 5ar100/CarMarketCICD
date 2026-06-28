import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user
    ? user.username.slice(0, 2).toUpperCase()
    : '';

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Left: Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Logo size="md" />
        </Link>

        {/* Center: nav links (hidden below 768px) */}
        <div style={styles.centerLinks}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/listings" style={styles.navLink}>Browse Cars</Link>
          <Link to="/about" style={styles.navLink}>About</Link>
          <Link to="/contact" style={styles.navLink}>Contact</Link>
        </div>

        {/* Right: auth actions */}
        <div style={styles.rightSection}>
          {user ? (
            <>
              <Link to="/my-posts" style={styles.navLink}>My Listings</Link>
              <Link to="/create-post" style={styles.sellBtn}>
                + Sell Car
              </Link>
              {/* Avatar with dropdown */}
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  style={styles.avatar}
                  onClick={() => setDropdownOpen(prev => !prev)}
                  title={user.username}
                >
                  {initials}
                </button>
                {dropdownOpen && (
                  <div style={styles.dropdown}>
                    <div style={styles.dropdownUser}>
                      <div style={{ ...styles.avatar, width: 32, height: 32, fontSize: 12, cursor: 'default' }}>
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{user.username}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>Member</div>
                      </div>
                    </div>
                    <div style={styles.dropdownDivider} />
                    <Link
                      to="/my-posts"
                      style={styles.dropdownItem}
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Posts
                    </Link>
                    {user.is_staff && (
                      <Link
                        to="/admin"
                        style={styles.dropdownItem}
                        onClick={() => setDropdownOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <div style={styles.dropdownDivider} />
                    <button style={styles.dropdownLogout} onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>Login</Link>
              <Link to="/register" style={styles.sellBtn}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  centerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
    // Hide below 768px — simple approach with inline style
    // Since we can't use media queries inline, we use a wide enough min
    flex: 1,
    justifyContent: 'center',
  },
  navLink: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'color 0.15s',
    padding: '4px 0',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  sellBtn: {
    background: '#e63946',
    color: '#ffffff',
    padding: '8px 18px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'background 0.15s',
    whiteSpace: 'nowrap',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: '#e63946',
    color: '#ffffff',
    border: 'none',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '0.05em',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    minWidth: 200,
    overflow: 'hidden',
    zIndex: 2000,
  },
  dropdownUser: {
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  dropdownDivider: {
    height: 1,
    background: '#e2e8f0',
    margin: '0',
  },
  dropdownItem: {
    display: 'block',
    padding: '10px 16px',
    color: '#0f172a',
    fontSize: 14,
    textDecoration: 'none',
    transition: 'background 0.1s',
  },
  dropdownLogout: {
    display: 'block',
    width: '100%',
    padding: '10px 16px',
    color: '#e63946',
    fontSize: 14,
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontWeight: 500,
  },
};
