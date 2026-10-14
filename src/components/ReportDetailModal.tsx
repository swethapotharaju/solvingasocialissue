import React, { useState } from 'react';
import { SanitationReport, ReportStatus, SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import { StorageService } from '../services/storage';

interface ReportDetailModalProps {
  report: SanitationReport;
  language: SupportedLanguage;
  isCoordinator: boolean;
  onClose: () => void;
  onReportUpdated: (updated: SanitationReport) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  language,
  isCoordinator,
  onClose,
  onReportUpdated
}) => {
  const t = translations[language];

  // Coordinator Update State
  const [newStatus, setNewStatus] = useState<ReportStatus>(report.status);
  const [actionNote, setActionNote] = useState('');
  const [proofPhotoUrl, setProofPhotoUrl] = useState<string | undefined>(undefined);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);

  // Coordinator Internal Note State
  const [newInternalNote, setNewInternalNote] = useState('');

  // Duplicate / Moderation Modal State
  const [showDuplicateInput, setShowDuplicateInput] = useState(false);
  const [duplicateOfId, setDuplicateOfId] = useState('');
  const [duplicateNote, setDuplicateNote] = useState('');

  const [showFlagInput, setShowFlagInput] = useState(false);
  const [flagReason, setFlagReason] = useState('');

  const cat = t.categories[report.category] || { label: report.category, icon: '📍' };
  const stat = t.statuses[report.status] || { label: report.status, badgeText: report.status };

  // Status Change Submit
  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionNote.trim()) {
      setStatusUpdateError(language === 'te' 
        ? 'దయచేసి తీసుకున్న లేదా ప్రణాళిక చేసిన చర్య వివరణను రాయండి.' 
        : 'Please describe the action taken or planned for transparency.');
      return;
    }

    const updated = StorageService.updateReportStatus(
      report.id,
      newStatus,
      actionNote.trim(),
      'coordinator',
      proofPhotoUrl
    );

    if (updated) {
      onReportUpdated(updated);
      setActionNote('');
      setProofPhotoUrl(undefined);
      setStatusUpdateError(null);
    }
  };

  // Internal Note Submit
  const handleInternalNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternalNote.trim()) return;

    const updated = StorageService.addInternalNote(
      report.id,
      newInternalNote.trim(),
      'Community Coordinator'
    );

    if (updated) {
      onReportUpdated(updated);
      setNewInternalNote('');
    }
  };

  // Duplicate Submit
  const handleDuplicateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duplicateOfId.trim()) return;

    const updated = StorageService.markAsDuplicate(
      report.id,
      duplicateOfId.trim(),
      duplicateNote.trim() || 'Identified by coordinator as a duplicate submission'
    );

    if (updated) {
      onReportUpdated(updated);
      setShowDuplicateInput(false);
    }
  };

  // Flag Submit
  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagReason.trim()) return;

    const updated = StorageService.flagReport(report.id, flagReason.trim());
    if (updated) {
      onReportUpdated(updated);
      setShowFlagInput(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '1.75rem' }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 800, backgroundColor: '#f1f5f9', color: '#1e293b', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                {report.id}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                {cat.icon} {cat.label}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
              {report.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close details"
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '1rem',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            ✕
          </button>
        </div>

        {/* Current Overview Info */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{t.detail.status}</div>
            <div style={{ marginTop: '0.25rem' }}>
              <span className="badge badge-submitted" style={{ fontSize: '0.8rem' }}>
                {stat.badgeText}
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{t.detail.location}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginTop: '0.25rem' }}>
              📍 {report.locationLandmark}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{t.detail.reportedOn}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginTop: '0.25rem' }}>
              🕒 {new Date(report.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
            {language === 'te' ? 'సమస్య వివరణ' : 'Issue Description'}
          </h4>
          <p style={{ fontSize: '0.925rem', color: '#334155', backgroundColor: '#ffffff', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', lineHeight: 1.5 }}>
            {report.description}
          </p>
        </div>

        {/* Report Photo if available */}
        {report.photoUrl && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              {language === 'te' ? 'సమర్పించిన ఫోటో' : 'Submitted Photograph'}
            </h4>
            <img
              src={report.photoUrl}
              alt={report.title}
              style={{
                maxWidth: '100%',
                maxHeight: '260px',
                objectFit: 'contain',
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1'
              }}
            />
          </div>
        )}

        {/* Status Audit History Timeline */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              {t.detail.timelineHeading}
            </h3>
            <p style={{ fontSize: '0.775rem', color: '#64748b' }}>
              {t.detail.timelineSubtitle}
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem' }}>
            {report.history.map((entry) => (
              <div key={entry.id} className="timeline-item">
                <div className="timeline-dot" />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '0.25rem',
                      backgroundColor: entry.actorRole === 'coordinator' ? '#ecfdf5' : '#f1f5f9',
                      color: entry.actorRole === 'coordinator' ? '#047857' : '#475569'
                    }}>
                      {entry.actorRole === 'coordinator' ? '🛡️ Coordinator' : '👤 Resident'}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>
                      Status: {t.statuses[entry.toStatus]?.label || entry.toStatus}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#334155', marginTop: '0.25rem', lineHeight: 1.4 }}>
                  {entry.actionNote}
                </p>
                {entry.proofPhotoUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img
                      src={entry.proofPhotoUrl}
                      alt="Resolution verification"
                      style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* COORDINATOR ACTIONS (Protected: only visible when isCoordinator === true) */}
        {isCoordinator && (
          <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #86efac', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#065f46' }}>
                  {t.coordinator.statusChangeHeading}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowDuplicateInput(!showDuplicateInput)}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer' }}
                >
                  🔗 {t.coordinator.duplicateBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFlagInput(!showFlagInput)}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '0.25rem', border: '1px solid #fca5a5', backgroundColor: '#fef2f2', color: '#b91c1c', cursor: 'pointer' }}
                >
                  🚩 {t.coordinator.flagBtn}
                </button>
              </div>
            </div>

            {/* Duplicate Input Dropdown */}
            {showDuplicateInput && (
              <form onSubmit={handleDuplicateSubmit} style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e', marginBottom: '0.35rem' }}>
                  Mark this report as duplicate of another report ID:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="e.g. CS-2026-001"
                    className="form-input"
                    value={duplicateOfId}
                    onChange={(e) => setDuplicateOfId(e.target.value)}
                    style={{ fontSize: '0.8rem', minHeight: '36px' }}
                  />
                  <button type="submit" className="btn-primary" style={{ minHeight: '36px', fontSize: '0.8rem' }}>
                    Confirm Duplicate
                  </button>
                </div>
              </form>
            )}

            {/* Flag Misleading Input */}
            {showFlagInput && (
              <form onSubmit={handleFlagSubmit} style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #fca5a5' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b91c1c', marginBottom: '0.35rem' }}>
                  Flag as inappropriate / misleading:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Reason (e.g. Obscene text, spam, fake landmark)..."
                    className="form-input"
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    style={{ fontSize: '0.8rem', minHeight: '36px' }}
                  />
                  <button type="submit" className="btn-danger" style={{ minHeight: '36px', fontSize: '0.8rem' }}>
                    Flag Report
                  </button>
                </div>
              </form>
            )}

            {/* Main Status Update Form */}
            <form onSubmit={handleStatusSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#065f46', marginBottom: '0.25rem' }}>
                    {t.coordinator.selectNewStatus}
                  </label>
                  <select
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                  >
                    <option value="submitted">{t.statuses.submitted.label}</option>
                    <option value="under_review">{t.statuses.under_review.label}</option>
                    <option value="action_planned">{t.statuses.action_planned.label}</option>
                    <option value="resolved">{t.statuses.resolved.label}</option>
                    <option value="unable_to_resolve">{t.statuses.unable_to_resolve.label}</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#065f46', marginBottom: '0.25rem' }}>
                  {t.coordinator.actionNotePrompt} <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder={t.coordinator.actionNotePlaceholder}
                />
                {statusUpdateError && (
                  <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem' }}>{statusUpdateError}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', fontSize: '0.9rem' }}
              >
                💾 {t.coordinator.updateStatusBtn}
              </button>
            </form>

            {/* Internal Staff Notes */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #bbf7d0' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#065f46', marginBottom: '0.5rem' }}>
                {t.coordinator.internalNotesHeading}
              </h4>

              {report.internalNotes && report.internalNotes.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {report.internalNotes.map(n => (
                    <div key={n.id} style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0.375rem', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                        <span>👤 {n.author}</span>
                        <span>{new Date(n.timestamp).toLocaleString()}</span>
                      </div>
                      <div style={{ color: '#1e293b' }}>{n.note}</div>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleInternalNoteSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder={t.coordinator.addNotePlaceholder}
                  className="form-input"
                  value={newInternalNote}
                  onChange={(e) => setNewInternalNote(e.target.value)}
                  style={{ fontSize: '0.8rem', minHeight: '38px' }}
                />
                <button type="submit" className="btn-secondary" style={{ fontSize: '0.8rem', minHeight: '38px', whiteSpace: 'nowrap' }}>
                  {t.coordinator.addNoteBtn}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal Close Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ minHeight: '38px' }}
          >
            {t.detail.close}
          </button>
        </div>

      </div>
    </div>
  );
};
