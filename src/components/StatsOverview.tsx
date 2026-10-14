import React from 'react';
import { ReportStats, ReportStatus, SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';

interface StatsOverviewProps {
  stats: ReportStats;
  language: SupportedLanguage;
  activeStatusFilter: ReportStatus | 'all';
  onSelectStatusFilter: (status: ReportStatus | 'all') => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  stats,
  language,
  activeStatusFilter,
  onSelectStatusFilter
}) => {
  const t = translations[language];

  const cards = [
    {
      id: 'all',
      title: t.dashboard.statsTotal,
      count: stats.total,
      icon: '📋',
      color: '#3b82f6',
      bg: '#eff6ff',
      border: '#bfdbfe',
      activeBorder: '#2563eb'
    },
    {
      id: 'submitted',
      title: t.dashboard.statsUnresolved,
      count: stats.unresolved,
      icon: '⏳',
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      activeBorder: '#b45309'
    },
    {
      id: 'action_planned',
      title: t.dashboard.statsInProgress,
      count: stats.inProgress,
      icon: '⚙️',
      color: '#7c3aed',
      bg: '#f5f3ff',
      border: '#ddd6fe',
      activeBorder: '#6d28d9'
    },
    {
      id: 'resolved',
      title: t.dashboard.statsResolved,
      count: stats.resolved,
      icon: '✅',
      color: '#059669',
      bg: '#ecfdf5',
      border: '#a7f3d0',
      activeBorder: '#047857'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
      {cards.map((card) => {
        const isSelected = activeStatusFilter === card.id;
        return (
          <div
            key={card.id}
            onClick={() => onSelectStatusFilter(card.id as any)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectStatusFilter(card.id as any); }}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              border: `2px solid ${isSelected ? card.activeBorder : card.border}`,
              boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              transform: isSelected ? 'translateY(-2px)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                {card.count}
              </div>
            </div>
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '0.75rem',
              backgroundColor: card.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              color: card.color
            }}>
              {card.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
};
