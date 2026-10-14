import React, { useState, useMemo } from 'react';
import { SanitationReport, ProblemCategory, ReportStatus, SupportedLanguage, ReportStats } from '../types';
import { translations } from '../i18n/translations';
import { StatsOverview } from './StatsOverview';
import { ReportCard } from './ReportCard';

interface ReportDashboardProps {
  reports: SanitationReport[];
  stats: ReportStats;
  language: SupportedLanguage;
  onSelectReport: (report: SanitationReport) => void;
  onOpenReportForm: () => void;
  selectedStatusFilter: ReportStatus | 'all';
  onSelectStatusFilter: (status: ReportStatus | 'all') => void;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({
  reports,
  stats,
  language,
  onSelectReport,
  onOpenReportForm,
  selectedStatusFilter,
  onSelectStatusFilter
}) => {
  const t = translations[language];

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProblemCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'urgency'>('newest');

  // Filtered and Sorted Reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      // Status filter
      if (selectedStatusFilter !== 'all') {
        if (selectedStatusFilter === 'submitted' && !(r.status === 'submitted' || r.status === 'under_review')) {
          // Unresolved bucket matches submitted & under_review
          return false;
        } else if (selectedStatusFilter !== 'submitted' && r.status !== selectedStatusFilter) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'all' && r.category !== categoryFilter) {
        return false;
      }

      // Search query filter (matches ID, title, landmark, description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = r.id.toLowerCase().includes(query);
        const matchesTitle = r.title.toLowerCase().includes(query);
        const matchesLandmark = r.locationLandmark.toLowerCase().includes(query);
        const matchesDesc = r.description.toLowerCase().includes(query);
        if (!matchesId && !matchesTitle && !matchesLandmark && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'urgency') {
        const priorityOrder: Record<string, number> = { critical: 3, high: 2, normal: 1 };
        return (priorityOrder[b.urgency] || 0) - (priorityOrder[a.urgency] || 0);
      }
      return 0;
    });
  }, [reports, selectedStatusFilter, categoryFilter, searchQuery, sortBy]);

  const hasActiveFilters = searchQuery !== '' || categoryFilter !== 'all' || selectedStatusFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    onSelectStatusFilter('all');
  };

  return (
    <div className="clean-container" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem' }}>
      
      {/* Title & Action Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {t.dashboard.heading}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
            {t.dashboard.subtitle}
          </p>
        </div>

        <button
          onClick={onOpenReportForm}
          className="btn-primary"
          style={{ fontSize: '0.95rem' }}
        >
          ➕ {t.tabs.report}
        </button>
      </div>

      {/* KPI Stats Overview Cards */}
      <StatsOverview
        stats={stats}
        language={language}
        activeStatusFilter={selectedStatusFilter}
        onSelectStatusFilter={onSelectStatusFilter}
      />

      {/* Filter and Search Bar */}
      <div className="clean-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          
          {/* Search Input */}
          <div style={{ gridColumn: 'span 1' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
              🔍 {t.dashboard.filterSearch}
            </label>
            <input
              type="text"
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.dashboard.filterSearchPlaceholder}
            />
          </div>

          {/* Category Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
              📂 {t.dashboard.filterCategory}
            </label>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
            >
              <option value="all">{t.dashboard.filterAll}</option>
              {(Object.keys(t.categories) as ProblemCategory[]).map(catKey => (
                <option key={catKey} value={catKey}>
                  {t.categories[catKey].icon} {t.categories[catKey].label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
              🚦 {t.dashboard.filterStatus}
            </label>
            <select
              className="form-select"
              value={selectedStatusFilter}
              onChange={(e) => onSelectStatusFilter(e.target.value as any)}
            >
              <option value="all">
                {language === 'te' ? 'అన్ని స్థితులు' : 'All Statuses'}
              </option>
              <option value="submitted">
                {t.statuses.submitted.label}
              </option>
              <option value="under_review">
                {t.statuses.under_review.label}
              </option>
              <option value="action_planned">
                {t.statuses.action_planned.label}
              </option>
              <option value="resolved">
                {t.statuses.resolved.label}
              </option>
              <option value="unable_to_resolve">
                {t.statuses.unable_to_resolve.label}
              </option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
              ↕️ {t.dashboard.sortBy}
            </label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="newest">{t.dashboard.sortNewest}</option>
              <option value="oldest">{t.dashboard.sortOldest}</option>
              <option value="urgency">{t.dashboard.sortUrgency}</option>
            </select>
          </div>

        </div>

        {/* Clear Filters Indicator */}
        {hasActiveFilters && (
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color: '#64748b' }}>
              Showing {filteredReports.length} of {reports.length} reports
            </span>
            <button
              onClick={clearFilters}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc2626',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ✕ Clear active filters
            </button>
          </div>
        )}
      </div>

      {/* Reports Grid */}
      {filteredReports.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              language={language}
              onSelect={onSelectReport}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="clean-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            {t.dashboard.noReportsFound}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            {t.dashboard.noReportsSub}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-secondary">
                Reset Filters
              </button>
            )}
            <button onClick={onOpenReportForm} className="btn-primary">
              ➕ Submit New Report
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
