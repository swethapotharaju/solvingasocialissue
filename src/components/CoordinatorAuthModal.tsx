import React, { useState } from 'react';
import { SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import { StorageService, COORDINATOR_DEFAULT_PIN } from '../services/storage';

interface CoordinatorAuthModalProps {
  language: SupportedLanguage;
  onClose: () => void;
  onSuccess: () => void;
}

export const CoordinatorAuthModal: React.FC<CoordinatorAuthModalProps> = ({
  language,
  onClose,
  onSuccess
}) => {
  const t = translations[language];
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter passcode');
      return;
    }

    const success = StorageService.loginCoordinator(pin);
    if (success) {
      onSuccess();
    } else {
      setError(language === 'te' 
        ? 'చెల్లని పాస్‌కోడ్. దయచేసి సరైన పాస్‌కోడ్ నమోదు చేయండి.' 
        : `Invalid passcode. For demonstration, use: ${COORDINATOR_DEFAULT_PIN}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', padding: '2rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            fontSize: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            🛡️
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
            {t.coordinator.loginRequired}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            {t.coordinator.loginPrompt}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Passcode
            </label>
            <input
              type="password"
              className="form-input"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(null);
              }}
              placeholder={t.coordinator.pinPlaceholder}
              autoFocus
            />
            {error && (
              <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.35rem' }}>{error}</p>
            )}
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            fontSize: '0.775rem',
            color: '#475569',
            marginBottom: '1.5rem'
          }}>
            💡 <strong>Demo Passcode:</strong> <code>CLEAN2026</code>
            <div style={{ marginTop: '0.25rem', color: '#64748b' }}>
              In real-world deployment, this is replaced by OAuth or multi-tenant municipal authorization.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1 }}
            >
              {t.coordinator.loginButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
