import React, { useState, useEffect, useCallback } from 'react';
import { SanitationReport, SupportedLanguage, ReportStatus, ReportStats } from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { CivicBanner } from './components/CivicBanner';
import { ReportDashboard } from './components/ReportDashboard';
import { ReportForm } from './components/ReportForm';
import { ReportDetailModal } from './components/ReportDetailModal';
import { CoordinatorPanel } from './components/CoordinatorPanel';
import { CoordinatorAuthModal } from './components/CoordinatorAuthModal';
import { CivicGuidance } from './components/CivicGuidance';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'report' | 'coordinator' | 'guidance'>('dashboard');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [reports, setReports] = useState<SanitationReport[]>([]);
  const [stats, setStats] = useState<ReportStats>({
    total: 0,
    unresolved: 0,
    inProgress: 0,
    resolved: 0,
    unableToResolve: 0,
    duplicates: 0
  });
  const [isCoordinator, setIsCoordinator] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<SanitationReport | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<ReportStatus | 'all'>('all');

  // Load persistent reports and authentication state
  const loadData = useCallback(() => {
    const loadedReports = StorageService.getReports();
    const loadedStats = StorageService.getStats();
    setReports(loadedReports);
    setStats(loadedStats);
    setIsCoordinator(StorageService.isCoordinatorAuthenticated());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler for new report submission
  const handleReportCreated = (newReport: SanitationReport) => {
    loadData();
    // Keep user on the form's success screen, or they can navigate to dashboard
  };

  // Handler for report update (status change, notes, duplicate)
  const handleReportUpdated = (updated: SanitationReport) => {
    loadData();
    setSelectedReport(updated);
  };

  // Coordinator login success
  const handleCoordinatorAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsCoordinator(true);
    setCurrentTab('coordinator');
    loadData();
  };

  // Coordinator logout
  const handleCoordinatorLogout = () => {
    StorageService.logoutCoordinator();
    setIsCoordinator(false);
    if (currentTab === 'coordinator') {
      setCurrentTab('dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      {/* Civic Transparency Notice Banner */}
      <CivicBanner
        language={language}
        onOpenGuidance={() => setCurrentTab('guidance')}
      />

      {/* Main App Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onLanguageChange={setLanguage}
        isCoordinator={isCoordinator}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogoutCoordinator={handleCoordinatorLogout}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {currentTab === 'dashboard' && (
          <ReportDashboard
            reports={reports}
            stats={stats}
            language={language}
            onSelectReport={(r) => setSelectedReport(r)}
            onOpenReportForm={() => setCurrentTab('report')}
            selectedStatusFilter={selectedStatusFilter}
            onSelectStatusFilter={setSelectedStatusFilter}
          />
        )}

        {currentTab === 'report' && (
          <ReportForm
            language={language}
            onReportCreated={handleReportCreated}
            onNavigateToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'coordinator' && (
          isCoordinator ? (
            <CoordinatorPanel
              reports={reports}
              language={language}
              onSelectReport={(r) => setSelectedReport(r)}
              onRefreshData={loadData}
              onLogout={handleCoordinatorLogout}
            />
          ) : (
            <div className="clean-container" style={{ maxWidth: '480px', paddingTop: '4rem', textAlign: 'center' }}>
              <div className="clean-card" style={{ padding: '2.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Coordinator Authentication Required
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
                  You must authenticate to access the community coordinator administration panel.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  Enter Passcode
                </button>
              </div>
            </div>
          )
        )}

        {currentTab === 'guidance' && (
          <CivicGuidance
            language={language}
            onOpenReportForm={() => setCurrentTab('report')}
          />
        )}
      </main>

      {/* Report Details & Audit Trail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          language={language}
          isCoordinator={isCoordinator}
          onClose={() => setSelectedReport(null)}
          onReportUpdated={handleReportUpdated}
        />
      )}

      {/* Coordinator Authentication Modal */}
      {isAuthModalOpen && (
        <CoordinatorAuthModal
          language={language}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleCoordinatorAuthSuccess}
        />
      )}

      {/* App Footer */}
      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '1.5rem 0', marginTop: 'auto' }}>
        <div className="clean-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
          <div>
            <strong>CleanStreet</strong> — Community-Powered Sanitation Reporting Platform.
          </div>
          <div>
            Built with React, TypeScript & civic transparency principles. No personal tracking.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
