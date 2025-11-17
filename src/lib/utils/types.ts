// /src/lib/utils/types.ts

// --- Part 1: Report Output (The Goal) ---

export type ComplianceStatus =
  | 'Compliant'
  | 'Warning'
  | 'Non-Compliant'
  | 'Info';

export interface ComplianceCheck {
  id: string;
  title: string;
  status: ComplianceStatus;
  summary: string; // A 1-sentence summary of the finding.
  recommendation: string; // Actionable advice.
}

export interface ComplianceReport {
  scannedUrl: string;
  scanDate: string;
  overallStatus: ComplianceStatus;
  overallScore: number; // 0-100
  summary: {
    goodPoints: string[];
    warnings: string[];
    threats: string[];
  };
  checks: {
    websitePolicies: ComplianceCheck[];
    security: ComplianceCheck[];
    memberData: ComplianceCheck[]; // Will only contain 'Copyright'
    marketing: ComplianceCheck[]; // Will only contain 'PECR'
    payments: ComplianceCheck[]; // Will only contain 'PCI-DSS'
  };
}

// --- Part 2: Scraper Output (The Source) ---

/**
 * The data structure returned by the scraper.
 * This is the *only* input for the report engine.
 */
export interface ScrapedData {
  scannedUrl: string;
  usesSSL: boolean;
  foundPages: {
    privacy: string | null; // URL of the page if found
    cookie: string | null;
    safeguarding: string | null;
  };
  foundCopyright: boolean;
  paymentType: 'third-party' | 'self-hosted' | 'none';
  pecrCheck: 'opt-in' | 'opt-out' | 'unknown';
  foundGiftAid: boolean;
  privacyPolicyChecks: { // Checks *within* the privacy policy
    mentionsDSAR: boolean;
    mentionsDataProcessors: boolean;
  };
}
