import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', price: '', description: '', contact_info: '', year: '', fuel_type: '', transmission: '', horsepower: '', mileage: '' });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const processFiles = (files) => {
    const arr = Array.from(files).slice(0, 5);
    if (Array.from(files).length > 5) {
      setError('Maximum 5 images allowed.');
      return;
    }
    setImages(arr);
    setPreviews(arr.map(f => URL.createObjectURL(f)));
    setError('');
  };

  const handleImages = (e) => {
    processFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (i) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
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
      images.forEach(img => fd.append('images', img));
      const { data } = await api.post('/posts/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/posts/${data.id}`);
    } catch (err) {
      const d = err.response?.data;
      setError(d ? Object.values(d).flat().join(' ') : 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Page header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Create New Listing</h1>
          <p style={styles.pageSub}>Fill in the details below to post your car on CarMarket</p>
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
                placeholder="e.g. 2020 Volkswagen Golf 7 GTI"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                onFocus={e => (e.target.style.borderColor = '#e63946')}
                onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
              />
              <span style={styles.hint}>Make it descriptive — include make, model, and year</span>
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
                  placeholder="25000"
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
                placeholder="Describe the vehicle — year, mileage, condition, service history, features..."
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
                placeholder="Phone number, email, or preferred contact method"
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

            {/* Image upload */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Photos (max 5)</label>

              <label
                htmlFor="imageUpload"
                style={{
                  ...styles.dropZone,
                  ...(dragOver ? styles.dropZoneActive : {}),
                }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <div style={styles.dropZoneContent}>
                  <span style={styles.uploadIcon}>📷</span>
                  <p style={styles.dropZoneTitle}>Click to upload photos</p>
                  <p style={styles.dropZoneSub}>or drag and drop here · Max 5 photos · JPG, PNG</p>
                </div>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleImages}
                />
              </label>

              {/* Preview grid */}
              {previews.length > 0 && (
                <div style={styles.previewGrid}>
                  {previews.map((src, i) => (
                    <div key={i} style={styles.previewWrap}>
                      <img src={src} alt={`preview ${i + 1}`} style={styles.previewImg} />
                      <button
                        type="button"
                        style={styles.removeBtn}
                        onClick={() => removeImage(i)}
                        title="Remove photo"
                      >
                        ✕
                      </button>
                      {i === 0 && <div style={styles.mainBadge}>Main</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? 'Publishing...' : '🚗 Publish Listing'}
            </button>
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
    display: 'block',
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
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

  // Drop zone
  dropZone: {
    display: 'block',
    border: '2px dashed #e2e8f0',
    borderRadius: 12,
    padding: '36px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
    background: '#f8fafc',
  },
  dropZoneActive: {
    borderColor: '#e63946',
    background: '#fff1f2',
  },
  dropZoneContent: {},
  uploadIcon: {
    fontSize: 36,
    display: 'block',
    marginBottom: 10,
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

  // Preview
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
  },
  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    background: 'rgba(0,0,0,0.65)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: 22,
    height: 22,
    cursor: 'pointer',
    fontSize: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
  },
  mainBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    background: '#e63946',
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  // Submit
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: '#e63946',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 4,
    transition: 'background 0.15s',
  },
};
