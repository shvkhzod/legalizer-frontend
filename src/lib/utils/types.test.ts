import { describe, it, expect } from 'vitest';
import type {
  ComplianceStatus,
  ComplianceCheck,
  ComplianceReport,
  ScrapedData
} from './types';

describe('Type Definitions', () => {
  describe('ComplianceStatus', () => {
    it('should accept valid status values', () => {
      const validStatuses: ComplianceStatus[] = [
        'Compliant',
        'Warning',
        'Non-Compliant',
        'Info'
      ];

      validStatuses.forEach(status => {
        expect(['Compliant', 'Warning', 'Non-Compliant', 'Info']).toContain(status);
      });
    });
  });

  describe('ComplianceCheck', () => {
    it('should validate ComplianceCheck structure', () => {
      const check: ComplianceCheck = {
        id: 'test-check',
        title: 'Test Check',
        status: 'Compliant',
        summary: 'This is a test summary.',
        recommendation: 'This is a test recommendation.'
      };

      expect(check).toHaveProperty('id');
      expect(check).toHaveProperty('title');
      expect(check).toHaveProperty('status');
      expect(check).toHaveProperty('summary');
      expect(check).toHaveProperty('recommendation');
      expect(typeof check.id).toBe('string');
      expect(typeof check.title).toBe('string');
      expect(typeof check.summary).toBe('string');
      expect(typeof check.recommendation).toBe('string');
    });
  });

  describe('ComplianceReport', () => {
    it('should validate ComplianceReport structure', () => {
      const report: ComplianceReport = {
        scannedUrl: 'https://example.com',
        scanDate: new Date().toISOString(),
        overallStatus: 'Compliant',
        overallScore: 85,
        summary: {
          goodPoints: ['Good point 1', 'Good point 2'],
          warnings: ['Warning 1'],
          threats: []
        },
        checks: {
          websitePolicies: [],
          security: [],
          memberData: [],
          marketing: [],
          payments: []
        }
      };

      expect(report).toHaveProperty('scannedUrl');
      expect(report).toHaveProperty('scanDate');
      expect(report).toHaveProperty('overallStatus');
      expect(report).toHaveProperty('overallScore');
      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('checks');

      expect(typeof report.scannedUrl).toBe('string');
      expect(typeof report.scanDate).toBe('string');
      expect(typeof report.overallScore).toBe('number');
      expect(report.overallScore).toBeGreaterThanOrEqual(0);
      expect(report.overallScore).toBeLessThanOrEqual(100);

      expect(Array.isArray(report.summary.goodPoints)).toBe(true);
      expect(Array.isArray(report.summary.warnings)).toBe(true);
      expect(Array.isArray(report.summary.threats)).toBe(true);

      expect(Array.isArray(report.checks.websitePolicies)).toBe(true);
      expect(Array.isArray(report.checks.security)).toBe(true);
      expect(Array.isArray(report.checks.memberData)).toBe(true);
      expect(Array.isArray(report.checks.marketing)).toBe(true);
      expect(Array.isArray(report.checks.payments)).toBe(true);
    });

    it('should validate ComplianceReport with populated checks', () => {
      const report: ComplianceReport = {
        scannedUrl: 'https://example.com',
        scanDate: new Date().toISOString(),
        overallStatus: 'Warning',
        overallScore: 70,
        summary: {
          goodPoints: ['Has SSL'],
          warnings: ['No cookie policy'],
          threats: []
        },
        checks: {
          websitePolicies: [
            {
              id: 'privacy_policy',
              title: 'Privacy Policy',
              status: 'Compliant',
              summary: 'Privacy policy found.',
              recommendation: 'Keep it updated.'
            }
          ],
          security: [
            {
              id: 'ssl',
              title: 'SSL Certificate',
              status: 'Compliant',
              summary: 'Site uses HTTPS.',
              recommendation: 'No action needed.'
            }
          ],
          memberData: [],
          marketing: [],
          payments: []
        }
      };

      expect(report.checks.websitePolicies).toHaveLength(1);
      expect(report.checks.security).toHaveLength(1);
      expect(report.checks.websitePolicies[0].id).toBe('privacy_policy');
      expect(report.checks.security[0].id).toBe('ssl');
    });
  });

  describe('ScrapedData', () => {
    it('should validate ScrapedData structure', () => {
      const scrapedData: ScrapedData = {
        scannedUrl: 'https://example.com',
        usesSSL: true,
        foundPages: {
          privacy: 'https://example.com/privacy',
          cookie: 'https://example.com/cookies',
          safeguarding: null
        },
        documentContents: {
          privacy: 'Privacy policy content',
          cookie: 'Cookie policy content',
          safeguarding: null
        },
        foundCopyright: true,
        paymentType: 'third-party',
        pecrCheck: 'opt-in',
        foundGiftAid: true,
        privacyPolicyChecks: {
          mentionsDSAR: true,
          mentionsDataProcessors: true
        }
      };

      expect(scrapedData).toHaveProperty('scannedUrl');
      expect(scrapedData).toHaveProperty('usesSSL');
      expect(scrapedData).toHaveProperty('foundPages');
      expect(scrapedData).toHaveProperty('documentContents');
      expect(scrapedData).toHaveProperty('foundCopyright');
      expect(scrapedData).toHaveProperty('paymentType');
      expect(scrapedData).toHaveProperty('pecrCheck');
      expect(scrapedData).toHaveProperty('foundGiftAid');
      expect(scrapedData).toHaveProperty('privacyPolicyChecks');

      expect(typeof scrapedData.scannedUrl).toBe('string');
      expect(typeof scrapedData.usesSSL).toBe('boolean');
      expect(typeof scrapedData.foundCopyright).toBe('boolean');
      expect(typeof scrapedData.foundGiftAid).toBe('boolean');

      expect(['third-party', 'self-hosted', 'none']).toContain(scrapedData.paymentType);
      expect(['opt-in', 'opt-out', 'unknown']).toContain(scrapedData.pecrCheck);
    });

    it('should accept null values in foundPages', () => {
      const scrapedData: ScrapedData = {
        scannedUrl: 'https://example.com',
        usesSSL: false,
        foundPages: {
          privacy: null,
          cookie: null,
          safeguarding: null
        },
        documentContents: {
          privacy: null,
          cookie: null,
          safeguarding: null
        },
        foundCopyright: false,
        paymentType: 'none',
        pecrCheck: 'unknown',
        foundGiftAid: false,
        privacyPolicyChecks: {
          mentionsDSAR: false,
          mentionsDataProcessors: false
        }
      };

      expect(scrapedData.foundPages.privacy).toBeNull();
      expect(scrapedData.foundPages.cookie).toBeNull();
      expect(scrapedData.foundPages.safeguarding).toBeNull();
      expect(scrapedData.documentContents.privacy).toBeNull();
      expect(scrapedData.documentContents.cookie).toBeNull();
      expect(scrapedData.documentContents.safeguarding).toBeNull();
    });

    it('should validate privacyPolicyChecks structure', () => {
      const scrapedData: ScrapedData = {
        scannedUrl: 'https://example.com',
        usesSSL: true,
        foundPages: { privacy: null, cookie: null, safeguarding: null },
        documentContents: { privacy: null, cookie: null, safeguarding: null },
        foundCopyright: true,
        paymentType: 'third-party',
        pecrCheck: 'opt-in',
        foundGiftAid: true,
        privacyPolicyChecks: {
          mentionsDSAR: true,
          mentionsDataProcessors: false
        }
      };

      expect(scrapedData.privacyPolicyChecks).toHaveProperty('mentionsDSAR');
      expect(scrapedData.privacyPolicyChecks).toHaveProperty('mentionsDataProcessors');
      expect(typeof scrapedData.privacyPolicyChecks.mentionsDSAR).toBe('boolean');
      expect(typeof scrapedData.privacyPolicyChecks.mentionsDataProcessors).toBe('boolean');
    });
  });
});
