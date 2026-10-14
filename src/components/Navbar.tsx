import React from 'react';
import { SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentTab: 'dashboard' | 'report' | 'coordinator' | 'guidance';
  onSelectTab: (tab: 'dashboard' | 'report' | 'coordinator' | 'guidance') => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isCoordinator: boolean;
  onOpenAuthModal: () => void;
  onLogoutCoordinator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onLanguageChange,
  isCoordinator,
  onOpenAuthModal,
  onLogoutCoordinator
}) => {
  const t = translations[language];

  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 40 }}>
      <div className="clean-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.25rem', gap: '1rem' }}>
        
        {/* Logo and Brand */}
        <div 
          onClick={() => onSelectTab('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onSelectTab('dashboard'); }}
        >
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.5rem',
            backgroundColor: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '1.25rem'
          }}>
            🧹
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {t.appName}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
              {language === 'te' ? 'పౌర పారిశుద్ధ్య వేదిక' : 'Community Sanitation Platform'}
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Desktop & Tablet) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', overflowX: 'auto', padding: '0.25rem 0' }}>
          <button
            onClick={() => onSelectTab('dashboard')}
            style={{
              padding: '0.5rem 0.875rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: currentTab === 'dashboard' ? '#ecfdf5' : 'transparent',
              color: currentTab === 'dashboard' ? '#047857' : '#475569',
              fontWeight: currentTab === 'dashboard' ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            📊 {t.tabs.dashboard}
          </button>

          <button
            onClick={() => onSelectTab('report')}
            style={{
              padding: '0.5rem 0.875rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: currentTab === 'report' ? '#059669' : '#f1f5f9',
              color: currentTab === 'report' ? '#ffffff' : '#0f172a',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            ➕ {t.tabs.report}
          </button>

          <button
            onClick={() => onSelectTab('guidance')}
            style={{
              padding: '0.5rem 0.875rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: currentTab === 'guidance' ? '#ecfdf5' : 'transparent',
              color: currentTab === 'guidance' ? '#047857' : '#475569',
              fontWeight: currentTab === 'guidance' ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            📖 {t.tabs.guidance}
          </button>

          <button
            onClick={() => {
              if (isCoordinator) {
                onSelectTab('coordinator');
              } else {
                onOpenAuthModal();
              }
            }}
            style={{
              padding: '0.5rem 0.875rem',
              borderRadius: '0.5rem',
              border: isCoordinator ? '1px solid #10b981' : '1px solid #cbd5e1',
              background: isCoordinator ? (currentTab === 'coordinator' ? '#065f46' : '#ecfdf5') : '#ffffff',
              color: isCoordinator ? (currentTab === 'coordinator' ? '#ffffff' : '#065f46') : '#334155',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>{isCoordinator ? '🛡️' : '🔒'}</span>
            <span>{t.tabs.coordinator}</span>
            {isCoordinator && (
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} title="Active Session" />
            )}
          </button>
        </nav>

        {/* Right side: Language Switcher and Coordinator Logout if active */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isCoordinator && (
            <button
              onClick={onLogoutCoordinator}
              title="Logout Coordinator"
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.6rem',
                border: '1px solid #fca5a5',
                borderRadius: '0.375rem',
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Logout
            </button>
          )}

          {/* Bilingual Switcher */}
          <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <button
              onClick={() => onLanguageChange('en')}
              style={{
                padding: '0.35rem 0.625rem',
                border: 'none',
                background: language === 'en' ? '#0f172a' : '#ffffff',
                color: language === 'en' ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('te')}
              style={{
                padding: '0.35rem 0.625rem',
                border: 'none',
                background: language === 'te' ? '#0f172a' : '#ffffff',
                color: language === 'te' ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
              aria-label="తెలుగు భాషకు మారండి"
            >
              తెలుగు
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
