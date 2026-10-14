export type ProblemCategory = 
  | 'garbage_overflow'
  | 'litter'
  | 'blocked_drain'
  | 'illegal_dumping'
  | 'other';

export type ReportStatus = 
  | 'submitted'
  | 'under_review'
  | 'action_planned'
  | 'resolved'
  | 'unable_to_resolve';

export type UrgencyLevel = 'normal' | 'high' | 'critical';

export type VerificationStatus = 'unverified' | 'coordinator_verified' | 'resolved_verified';

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
}

export interface StatusHistoryEntry {
  id: string;
  fromStatus: ReportStatus;
  toStatus: ReportStatus;
  timestamp: string; // ISO 8601
  actorRole: 'resident' | 'coordinator';
  actionNote: string;
  proofPhotoUrl?: string; // Optional photograph documenting resolution
}

export interface CoordinatorNote {
  id: string;
  timestamp: string;
  author: string;
  note: string;
}

export interface SanitationReport {
  id: string; // e.g. "CS-2026-001"
  title: string;
  category: ProblemCategory;
  description: string;
  locationLandmark: string;
  coordinates?: Coordinates;
  photoUrl?: string;
  urgency: UrgencyLevel;
  status: ReportStatus;
  verificationStatus: VerificationStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  isDuplicate?: boolean;
  duplicateOfId?: string;
  isFlagged?: boolean;
  flagReason?: string;
  internalNotes: CoordinatorNote[];
  history: StatusHistoryEntry[];
}

export interface ReportFilterOptions {
  category: ProblemCategory | 'all';
  status: ReportStatus | 'all';
  urgency: UrgencyLevel | 'all';
  searchQuery: string;
  dateRange: 'all' | 'today' | 'this_week' | 'this_month';
  sortBy: 'newest' | 'oldest' | 'urgency';
}

export interface ReportStats {
  total: number;
  unresolved: number;
  inProgress: number;
  resolved: number;
  unableToResolve: number;
  duplicates: number;
}

export type SupportedLanguage = 'en' | 'te';
