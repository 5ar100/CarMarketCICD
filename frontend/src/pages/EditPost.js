import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', price: '', description: '', contact_info: '', year: '', fuel_type: '', transmission: '', horsepower: '', mileage: '' });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [replaceImages, setReplaceImages] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    api.get(`/posts/${id}/`).then(({ data }) => {
      setForm({
        title: data.title,
        price: data.price,
        description: data.description,
        contact_info: data.contact_info,
        year: data.year || '',
        fuel_type: data.fuel_type || '',
        transmission: data.transmission || '',
        horsepower: data.horsepower || '',
        mileage: data.mileage || '',
      });
      setExistingImages(data.images || []);
      setFetchLoading(false);
    });
  }, [id]);

  const processFiles = (files) => {
    const arr = Array.from(files).slice(0, 5);
    if (Array.from(files).length > 5) {
      setError('Maximum 5 images allowed.');
      return;
    }
    setNewImages(arr);
    setPreviews(arr.map(f => URL.createObjectURL(f)));
    setReplaceImages(true);
    setError('');
  };

  const handleImages = (e) => processFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      const { year, fuel_type, transmission, horsepower, mileage, ...coreFields } = form;
      Object.entries(coreFields).forEach(([k, v]) => fd.append(k, v));
      if (year) fd.append('year', year);
      if (fuel_type) fd.append('fuel_type', fuel_type);
      if (transmission) fd.append('transmission', transmission);
      if (horsepower) fd.append('horsepower', horsepower);
      if (mileage) fd.append('mileage', mileage);
      if (replaceImages) newImages.forEach(img => fd.append('images', img));
      await api.patch(`/posts/${id}/`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/posts/${id}`);
    } catch (err) {
      const d = err.response?.data;
      setError(d ? Object.values(d).flat().join(' ') : 'Failed to update post.');
    } finally {
      setLoading(false);
    }
  };

  const imgUrl = (url) => url.startsWith('http') ? url : `http://localhost:8000${url}`;

  if (fetchLoading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner} />
        <p style={{ color: '#64748b', marginTop: 16 }}>Loading listing...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Page header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Edit Listing</h1>
          <p style={styles.pageSub}>Update the details for your car listing</p>
        </div>

        {/* Form card */}
        <div style={styles.card}>
          {error && (
            <div style={styles.errorBox}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Listing Title <span style={styles.required}>*</span>
              </label>
              <input
                style={styles.input}
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                onFocus={e => (e.target.style.borderColor = '#e63946')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            {/* Price */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Price (€) <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputPrefix}>
                <span style={styles.prefixSymbol}>€</span>
                <input
                  style={{ ...styles.input, borderRadius: '0 8px 8px 0', borderLeft: 'none' }}
                  type="number"
                  required
                  min="0"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  onFocus={e => (e.target.style.borderColor = '#e63946')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>
            </div>

            {/* Description */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Description <span style={styles.required}>*</span>
              </label>
              <textarea
                style={{ ...styles.input, height: 140, resize: 'vertical' }}
                required
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                onFocus={e => (e.target.style.borderColor = '#e63946')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            {/* Contact info */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Contact Information <span style={styles.required}>*</span>
              </label>
              <input
                style={styles.input}
                required
                value={form.contact_info}
                onChange={e => setForm({ ...form, contact_info: e.target.value })}
                onFocus={e => (e.target.style.borderColor = '#e63946')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            {/* Vehicle Details — row of 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Year */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Year</label>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="e.g. 2019"
                  min="1950"
                  max="2026"
                  value={form.year}
                  onChange={e => setForm({ ...form, year: e.target.value })}
                  onFocus={e => (e.target.style.borderColor = '#e63946')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>

              {/* Horsepower */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Horsepower (HP)</label>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="e.g. 140"
                  min="0"
                  value={form.horsepower}
                  onChange={e => setForm({ ...form, horsepower: e.target.value })}
                  onFocus={e => (e.target.style.borderColor = '#e63946')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>
            </div>

            {/* Fuel type */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Fuel Type</label>
              <select
                style={styles.input}
                value={form.fuel_type}
                onChange={e => setForm({ ...form, fuel_type: e.target.value })}
                onFocus={e => (e.target.style.borderColor = '#e63946')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              >
                <option value="">Select fuel type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
                <option value="lpg">LPG</option>
              </select>
            </div>

            {/* Transmission */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Transmission</label>
              <select
                style={styles.input}
                value={form.transmission}
                onChange={e => setForm({ ...form, transmission: e.target.value })}
                onFocus={e => (e.target.style.borderColor = '#e63946')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              >
                <option value="">Select transmission</option>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>

            {/* Mileage */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Mileage (km)</label>
              <input
                style={styles.input}
                type="number"
                placeholder="e.g. 150000"
                min="0"
                value={form.mileage}
                onChange={e => setForm({ ...form, mileage: e.target.value })}
                onFocus={e => (e.target.style.borderColor = '#e63946')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            {/* Current photos */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Current Photos</label>
              {existingImages.length > 0 ? (
                <div style={styles.currentImagesGrid}>
                  {existingImages.map((img, i) => (
                    <div key={img.id} style={styles.currentImgWrap}>
                      <img
                        src={imgUrl(img.image)}
                        alt={`current ${i + 1}`}
                        style={styles.currentImg}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.noImgNote}>
                  <span>📷</span>
                  <span style={{ color: '#94a3b8', fontSize: 14 }}>No current photos on this listing</span>
                </div>
              )}
            </div>

            {/* Replace photos */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Replace Photos</label>
              <p style={styles.hint}>Upload a new set of photos to replace the current ones (max 5)</p>

              <label
                htmlFor="newImageUpload"
                style={{
                  ...styles.dropZone,
                  ...(dragOver ? styles.dropZoneActive : {}),
                  ...(replaceImages ? styles.dropZoneSelected : {}),
                }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <div style={styles.dropZoneContent}>
                  <span style={styles.uploadIcon}>
                    {replaceImages ? '✅' : '📷'}
                  </span>
                  <p style={styles.dropZoneTitle}>
                    {replaceImages ? `${newImages.length} new photo${newImages.length !== 1 ? 's' : ''} selected` : 'Click to select new photos'}
                  </p>
                  <p style={styles.dropZoneSub}>or drag and drop here · Max 5 photos · JPG, PNG</p>
                </div>
                <input
                  id="newImageUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleImages}
                />
              </label>

              {/* New previews */}
              {previews.length > 0 && (
                <div style={styles.previewGrid}>
                  {previews.map((src, i) => (
                    <div key={i} style={styles.previewWrap}>
                      <img src={src} alt={`new ${i + 1}`} style={styles.previewImg} />
                      <div style={styles.newBadge}>New</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={styles.actionsRow}>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={() => navigate(`/posts/${id}`)}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
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
    maxWidth: 700,
    margin: '0 auto',
    padding: '40px 24px 64px',
    flex: 1,
  },
  pageHeader: {
    marginBottom: 28,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: 800,
    color: '#0f172a',
    margin: '0 0 6px',
    letterSpacing: '-0.02em',
  },
  pageSub: {
    fontSize: 15,
    color: '#64748b',
    margin: 0,
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '36px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  errorBox: {
    background: '#fff1f2',
    border: '1px solid #fecdd3',
    color: '#be123c',
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 14,
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
  },
  required: {
    color: '#e63946',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 15,
    color: '#0f172a',
    background: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  hint: {
    fontSize: 12,
    color: '#94a3b8',
    margin: '0 0 8px',
  },
  inputPrefix: {
    display: 'flex',
    alignItems: 'stretch',
  },
  prefixSymbol: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 14px',
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRight: 'none',
    borderRadius: '8px 0 0 8px',
    fontSize: 15,
    color: '#64748b',
    fontWeight: 600,
  },

  // Current images
  currentImagesGrid: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  currentImgWrap: {
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
  },
  currentImg: {
    width: 88,
    height: 66,
    objectFit: 'cover',
    display: 'block',
  },
  noImgNote: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 14px',
    background: '#f8fafc',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    fontSize: 14,
    color: '#94a3b8',
  },

  // Drop zone
  dropZone: {
    display: 'block',
    border: '2px dashed #e2e8f0',
    borderRadius: 12,
    padding: '28px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
    background: '#f8fafc',
  },
  dropZoneActive: {
    borderColor: '#e63946',
    background: '#fff1f2',
  },
  dropZoneSelected: {
    borderColor: '#22c55e',
    background: '#f0fdf4',
  },
  dropZoneContent: {},
  uploadIcon: {
    fontSize: 32,
    display: 'block',
    marginBottom: 8,
  },
  dropZoneTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#0f172a',
    margin: '0 0 4px',
  },
  dropZoneSub: {
    fontSize: 13,
    color: '#64748b',
    margin: 0,
  },

  // New preview
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 10,
    marginTop: 16,
  },
  previewWrap: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    aspectRatio: '1',
    background: '#f1f5f9',
    border: '2px solid #22c55e',
  },
  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  newBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    background: '#22c55e',
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  // Actions
  actionsRow: {
    display: 'flex',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    padding: '13px',
    background: 'transparent',
    border: '1px solid #e2e8f0',
    color: '#64748b',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  submitBtn: {
    flex: 2,
    padding: '13px',
    background: '#e63946',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
};
