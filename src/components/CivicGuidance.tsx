import React from 'react';
import { SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';

interface CivicGuidanceProps {
  language: SupportedLanguage;
  onOpenReportForm: () => void;
}

export const CivicGuidance: React.FC<CivicGuidanceProps> = ({
  language,
  onOpenReportForm
}) => {
  const t = translations[language];

  return (
    <div className="clean-container" style={{ maxWidth: '860px', paddingTop: '1.5rem', paddingBottom: '3.5rem' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          {t.guidance.heading}
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
          {t.guidance.subtitle}
        </p>
      </div>

      {/* Transparent Disclaimer Callout */}
      <div style={{
        backgroundColor: '#fffbeb',
        border: '2px solid #fde68a',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        gap: '0.875rem',
        alignItems: 'flex-start'
      }}>
        <span style={{ fontSize: '1.75rem' }} aria-hidden="true">⚠️</span>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#92400e', marginBottom: '0.25rem' }}>
            {language === 'te' ? 'పౌర పారదర్శకత ప్రకటన' : 'Civic Transparency Disclaimer'}
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#78350f', lineHeight: 1.5 }}>
            {t.guidance.disclaimerBox}
          </p>
        </div>
      </div>

      {/* Official Government Channels Guide */}
      <div className="clean-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
          🏛️ {t.guidance.officialChannelsTitle}
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
          {t.guidance.officialChannelsSub}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          
          {/* Swachhata Official App */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🇮🇳</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                Swachhata-MoHUA App
              </h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem', lineHeight: 1.4 }}>
              The official mobile application by the Ministry of Housing and Urban Affairs (MoHUA), Government of India, for citizen sanitation complaints across all ULBs.
            </p>
            <a
              href="https://swachhbharatmission.ddws.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, textDecoration: 'underline' }}
            >
              Visit Swachh Bharat Portal ↗
            </a>
          </div>

          {/* CPGRAMS Portal */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📋</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                CPGRAMS Grievance Portal
              </h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem', lineHeight: 1.4 }}>
              Centralized Public Grievance Redress and Monitoring System for escalating unresolved issues to central or state administrative departments.
            </p>
            <a
              href="https://pgportal.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, textDecoration: 'underline' }}
            >
              Open PGPortal.gov.in ↗
            </a>
          </div>

          {/* Local Municipal Corporations Guide */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📞</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                City Municipal Helplines
              </h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem', lineHeight: 1.4 }}>
              Most municipalities operate 24/7 sanitation complaint helplines (e.g., <strong>GHMC: 040-21111111</strong>, <strong>BBMP: 1533</strong>, or your local Gram Panchayat office).
            </p>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
              Check your property tax bill or water bill for your Ward Number and contact info.
            </span>
          </div>

        </div>
      </div>

      {/* Waste Segregation Guidelines */}
      <div className="clean-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
          ♻️ {t.guidance.segregationTitle}
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
          {t.guidance.segregationSub}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          
          {/* Green Bin: Wet */}
          <div style={{ border: '2px solid #a7f3d0', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🍏</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#065f46' }}>
                Wet Waste (Green Bin)
              </h4>
            </div>
            <ul style={{ fontSize: '0.8rem', color: '#166534', paddingLeft: '1.25rem', lineHeight: 1.6 }}>
              <li>Kitchen vegetable and fruit peels</li>
              <li>Leftover cooked food & tea leaves</li>
              <li>Garden trimmings and flowers</li>
              <li>Compostable organic matter</li>
            </ul>
          </div>

          {/* Blue Bin: Dry */}
          <div style={{ border: '2px solid #bfdbfe', backgroundColor: '#eff6ff', borderRadius: '0.5rem', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📦</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e40af' }}>
                Dry Recyclables (Blue Bin)
              </h4>
            </div>
            <ul style={{ fontSize: '0.8rem', color: '#1e3a8a', paddingLeft: '1.25rem', lineHeight: 1.6 }}>
              <li>Clean plastic bottles & packaging</li>
              <li>Cardboard boxes & newspapers</li>
              <li>Tin cans and glass containers</li>
              <li>Tetra paks (rinsed clean)</li>
            </ul>
          </div>

          {/* Red/Yellow Bin: Sanitary & Hazardous */}
          <div style={{ border: '2px solid #fecaca', backgroundColor: '#fef2f2', borderRadius: '0.5rem', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#991b1b' }}>
                Sanitary & Hazardous
              </h4>
            </div>
            <ul style={{ fontSize: '0.8rem', color: '#7f1d1d', paddingLeft: '1.25rem', lineHeight: 1.6 }}>
              <li>Sanitary napkins and diapers (wrapped)</li>
              <li>Expired medicines & syringes</li>
              <li>Batteries & discarded electronics</li>
              <li>Paints, solvents & pesticide bottles</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Practical Action Footer */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onOpenReportForm}
          className="btn-primary"
          style={{ fontSize: '1rem', padding: '0.75rem 1.75rem' }}
        >
          ➕ {t.form.title}
        </button>
      </div>

    </div>
  );
};
