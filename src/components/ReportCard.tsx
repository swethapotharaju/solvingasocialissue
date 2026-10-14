import React from 'react';
import { SanitationReport, SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';

interface ReportCardProps {
  report: SanitationReport;
  language: SupportedLanguage;
  onSelect: (report: SanitationReport) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  language,
  onSelect
}) => {
  const t = translations[language];
  const cat = t.categories[report.category] || { label: report.category, icon: '📍' };
  const stat = t.statuses[report.status] || { label: report.status, badgeText: report.status };

  const getStatusBadgeClass = () => {
    switch (report.status) {
      case 'submitted': return 'badge-submitted';
      case 'under_review': return 'badge-under-review';
      case 'action_planned': return 'badge-action-planned';
      case 'resolved': return 'badge-resolved';
      case 'unable_to_resolve': return 'badge-unable';
      default: return 'badge-submitted';
    }
  };

  const getUrgencyBadge = () => {
    if (report.urgency === 'critical') {
      return <span className="badge badge-urgency-critical">⚠️ {t.urgency.critical}</span>;
    }
    if (report.urgency === 'high') {
      return <span className="badge badge-urgency-high">🔥 {t.urgency.high}</span>;
    }
    return null;
  };

  const formattedDate = new Date(report.createdAt).toLocaleDateString(language === 'te' ? 'te-IN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <article
      onClick={() => onSelect(report)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect(report); }}
      className="clean-card"
      style={{
        padding: '1.25rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.05)';
      }}
    >
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#475569', backgroundColor: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '0.25rem' }}>
              {report.id}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
              {cat.icon} {cat.label}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {getUrgencyBadge()}
            <span className={`badge ${getStatusBadgeClass()}`}>
              {stat.badgeText}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          {report.title}
        </h3>

        {/* Description Excerpt */}
        <p style={{
          fontSize: '0.875rem',
          color: '#475569',
          marginBottom: '0.875rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {report.description}
        </p>

        {/* Photo Thumbnail if available */}
        {report.photoUrl && (
          <div style={{ marginBottom: '0.875rem' }}>
            <img
              src={report.photoUrl}
              alt={report.title}
              style={{
                width: '100%',
                height: '140px',
                objectFit: 'cover',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}
              loading="lazy"
            />
          </div>
        )}

        {/* Location Landmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: '#475569', marginBottom: '0.5rem' }}>
          <span>📍</span>
          <span style={{ fontWeight: 600, color: '#334155' }}>{report.locationLandmark}</span>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{
        marginTop: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: '#64748b'
      }}>
        <span>🕒 {formattedDate}</span>

        {/* Verification Status Pill */}
        {report.verificationStatus === 'resolved_verified' ? (
          <span style={{ color: '#047857', fontWeight: 700 }}>
            ✓ {t.detail.verifiedBadge}
          </span>
        ) : report.verificationStatus === 'coordinator_verified' ? (
          <span style={{ color: '#0369a1', fontWeight: 600 }}>
            🛡️ {t.detail.verifiedBadge}
          </span>
        ) : (
          <span style={{ color: '#94a3b8' }}>
            {t.detail.unverifiedBadge}
          </span>
        )}
      </div>

      {/* Duplicate / Flagged Tags if coordinator marked */}
      {(report.isDuplicate || report.isFlagged) && (
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.35rem' }}>
          {report.isDuplicate && (
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.35rem', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '0.25rem', fontWeight: 600 }}>
              Duplicate of {report.duplicateOfId || 'existing report'}
            </span>
          )}
          {report.isFlagged && (
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.35rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '0.25rem', fontWeight: 600 }}>
              Flagged: {report.flagReason || 'Requires review'}
            </span>
          )}
        </div>
      )}
    </article>
  );
};
