import React from 'react';
import { SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';

interface CivicBannerProps {
  language: SupportedLanguage;
  onOpenGuidance: () => void;
}

export const CivicBanner: React.FC<CivicBannerProps> = ({ language, onOpenGuidance }) => {
  const t = translations[language];

  return (
    <aside 
      aria-label="Civic Notice"
      style={{
        backgroundColor: '#fffbeb',
        borderBottom: '1px solid #fde68a',
        padding: '0.625rem 1rem',
        fontSize: '0.875rem',
        color: '#92400e'
      }}
    >
      <div className="clean-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }} aria-hidden="true">📢</span>
          <span>
            <strong>{t.civicDisclaimer}</strong> {t.civicDisclaimerDetail}
          </span>
        </div>
        <button
          onClick={onOpenGuidance}
          style={{
            background: 'none',
            border: 'none',
            color: '#b45309',
            fontWeight: 700,
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem'
          }}
        >
          {language === 'te' ? 'అధికారిక వివరాలు చూడండి →' : 'Official Complaint Channels →'}
        </button>
      </div>
    </aside>
  );
};
