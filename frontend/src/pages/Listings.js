import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

const FUEL_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Petrol', value: 'petrol' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Electric', value: 'electric' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'LPG', value: 'lpg' },
];

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Year: Newest', value: 'year_desc' },
];

const PAGE_SIZE = 20;

const DELAY_CLASSES = ['anim-fade-up-delay-1', 'anim-fade-up-delay-2', 'anim-fade-up-delay-3'];

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatMileage(val) {
  if (!val && val !== 0) return '';
  return Number(val).toLocaleString() + ' km';
}

export default function Listings() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [keyword, setKeyword] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [fuelTypes, setFuelTypes] = useState(['all']);
  const [transmission, setTransmission] = useState('all');
  const [hpMin, setHpMin] = useState('');
  const [hpMax, setHpMax] = useState('');
  const [mileageMax, setMileageMax] = useState('');

  // Applied filters (only committed on "Apply")
  const [applied, setApplied] = useState({
    keyword: '',
    priceMin: '',
    priceMax: '',
    yearFrom: '',
    yearTo: '',
    fuelTypes: ['all'],
    transmission: 'all',
    hpMin: '',
    hpMax: '',
    mileageMax: '',
  });

  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get('/posts/').then(({ data }) => {
      setPosts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleFuelChange = (value) => {
    if (value === 'all') {
      setFuelTypes(['all']);
    } else {
      setFuelTypes(prev => {
        const without = prev.filter(v => v !== 'all');
        if (without.includes(value)) {
          const next = without.filter(v => v !== value);
          return next.length === 0 ? ['all'] : next;
        }
        return [...without, value];
      });
    }
  };

  const handleApply = () => {
    setApplied({ keyword, priceMin, priceMax, yearFrom, yearTo, fuelTypes, transmission, hpMin, hpMax, mileageMax });
    setPage(1);
  };

  const handleClear = () => {
    setKeyword('');
    setPriceMin('');
    setPriceMax('');
    setYearFrom('');
    setYearTo('');
    setFuelTypes(['all']);
    setTransmission('all');
    setHpMin('');
    setHpMax('');
    setMileageMax('');
    setApplied({
      keyword: '',
      priceMin: '',
      priceMax: '',
      yearFrom: '',
      yearTo: '',
      fuelTypes: ['all'],
      transmission: 'all',
      hpMin: '',
      hpMax: '',
      mileageMax: '',
    });
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...posts];

    if (applied.keyword) {
      const kw = applied.keyword.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(kw) ||
        (p.description && p.description.toLowerCase().includes(kw))
      );
    }

    if (applied.priceMin !== '') result = result.filter(p => Number(p.price) >= Number(applied.priceMin));
    if (applied.priceMax !== '') result = result.filter(p => Number(p.price) <= Number(applied.priceMax));
    if (applied.yearFrom !== '') result = result.filter(p => p.year && Number(p.year) >= Number(applied.yearFrom));
    if (applied.yearTo !== '') result = result.filter(p => p.year && Number(p.year) <= Number(applied.yearTo));

    if (!applied.fuelTypes.includes('all')) {
      result = result.filter(p => p.fuel_type && applied.fuelTypes.includes(p.fuel_type));
    }

    if (applied.transmission !== 'all') {
      result = result.filter(p => p.transmission === applied.transmission);
    }

    if (applied.hpMin !== '') result = result.filter(p => p.horsepower && Number(p.horsepower) >= Number(applied.hpMin));
    if (applied.hpMax !== '') result = result.filter(p => p.horsepower && Number(p.horsepower) <= Number(applied.hpMax));
    if (applied.mileageMax !== '') result = result.filter(p => p.mileage && Number(p.mileage) <= Number(applied.mileageMax));

    // Sort
    if (sort === 'price_asc') result.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === 'price_desc') result.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sort === 'year_desc') result.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
    else result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return result;
  }, [posts, applied, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroBadge}>Browse Vehicles</div>
          <h1 style={styles.heroTitle}>Browse All Cars</h1>
          <p style={styles.heroSub}>
            {loading ? 'Loading...' : `${filtered.length} vehicle${filtered.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
      </section>

      {/* Body */}
      <div style={styles.body}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarCard}>
            <h2 style={styles.sidebarTitle}>Filters</h2>

            {/* Keyword */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Search</label>
              <input
                style={styles.filterInput}
                placeholder="Title or description..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleApply()}
              />
            </div>

            {/* Price */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Price (€)</label>
              <div style={styles.rangeRow}>
                <input
                  style={styles.filterInputHalf}
                  type="number"
                  placeholder="Min €"
                  min="0"
                  value={priceMin}
                  onChange={e => setPriceMin(e.target.value)}
                />
                <span style={styles.rangeSep}>–</span>
                <input
                  style={styles.filterInputHalf}
                  type="number"
                  placeholder="Max €"
                  min="0"
                  value={priceMax}
                  onChange={e => setPriceMax(e.target.value)}
                />
              </div>
            </div>

            {/* Year */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Year</label>
              <div style={styles.rangeRow}>
                <input
                  style={styles.filterInputHalf}
                  type="number"
                  placeholder="From"
                  min="1950"
                  max="2026"
                  value={yearFrom}
                  onChange={e => setYearFrom(e.target.value)}
                />
                <span style={styles.rangeSep}>–</span>
                <input
                  style={styles.filterInputHalf}
                  type="number"
                  placeholder="To"
                  min="1950"
                  max="2026"
                  value={yearTo}
                  onChange={e => setYearTo(e.target.value)}
                />
              </div>
            </div>

            {/* Fuel type */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Fuel Type</label>
              <div style={styles.checkboxList}>
                {FUEL_OPTIONS.map(opt => (
                  <label key={opt.value} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={fuelTypes.includes(opt.value)}
                      onChange={() => handleFuelChange(opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Transmission</label>
              <div style={styles.radioList}>
                {[{ label: 'All', value: 'all' }, { label: 'Manual', value: 'manual' }, { label: 'Automatic', value: 'automatic' }].map(opt => (
                  <label key={opt.value} style={styles.radioLabel}>
                    <input
                      type="radio"
                      style={styles.radio}
                      name="transmission"
                      value={opt.value}
                      checked={transmission === opt.value}
                      onChange={() => setTransmission(opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Horsepower */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Horsepower (HP)</label>
              <div style={styles.rangeRow}>
                <input
                  style={styles.filterInputHalf}
                  type="number"
                  placeholder="Min HP"
                  min="0"
                  value={hpMin}
                  onChange={e => setHpMin(e.target.value)}
                />
                <span style={styles.rangeSep}>–</span>
                <input
                  style={styles.filterInputHalf}
                  type="number"
                  placeholder="Max HP"
                  min="0"
                  value={hpMax}
                  onChange={e => setHpMax(e.target.value)}
                />
              </div>
            </div>

            {/* Mileage */}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Max Mileage (km)</label>
              <input
                style={styles.filterInput}
                type="number"
                placeholder="e.g. 150000"
                min="0"
                value={mileageMax}
                onChange={e => setMileageMax(e.target.value)}
              />
            </div>

            {/* Actions */}
            <button style={styles.applyBtn} onClick={handleApply}>
              Apply Filters
            </button>
            <button style={styles.clearBtn} onClick={handleClear}>
              Clear All
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main style={styles.main}>
          {/* Top bar */}
          <div style={styles.topBar}>
            <p style={styles.resultCount}>
              {loading ? 'Loading...' : `Showing ${paginated.length} of ${filtered.length} vehicles`}
            </p>
            <div style={styles.sortWrap}>
              <label style={styles.sortLabel}>Sort by:</label>
              <select
                style={styles.sortSelect}
                value={sort}
                onChange={e => { setSort(e.target.value); setPage(1); }}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards list */}
          {loading ? (
            <div style={styles.loadingState}>
              <div style={styles.spinner} />
              <p style={{ color: '#64748b', marginTop: 16 }}>Loading listings...</p>
            </div>
          ) : paginated.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={{ fontSize: 48 }}>🚗</span>
              <h3 style={{ color: '#0f172a', marginTop: 16 }}>No listings match your filters</h3>
              <p style={{ color: '#64748b', marginTop: 8 }}>Try adjusting or clearing your filters.</p>
              <button style={{ ...styles.applyBtn, marginTop: 20, width: 'auto', padding: '10px 24px' }} onClick={handleClear}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={styles.cardList}>
              {paginated.map((post, idx) => (
                <ListingRow key={post.id} post={post} animClass={DELAY_CLASSES[idx % DELAY_CLASSES.length]} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                style={{ ...styles.pageBtn, ...(page === 1 ? styles.pageBtnDisabled : {}) }}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  style={{ ...styles.pageBtn, ...(n === page ? styles.pageBtnActive : {}) }}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}

              <button
                style={{ ...styles.pageBtn, ...(page === totalPages ? styles.pageBtnDisabled : {}) }}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </button>

              <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

function ListingRow({ post, animClass }) {
  const firstImage = post.images?.[0]?.image;
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
    ? (post.description.length > 140 ? post.description.slice(0, 140) + '...' : post.description)
    : '';

  const pills = [
    post.year ? String(post.year) : null,
    post.fuel_type ? capitalize(post.fuel_type) : null,
    post.transmission ? capitalize(post.transmission) : null,
    post.horsepower ? `${post.horsepower} hp` : null,
    post.mileage ? formatMileage(post.mileage) : null,
  ].filter(Boolean);

  return (
    <div className={`anim-fade-up ${animClass}`} style={styles.rowCard}>
      {/* Image */}
      <div style={styles.rowImg}>
        {imgSrc ? (
          <img src={imgSrc} alt={post.title} style={styles.rowImgEl} />
        ) : (
          <div style={styles.rowNoImg}>
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="40" height="40" rx="8" fill="#e2e8f0" />
              <path d="M10 30 L10 26 L15 26 L19 19 L29 19 L34 24 L38 24 L38 30 Z" fill="#94a3b8" />
              <circle cx="16" cy="30" r="3" fill="#94a3b8" />
              <circle cx="32" cy="30" r="3" fill="#94a3b8" />
            </svg>
            <span style={{ color: '#94a3b8', fontSize: 12, marginTop: 6 }}>No photo</span>
          </div>
        )}
      </div>

      {/* Middle */}
      <div style={styles.rowMiddle}>
        <h3 style={styles.rowTitle}>{post.title}</h3>

        {/* Spec pills */}
        {pills.length > 0 && (
          <div style={styles.pillRow}>
            {pills.map((pill, i) => (
              <span key={i} style={styles.specPill}>{pill}</span>
            ))}
          </div>
        )}

        {/* Description */}
        {desc && <p style={styles.rowDesc}>{desc}</p>}

        {/* Seller */}
        <div style={styles.rowSeller}>
          <div style={styles.rowAvatar}>{initials}</div>
          <span style={styles.rowSellerName}>{post.author_username}</span>
          <span style={styles.rowDate}>{dateStr}</span>
        </div>
      </div>

      {/* Right: price + button */}
      <div style={styles.rowRight}>
        <div style={styles.rowPrice}>€{Number(post.price).toLocaleString()}</div>
        <Link to={`/posts/${post.id}`} style={styles.viewBtn}>
          View Details →
        </Link>
      </div>
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
    padding: '56px 24px 48px',
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
    marginBottom: 16,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 800,
    lineHeight: 1.15,
    margin: '0 0 12px',
    letterSpacing: '-0.02em',
  },
  heroSub: {
    color: '#94a3b8',
    fontSize: 16,
    margin: 0,
  },

  // Body layout
  body: {
    maxWidth: 1280,
    margin: '0 auto',
    width: '100%',
    padding: '40px 24px 64px',
    display: 'flex',
    gap: 32,
    alignItems: 'flex-start',
    flex: 1,
  },

  // Sidebar
  sidebar: {
    width: 300,
    flexShrink: 0,
    position: 'sticky',
    top: 24,
  },
  sidebarCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 20px',
    letterSpacing: '-0.01em',
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 8,
  },
  filterInput: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 13,
    color: '#0f172a',
    background: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
  },
  filterInputHalf: {
    flex: 1,
    padding: '9px 10px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 13,
    color: '#0f172a',
    background: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
    minWidth: 0,
  },
  rangeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  rangeSep: {
    color: '#94a3b8',
    fontSize: 13,
    flexShrink: 0,
  },
  checkboxList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#374151',
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkbox: {
    accentColor: '#e63946',
    width: 15,
    height: 15,
    cursor: 'pointer',
  },
  radioList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#374151',
    cursor: 'pointer',
    userSelect: 'none',
  },
  radio: {
    accentColor: '#e63946',
    width: 15,
    height: 15,
    cursor: 'pointer',
  },
  applyBtn: {
    width: '100%',
    padding: '11px',
    background: '#e63946',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 10,
  },
  clearBtn: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '4px 0',
  },

  // Main
  main: {
    flex: 1,
    minWidth: 0,
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
    flexWrap: 'wrap',
  },
  resultCount: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: 500,
    margin: 0,
  },
  sortWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  sortLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: 600,
  },
  sortSelect: {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 13,
    color: '#0f172a',
    background: '#ffffff',
    outline: 'none',
    cursor: 'pointer',
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },

  // Row card
  rowCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  },
  rowImg: {
    width: 220,
    height: 160,
    flexShrink: 0,
    overflow: 'hidden',
    background: '#f1f5f9',
  },
  rowImgEl: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  rowNoImg: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowMiddle: {
    flex: 1,
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minWidth: 0,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
    lineHeight: 1.3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  pillRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
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
  rowDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 1.5,
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  rowSeller: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 'auto',
  },
  rowAvatar: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#e63946',
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    letterSpacing: '0.04em',
  },
  rowSellerName: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 500,
  },
  rowDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 'auto',
  },

  // Right column
  rowRight: {
    flexShrink: 0,
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 12,
    borderLeft: '1px solid #f1f5f9',
    minWidth: 160,
  },
  rowPrice: {
    fontSize: 22,
    fontWeight: 800,
    color: '#e63946',
    letterSpacing: '-0.02em',
    whiteSpace: 'nowrap',
  },
  viewBtn: {
    display: 'inline-block',
    background: '#e63946',
    color: '#ffffff',
    padding: '9px 18px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },

  // Pagination
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 40,
    flexWrap: 'wrap',
  },
  pageBtn: {
    padding: '8px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    background: '#ffffff',
    color: '#0f172a',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  pageBtnActive: {
    background: '#e63946',
    color: '#ffffff',
    border: '1px solid #e63946',
    fontWeight: 700,
  },
  pageBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  pageInfo: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 8,
  },
};
