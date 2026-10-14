import { SanitationReport, ReportStats, ReportStatus, StatusHistoryEntry } from '../types';

const STORAGE_KEY = 'cleanstreet_reports_v1';
const COORDINATOR_AUTH_KEY = 'cleanstreet_coord_auth_v1';
export const COORDINATOR_DEFAULT_PIN = 'CLEAN2026';

const INITIAL_SEED_REPORTS: SanitationReport[] = [
  {
    id: "CS-2026-001",
    title: "Overflowing municipal dumpster spilling into pedestrian lane",
    category: "garbage_overflow",
    description: "The twin green and blue community dumpsters have not been cleared for over 4 days. Dogs and cattle are scattering waste across the road, creating an intense foul stench.",
    locationLandmark: "Opposite Little Angels Primary School, 3rd Cross, Ward 12",
    coordinates: {
      latitude: 17.439,
      longitude: 78.441
    },
    urgency: "critical",
    status: "action_planned",
    verificationStatus: "coordinator_verified",
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    internalNotes: [
      {
        id: "note-1",
        timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        author: "Coordinator Priya",
        note: "Called Ward 12 Sanitary Inspector. Compactor truck had a hydraulic breakdown on Monday; replacement assigned for Wednesday 7 AM."
      }
    ],
    history: [
      {
        id: "hist-1",
        fromStatus: "submitted",
        toStatus: "submitted",
        timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        actorRole: "resident",
        actionNote: "Report submitted by local resident via community form."
      },
      {
        id: "hist-2",
        fromStatus: "submitted",
        toStatus: "under_review",
        timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        actorRole: "coordinator",
        actionNote: "Site inspected by Coordinator Priya. Confirmed severe spill near school footpath."
      },
      {
        id: "hist-3",
        fromStatus: "under_review",
        toStatus: "action_planned",
        timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
        actorRole: "coordinator",
        actionNote: "Escalated to Zonal Solid Waste Management team. Special clearing drive scheduled."
      }
    ]
  },
  {
    id: "CS-2026-002",
    title: "Choked storm water drain causing stagnant black water",
    category: "blocked_drain",
    description: "Plastic covers and silt have completely clogged the underground culvert opening. Stagnant black water is overflowing onto the road with high mosquito breeding risk.",
    locationLandmark: "Near Gandhi Community Hall, 5th Main Road",
    coordinates: {
      latitude: 17.442,
      longitude: 78.448
    },
    urgency: "high",
    status: "resolved",
    verificationStatus: "resolved_verified",
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    internalNotes: [
      {
        id: "note-2",
        timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        author: "Coordinator Ramesh",
        note: "Ward Engineering wing dispatched mini desilting excavator."
      }
    ],
    history: [
      {
        id: "hist-4",
        fromStatus: "submitted",
        toStatus: "submitted",
        timestamp: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
        actorRole: "resident",
        actionNote: "Report logged by resident."
      },
      {
        id: "hist-5",
        fromStatus: "submitted",
        toStatus: "action_planned",
        timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        actorRole: "coordinator",
        actionNote: "Drain desilting team mobilized along with disinfectant spraying."
      },
      {
        id: "hist-6",
        fromStatus: "action_planned",
        toStatus: "resolved",
        timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        actorRole: "coordinator",
        actionNote: "Culvert unclogged and silt cleared away to processing center. Bleaching powder applied across water channel."
      }
    ]
  },
  {
    id: "CS-2026-003",
    title: "Construction debris dumped in vacant corner plot",
    category: "illegal_dumping",
    description: "Tractor unloaded broken concrete blocks, tiles, and plaster overnight. Obstruction blocks vehicular turning radius.",
    locationLandmark: "Plot 42, Green Avenue, Behind Water Tank",
    urgency: "normal",
    status: "under_review",
    verificationStatus: "coordinator_verified",
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    internalNotes: [],
    history: [
      {
        id: "hist-7",
        fromStatus: "submitted",
        toStatus: "submitted",
        timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
        actorRole: "resident",
        actionNote: "Resident reported unauthorized dumping."
      },
      {
        id: "hist-8",
        fromStatus: "submitted",
        toStatus: "under_review",
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        actorRole: "coordinator",
        actionNote: "Coordinator verified plot boundaries and notified town planning enforcement."
      }
    ]
  },
  {
    id: "CS-2026-004",
    title: "Scattered plastic wrappers and bottles across Children's Park entrance",
    category: "litter",
    description: "Vendors and visitors leaving plastic cups, snack wrappers, and beverage cans near playground gates without any dustbins available.",
    locationLandmark: "Children Welfare Park Gate #2, North Avenue",
    urgency: "normal",
    status: "submitted",
    verificationStatus: "unverified",
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    internalNotes: [],
    history: [
      {
        id: "hist-9",
        fromStatus: "submitted",
        toStatus: "submitted",
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        actorRole: "resident",
        actionNote: "Initial submission by resident."
      }
    ]
  }
];

export class StorageService {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  static getReports(): SanitationReport[] {
    if (!this.isBrowser()) {
      return INITIAL_SEED_REPORTS;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_REPORTS));
        return INITIAL_SEED_REPORTS;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse reports from localStorage', e);
      return INITIAL_SEED_REPORTS;
    }
  }

  static saveReports(reports: SanitationReport[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save reports to localStorage', e);
    }
  }

  static getReportById(id: string): SanitationReport | undefined {
    const reports = this.getReports();
    return reports.find(r => r.id === id);
  }

  static createReport(input: Omit<SanitationReport, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'internalNotes' | 'verificationStatus' | 'status'> & { status?: ReportStatus }): SanitationReport {
    const reports = this.getReports();
    const count = reports.length + 1;
    const year = new Date().getFullYear();
    const id = `CS-${year}-${String(count).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const initialStatus = input.status || 'submitted';

    const initialHistoryEntry: StatusHistoryEntry = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fromStatus: initialStatus,
      toStatus: initialStatus,
      timestamp: now,
      actorRole: 'resident',
      actionNote: 'Report registered in community platform.'
    };

    const newReport: SanitationReport = {
      ...input,
      id,
      status: initialStatus,
      verificationStatus: 'unverified',
      createdAt: now,
      updatedAt: now,
      internalNotes: [],
      history: [initialHistoryEntry]
    };

    const updated = [newReport, ...reports];
    this.saveReports(updated);
    return newReport;
  }

  static updateReportStatus(
    id: string,
    newStatus: ReportStatus,
    actionNote: string,
    actorRole: 'coordinator' | 'resident' = 'coordinator',
    proofPhotoUrl?: string
  ): SanitationReport | null {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) return null;

    const report = reports[index];
    const prevStatus = report.status;
    const now = new Date().toISOString();

    const newHistoryEntry: StatusHistoryEntry = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fromStatus: prevStatus,
      toStatus: newStatus,
      timestamp: now,
      actorRole,
      actionNote: actionNote.trim(),
      proofPhotoUrl
    };

    // Calculate updated verification status
    let newVerificationStatus = report.verificationStatus;
    if (actorRole === 'coordinator') {
      if (newStatus === 'resolved') {
        newVerificationStatus = 'resolved_verified';
      } else if (newStatus !== 'submitted') {
        newVerificationStatus = 'coordinator_verified';
      }
    }

    const updatedReport: SanitationReport = {
      ...report,
      status: newStatus,
      verificationStatus: newVerificationStatus,
      updatedAt: now,
      history: [...report.history, newHistoryEntry]
    };

    reports[index] = updatedReport;
    this.saveReports(reports);
    return updatedReport;
  }

  static addInternalNote(id: string, noteText: string, author: string = 'Coordinator'): SanitationReport | null {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) return null;

    const report = reports[index];
    const noteEntry = {
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author,
      note: noteText.trim()
    };

    const updatedReport: SanitationReport = {
      ...report,
      updatedAt: new Date().toISOString(),
      internalNotes: [...report.internalNotes, noteEntry]
    };

    reports[index] = updatedReport;
    this.saveReports(reports);
    return updatedReport;
  }

  static markAsDuplicate(id: string, duplicateOfId: string, note: string): SanitationReport | null {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) return null;

    const report = reports[index];
    const now = new Date().toISOString();

    const historyEntry: StatusHistoryEntry = {
      id: `hist-${Date.now()}`,
      fromStatus: report.status,
      toStatus: 'unable_to_resolve',
      timestamp: now,
      actorRole: 'coordinator',
      actionNote: `Marked as duplicate of report ${duplicateOfId}. Note: ${note}`
    };

    const updatedReport: SanitationReport = {
      ...report,
      isDuplicate: true,
      duplicateOfId,
      status: 'unable_to_resolve',
      updatedAt: now,
      history: [...report.history, historyEntry]
    };

    reports[index] = updatedReport;
    this.saveReports(reports);
    return updatedReport;
  }

  static flagReport(id: string, reason: string): SanitationReport | null {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) return null;

    const report = reports[index];
    const updatedReport: SanitationReport = {
      ...report,
      isFlagged: true,
      flagReason: reason.trim(),
      updatedAt: new Date().toISOString()
    };

    reports[index] = updatedReport;
    this.saveReports(reports);
    return updatedReport;
  }

  static getStats(): ReportStats {
    const reports = this.getReports();
    return {
      total: reports.length,
      unresolved: reports.filter(r => r.status === 'submitted' || r.status === 'under_review').length,
      inProgress: reports.filter(r => r.status === 'action_planned').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
      unableToResolve: reports.filter(r => r.status === 'unable_to_resolve').length,
      duplicates: reports.filter(r => r.isDuplicate).length
    };
  }

  static resetToSampleData(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_REPORTS));
  }

  static isCoordinatorAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    return sessionStorage.getItem(COORDINATOR_AUTH_KEY) === 'true';
  }

  static loginCoordinator(pin: string): boolean {
    if (!this.isBrowser()) return false;
    if (pin.trim() === COORDINATOR_DEFAULT_PIN) {
      sessionStorage.setItem(COORDINATOR_AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  static logoutCoordinator(): void {
    if (!this.isBrowser()) return;
    sessionStorage.removeItem(COORDINATOR_AUTH_KEY);
  }

  static exportToCsv(): string {
    const reports = this.getReports();
    const headers = [
      'Report ID',
      'Title',
      'Category',
      'Status',
      'Urgency',
      'Location Landmark',
      'Verification Status',
      'Created Date',
      'Last Updated',
      'Total History Steps'
    ];

    const rows = reports.map(r => [
      `"${r.id}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.category}"`,
      `"${r.status}"`,
      `"${r.urgency}"`,
      `"${r.locationLandmark.replace(/"/g, '""')}"`,
      `"${r.verificationStatus}"`,
      `"${new Date(r.createdAt).toLocaleString()}"`,
      `"${new Date(r.updatedAt).toLocaleString()}"`,
      r.history.length
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}
