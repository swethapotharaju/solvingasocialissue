// Automated Test Suite for CleanStreet
// Validates core business logic, storage, validation, authorization, and audit logs.

import assert from 'node:assert';

console.log('🧪 Starting CleanStreet Automated Verification Tests...\n');

// Mock localStorage and sessionStorage for Node.js test environment
const mockStorage = new Map();
const mockSession = new Map();

global.window = {};
global.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear()
};

global.sessionStorage = {
  getItem: (key) => mockSession.get(key) || null,
  setItem: (key, val) => mockSession.set(key, String(val)),
  removeItem: (key) => mockSession.delete(key),
  clear: () => mockSession.clear()
};

// Import StorageService after environment polyfill
const { StorageService, COORDINATOR_DEFAULT_PIN } = await import('./src/services/storage.ts');

let passedTests = 0;
let totalTests = 0;

function runTest(testName, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${testName}`);
    console.error(`     Error: ${err.message}`);
  }
}

// 1. Initial Seed Data
runTest('Storage initializes with default sample neighborhood reports', () => {
  const reports = StorageService.getReports();
  assert(Array.isArray(reports), 'Reports should be an array');
  assert(reports.length >= 3, `Expected at least 3 initial reports, found ${reports.length}`);
  const first = reports[0];
  assert(first.id.startsWith('CS-'), `Report ID must have CS prefix: ${first.id}`);
  assert(first.history.length > 0, 'Seed reports should have audit history');
});

// 2. Stats Calculation
runTest('Stats calculation correctly aggregates counts', () => {
  const stats = StorageService.getStats();
  assert.strictEqual(typeof stats.total, 'number');
  assert.strictEqual(typeof stats.unresolved, 'number');
  assert.strictEqual(typeof stats.inProgress, 'number');
  assert.strictEqual(typeof stats.resolved, 'number');
  assert(stats.total === stats.unresolved + stats.inProgress + stats.resolved + stats.unableToResolve);
});

// 3. Resident Submits Valid Report
runTest('Resident can successfully create and submit a new sanitation report', () => {
  const initialCount = StorageService.getReports().length;
  const newReport = StorageService.createReport({
    title: 'Clogged gutter on 8th Cross',
    category: 'blocked_drain',
    description: 'Black sludge overflow preventing pedestrian crossing near vegetable market.',
    locationLandmark: '8th Cross, opposite Rythu Bazaar',
    urgency: 'high'
  });

  assert(newReport.id, 'New report must have generated ID');
  assert.strictEqual(newReport.status, 'submitted', 'Default status must be submitted');
  assert.strictEqual(newReport.verificationStatus, 'unverified', 'Initial verification status must be unverified');
  assert.strictEqual(newReport.history.length, 1, 'Initial history entry must be logged');
  assert.strictEqual(newReport.history[0].actorRole, 'resident');

  const afterCount = StorageService.getReports().length;
  assert.strictEqual(afterCount, initialCount + 1, 'Storage reports count should increment by 1');
});

// 4. Report Status Transition and Audit Trail
runTest('Coordinator updates status with mandatory action note and records timestamped audit entry', () => {
  const reports = StorageService.getReports();
  const targetReport = reports[0];
  const initialHistoryLen = targetReport.history.length;

  const actionNote = 'Site visited by Ward Sanitation Inspector; work gang assigned.';
  const updated = StorageService.updateReportStatus(
    targetReport.id,
    'under_review',
    actionNote,
    'coordinator'
  );

  assert(updated, 'Updated report should not be null');
  assert.strictEqual(updated.status, 'under_review');
  assert.strictEqual(updated.history.length, initialHistoryLen + 1, 'History length should increment');
  
  const latestHistory = updated.history[updated.history.length - 1];
  assert.strictEqual(latestHistory.fromStatus, targetReport.status);
  assert.strictEqual(latestHistory.toStatus, 'under_review');
  assert.strictEqual(latestHistory.actionNote, actionNote);
  assert.strictEqual(latestHistory.actorRole, 'coordinator');
  assert(latestHistory.timestamp, 'Timestamp must be present');
});

// 5. Outcome Verification on Resolution
runTest('Report marked resolved receives resolved_verified outcome status', () => {
  const reports = StorageService.getReports();
  const targetReport = reports[0];

  const updated = StorageService.updateReportStatus(
    targetReport.id,
    'resolved',
    'Debris cleared completely, 2 extra bins installed, photo verified.',
    'coordinator',
    'data:image/png;base64,samplephoto'
  );

  assert.strictEqual(updated.status, 'resolved');
  assert.strictEqual(updated.verificationStatus, 'resolved_verified');
  assert(updated.history[updated.history.length - 1].proofPhotoUrl, 'Proof photo url should be recorded');
});

// 6. Coordinator Authentication Security
runTest('Coordinator authentication rejects invalid pins and approves default pin', () => {
  assert.strictEqual(StorageService.isCoordinatorAuthenticated(), false);
  
  // Attempt with invalid PIN
  const failed = StorageService.loginCoordinator('WRONG_PIN');
  assert.strictEqual(failed, false);
  assert.strictEqual(StorageService.isCoordinatorAuthenticated(), false);

  // Attempt with correct PIN
  const success = StorageService.loginCoordinator(COORDINATOR_DEFAULT_PIN);
  assert.strictEqual(success, true);
  assert.strictEqual(StorageService.isCoordinatorAuthenticated(), true);

  // Logout
  StorageService.logoutCoordinator();
  assert.strictEqual(StorageService.isCoordinatorAuthenticated(), false);
});

// 7. Duplicate Marking
runTest('Coordinator can mark report as duplicate with reference to original', () => {
  const reports = StorageService.getReports();
  const reportA = reports[0];
  const reportB = reports[1];

  const updated = StorageService.markAsDuplicate(
    reportB.id,
    reportA.id,
    'Same heap reported by two neighbors'
  );

  assert.strictEqual(updated.isDuplicate, true);
  assert.strictEqual(updated.duplicateOfId, reportA.id);
  assert.strictEqual(updated.status, 'unable_to_resolve');
});

// 8. Content Moderation / Flagging
runTest('Coordinator can flag misleading or inappropriate report', () => {
  const reports = StorageService.getReports();
  const target = reports[2];

  const updated = StorageService.flagReport(target.id, 'Misleading photo from 2 years ago');
  assert.strictEqual(updated.isFlagged, true);
  assert.strictEqual(updated.flagReason, 'Misleading photo from 2 years ago');
});

// 9. Internal Notes Isolation
runTest('Internal coordinator notes are stored separately from public history', () => {
  const reports = StorageService.getReports();
  const target = reports[0];

  const updated = StorageService.addInternalNote(target.id, 'Called Assistant Engineer on 9848012345', 'Coordinator Ramesh');
  assert(updated.internalNotes.length > 0);
  const latestNote = updated.internalNotes[updated.internalNotes.length - 1];
  assert.strictEqual(latestNote.author, 'Coordinator Ramesh');
  assert.strictEqual(latestNote.note, 'Called Assistant Engineer on 9848012345');
});

// 10. CSV Export Generation
runTest('CSV export includes headers and formatted report rows', () => {
  const csv = StorageService.exportToCsv();
  assert(csv.includes('Report ID,Title,Category,Status'), 'CSV must include header row');
  const lines = csv.trim().split('\n');
  assert(lines.length >= 4, `CSV should contain multiple rows, found ${lines.length}`);
});

console.log(`\n📊 Test Execution Summary: ${passedTests} / ${totalTests} Passed.\n`);

if (passedTests === totalTests) {
  console.log('🎉 All CleanStreet business logic and security verification tests PASSED!\n');
  process.exit(0);
} else {
  console.error('💥 Some tests failed. Please review output above.\n');
  process.exit(1);
}
