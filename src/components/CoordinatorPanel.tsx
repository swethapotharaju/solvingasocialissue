import React, { useState } from 'react';
import { SanitationReport, SupportedLanguage, ReportStatus } from '../types';
import { translations } from '../i18n/translations';
import { StorageService } from '../services/storage';

interface CoordinatorPanelProps {
  reports: SanitationReport[];
  language: SupportedLanguage;
  onSelectReport: (report: SanitationReport) => void;
  onRefreshData: () => void;
  onLogout: () => void;
}

export const CoordinatorPanel: React.FC<CoordinatorPanelProps> = ({
  reports,
  language,
  onSelectReport,
  onRefreshData,
  onLogout
}) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'flagged'>('pending');
  const [quickUpdateId, setQuickUpdateId] = useState<string | null>(null);
  const [quickStatus, setQuickStatus] = useState<ReportStatus>('under_review');
  const [quickNote, setQuickNote] = useState('');

  // Pending reports requiring coordinator attention
  const pendingReports = reports.filter(r => r.status === 'submitted' || r.status === 'under_review');
  const flaggedReports = reports.filter(r => r.isFlagged || r.isDuplicate);

  const displayedReports = activeTab === 'pending' 
    ? pendingReports 
    : activeTab === 'flagged' 
      ? flaggedReports 
      : reports;

  // Handle Quick Status Update from Table
  const handleQuickSubmit = (e: React.FormEvent, reportId: string) => {
    e.preventDefault();
    if (!quickNote.trim()) {
      alert('Please enter an action note describing the change.');
      return;
    }

    StorageService.updateReportStatus(reportId, quickStatus, quickNote.trim(), 'coordinator');
    setQuickUpdateId(null);
    setQuickNote('');
    onRefreshData();
  };

  // CSV Export Download Trigger
  const handleExportCsv = () => {
    const csvContent = StorageService.exportToCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cleanstreet_reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="clean-container" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem' }}>
      
      {/* Top Banner */}
      <div style={{
        backgroundColor: '#064e3b',
        color: '#ffffff',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            width: '3.25rem',
            height: '3.25rem',
            borderRadius: '0.5rem',
            backgroundColor: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.65rem'
          }}>
            🛡️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.2 }}>
                {t.coordinator.title}
              </h1>
              <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '9999px', backgroundColor: '#10b981', color: '#064e3b', fontWeight: 800 }}>
                VERIFIED AUTH
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#a7f3d0', marginTop: '0.2rem' }}>
              {t.coordinator.subtitle}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCsv}
            style={{
              padding: '0.5rem 0.875rem',
              borderRadius: '0.5rem',
              backgroundColor: '#047857',
              color: '#ffffff',
              border: '1px solid #10b981',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            📥 {t.coordinator.exportCsvBtn}
          </button>

          <button
            onClick={onLogout}
            style={{
              padding: '0.5rem 0.875rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🚪 {t.coordinator.logoutButton}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            backgroundColor: activeTab === 'pending' ? '#ecfdf5' : '#f8fafc',
            color: activeTab === 'pending' ? '#065f46' : '#475569',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <span>⏳ Awaiting Action ({pendingReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            backgroundColor: activeTab === 'all' ? '#ecfdf5' : '#f8fafc',
            color: activeTab === 'all' ? '#065f46' : '#475569',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          <span>📑 All Submissions ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('flagged')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            backgroundColor: activeTab === 'flagged' ? '#fef2f2' : '#f8fafc',
            color: activeTab === 'flagged' ? '#991b1b' : '#475569',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          <span>🚩 Duplicates & Moderation ({flaggedReports.length})</span>
        </button>
      </div>

      {/* Reports Table / List */}
      <div className="clean-card" style={{ overflow: 'hidden' }}>
        {displayedReports.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>ID</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Category & Title</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Landmark</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Priority</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedReports.map((r) => {
                  const cat = t.categories[r.category] || { label: r.category, icon: '📍' };
                  const stat = t.statuses[r.status] || { label: r.status, badgeText: r.status };
                  const isQuickEditing = quickUpdateId === r.id;

                  return (
                    <React.Fragment key={r.id}>
                      <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: '#334155' }}>
                          {r.id}
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{r.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {cat.icon} {cat.label}
                          </div>
                        </td>
                        <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>
                          📍 {r.locationLandmark}
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <span className={`badge badge-${r.status.replace('_', '-')}`}>
                            {stat.badgeText}
                          </span>
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: r.urgency === 'critical' ? '#dc2626' : r.urgency === 'high' ? '#c2410c' : '#475569'
                          }}>
                            {r.urgency.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '0.875rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            onClick={() => onSelectReport(r)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '0.375rem',
                              backgroundColor: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              color: '#334155',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              marginRight: '0.35rem'
                            }}
                          >
                            🔍 Full Review
                          </button>
                          <button
                            onClick={() => {
                              if (isQuickEditing) {
                                setQuickUpdateId(null);
                              } else {
                                setQuickUpdateId(r.id);
                                setQuickStatus(r.status);
                              }
                            }}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '0.375rem',
                              backgroundColor: isQuickEditing ? '#fee2e2' : '#ecfdf5',
                              border: isQuickEditing ? '1px solid #fca5a5' : '1px solid #a7f3d0',
                              color: isQuickEditing ? '#b91c1c' : '#047857',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {isQuickEditing ? 'Cancel' : '⚡ Quick Status'}
                          </button>
                        </td>
                      </tr>

                      {/* Quick Status Inline Form */}
                      {isQuickEditing && (
                        <tr>
                          <td colSpan={6} style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderBottom: '2px solid #86efac' }}>
                            <form onSubmit={(e) => handleQuickSubmit(e, r.id)} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#065f46' }}>
                                Fast Status Transition:
                              </span>
                              <select
                                className="form-select"
                                value={quickStatus}
                                onChange={(e) => setQuickStatus(e.target.value as ReportStatus)}
                                style={{ width: 'auto', minHeight: '36px', fontSize: '0.85rem' }}
                              >
                                <option value="submitted">{t.statuses.submitted.label}</option>
                                <option value="under_review">{t.statuses.under_review.label}</option>
                                <option value="action_planned">{t.statuses.action_planned.label}</option>
                                <option value="resolved">{t.statuses.resolved.label}</option>
                                <option value="unable_to_resolve">{t.statuses.unable_to_resolve.label}</option>
                              </select>
                              <input
                                type="text"
                                placeholder="Describe action taken/scheduled (mandatory)..."
                                className="form-input"
                                value={quickNote}
                                onChange={(e) => setQuickNote(e.target.value)}
                                style={{ flex: 1, minWidth: '240px', minHeight: '36px', fontSize: '0.85rem' }}
                              />
                              <button
                                type="submit"
                                className="btn-primary"
                                style={{ minHeight: '36px', fontSize: '0.85rem' }}
                              >
                                Save Status
                              </button>
                            </form>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✨</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              No Reports in this queue
            </h3>
            <p style={{ fontSize: '0.85rem' }}>
              All neighborhood sanitation reports in this category are up to date.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
