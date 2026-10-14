import React, { useState, useRef } from 'react';
import { ProblemCategory, SanitationReport, SupportedLanguage, UrgencyLevel, Coordinates } from '../types';
import { translations } from '../i18n/translations';
import { StorageService } from '../services/storage';

interface ReportFormProps {
  language: SupportedLanguage;
  onReportCreated: (newReport: SanitationReport) => void;
  onNavigateToDashboard: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  language,
  onReportCreated,
  onNavigateToDashboard
}) => {
  const t = translations[language];

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProblemCategory>('garbage_overflow');
  const [description, setDescription] = useState('');
  const [locationLandmark, setLocationLandmark] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');
  const [coordinates, setCoordinates] = useState<Coordinates | undefined>(undefined);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  // Status & Feedback States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReport, setCreatedReport] = useState<SanitationReport | null>(null);

  // Geolocation States
  const [isLocating, setIsLocating] = useState(false);
  const [locationFeedback, setLocationFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Geolocation Handler with Explicit Consent & Privacy Truncation
  const handleRequestLocation = () => {
    setLocationFeedback(null);
    if (!navigator.geolocation) {
      setLocationFeedback(t.form.gpsDenied);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        // Round to 3 decimal places (~110 meters) for citizen residential privacy
        const roundedLat = Math.round(pos.coords.latitude * 1000) / 1000;
        const roundedLng = Math.round(pos.coords.longitude * 1000) / 1000;
        setCoordinates({
          latitude: roundedLat,
          longitude: roundedLng,
          accuracyMeters: Math.round(pos.coords.accuracy)
        });
        setLocationFeedback(`${t.form.gpsSuccess} (${roundedLat.toFixed(3)}, ${roundedLng.toFixed(3)})`);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation denied or error:', err.message);
        setLocationFeedback(t.form.gpsDenied);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Safe Image Upload Handler with File Type & Size Validation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous photo errors
    const currentErrors = { ...errors };
    delete currentErrors.photo;

    // Validate type (MIME check)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors({ ...currentErrors, photo: t.form.validationErrors.photoTypeError });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size (Max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrors({ ...currentErrors, photo: t.form.validationErrors.photoSizeError });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Convert to Base64 for persistent browser storage
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string);
      setErrors(currentErrors);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = t.form.validationErrors.titleRequired;
    } else if (title.trim().length < 5) {
      newErrors.title = language === 'te' 
        ? 'శీర్షిక కనీసం 5 అక్షరాలు ఉండాలి.' 
        : 'Title must be at least 5 characters.';
    }

    if (!category) {
      newErrors.category = t.form.validationErrors.categoryRequired;
    }

    if (!description.trim()) {
      newErrors.description = t.form.validationErrors.descriptionRequired;
    } else if (description.trim().length < 10) {
      newErrors.description = language === 'te'
        ? 'వివరణ కనీసం 10 అక్షరాలు ఉండాలి.'
        : 'Description must be at least 10 characters.';
    }

    if (!locationLandmark.trim()) {
      newErrors.location = t.form.validationErrors.locationRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const created = StorageService.createReport({
        title: title.trim(),
        category,
        description: description.trim(),
        locationLandmark: locationLandmark.trim(),
        coordinates,
        photoUrl,
        urgency
      });

      setIsSubmitting(false);
      setCreatedReport(created);
      onReportCreated(created);
    } catch (err) {
      setIsSubmitting(false);
      alert('An unexpected error occurred while saving the report. Please try again.');
    }
  };

  const handleReset = () => {
    setTitle('');
    setCategory('garbage_overflow');
    setDescription('');
    setLocationLandmark('');
    setUrgency('normal');
    setCoordinates(undefined);
    setPhotoUrl(undefined);
    setLocationFeedback(null);
    setErrors({});
    setCreatedReport(null);
  };

  // Success Confirmation Screen
  if (createdReport) {
    return (
      <div className="clean-container" style={{ maxWidth: '640px', paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="clean-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            ✓
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            {t.form.successHeading}
          </h2>

          <p style={{ color: '#475569', fontSize: '1rem', marginBottom: '1.25rem' }}>
            {t.form.successMessage}{' '}
            <strong style={{ color: '#059669', fontFamily: 'monospace', fontSize: '1.15rem' }}>
              {createdReport.id}
            </strong>
          </p>

          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            padding: '1rem',
            textAlign: 'left',
            marginBottom: '1.75rem',
            fontSize: '0.875rem',
            color: '#334155'
          }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>{language === 'te' ? 'సమస్య శీర్షిక' : 'Report Title'}:</strong> {createdReport.title}
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>{language === 'te' ? 'ప్రదేశం' : 'Location'}:</strong> {createdReport.locationLandmark}
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>{language === 'te' ? 'ప్రస్తుత స్థితి' : 'Current Status'}:</strong>{' '}
              <span className="badge badge-submitted">{t.statuses.submitted.badgeText}</span>
            </p>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.75rem' }}>
              ℹ️ {t.form.successNotice}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onNavigateToDashboard}
              className="btn-primary"
            >
              📊 {t.form.viewInDashboard}
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary"
            >
              ➕ {t.form.reportAnother}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Submission Form Screen
  return (
    <div className="clean-container" style={{ maxWidth: '720px', paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <div className="clean-card" style={{ padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
            {t.form.title}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            {t.form.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          
          {/* Category Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
              {t.form.fieldCategory} <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
              {t.form.fieldCategoryHelp}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '0.625rem' }}>
              {(Object.keys(t.categories) as ProblemCategory[]).map((catKey) => {
                const catInfo = t.categories[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => setCategory(catKey)}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: '0.5rem',
                      border: `2px solid ${isSelected ? '#059669' : '#e2e8f0'}`,
                      backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                      color: isSelected ? '#065f46' : '#334155',
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{catInfo.icon}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, lineHeight: 1.2 }}>
                      {catInfo.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.35rem' }}>{errors.category}</p>
            )}
          </div>

          {/* Title */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="report-title" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
              {t.form.fieldTitle} <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              id="report-title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.form.fieldTitlePlaceholder}
              maxLength={120}
            />
            {errors.title && (
              <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.35rem' }}>{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="report-desc" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
              {t.form.fieldDescription} <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea
              id="report-desc"
              rows={3}
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.form.fieldDescriptionPlaceholder}
              maxLength={1000}
            />
            {errors.description && (
              <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.35rem' }}>{errors.description}</p>
            )}
          </div>

          {/* Location / Landmark */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="report-loc" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
              {t.form.fieldLocation} <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              id="report-loc"
              type="text"
              className="form-input"
              value={locationLandmark}
              onChange={(e) => setLocationLandmark(e.target.value)}
              placeholder={t.form.fieldLocationPlaceholder}
              maxLength={150}
            />
            {errors.location && (
              <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.35rem' }}>{errors.location}</p>
            )}

            {/* Optional Geolocation with Consent */}
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleRequestLocation}
                disabled={isLocating}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  color: '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontWeight: 600
                }}
              >
                <span>📍</span>
                <span>{isLocating ? t.form.gpsDetecting : t.form.gpsButton}</span>
              </button>
              {locationFeedback && (
                <span style={{ fontSize: '0.8rem', color: coordinates ? '#047857' : '#b45309' }}>
                  {locationFeedback}
                </span>
              )}
            </div>
          </div>

          {/* Urgency Level */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="report-urgency" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
              {t.form.fieldUrgency}
            </label>
            <select
              id="report-urgency"
              className="form-select"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
            >
              <option value="normal">{t.urgency.normal}</option>
              <option value="high">{t.urgency.high}</option>
              <option value="critical">{t.urgency.critical}</option>
            </select>
          </div>

          {/* Optional Photo Upload */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
              {t.form.fieldPhoto}
            </label>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.625rem' }}>
              {t.form.fieldPhotoHelp}
            </p>

            {!photoUrl ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                  id="photo-upload-input"
                />
                <label
                  htmlFor="photo-upload-input"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px dashed #94a3b8',
                    backgroundColor: '#f8fafc',
                    color: '#475569',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  📷 {language === 'te' ? 'ఫోటో ఎంచుకోండి' : 'Choose Sanitation Photo'}
                </label>
              </div>
            ) : (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={photoUrl}
                  alt="Sanitation preview"
                  style={{
                    width: '160px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '0.5rem',
                    border: '1px solid #cbd5e1'
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    lineHeight: '24px',
                    textAlign: 'center'
                  }}
                  title="Remove photograph"
                >
                  ✕
                </button>
              </div>
            )}

            {errors.photo && (
              <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.35rem' }}>{errors.photo}</p>
            )}
          </div>

          {/* Privacy Note */}
          <div style={{
            backgroundColor: '#f1f5f9',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.8rem',
            color: '#475569',
            marginBottom: '1.75rem',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-start'
          }}>
            <span style={{ fontSize: '1rem' }}>🛡️</span>
            <span>{t.form.privacyNote}</span>
          </div>

          {/* Submit Action */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ width: '100%', fontSize: '1rem' }}
            >
              {isSubmitting ? t.form.submittingButton : t.form.submitButton}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
